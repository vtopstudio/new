"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDesignPrompt } from "@/lib/prompt-engine";
import { saveOrderFile } from "@/lib/storage";
import type { BriefField } from "@/lib/services";

const createOrderSchema = z.object({ serviceSlug: z.string().min(1) });

export async function createOrderAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/sign-in");
  const { serviceSlug } = createOrderSchema.parse({ serviceSlug: formData.get("serviceSlug") });
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) throw new Error("Услуга не найдена");
  const fields = service.fieldsConfig as BriefField[];
  const briefData: Record<string, string> = {};
  for (const field of fields) briefData[field.name] = String(formData.get(field.name) ?? "");
  const generatedPrompt = generateDesignPrompt({ service, briefData });
  const order = await prisma.order.create({ data: { userId: session.user.id, serviceId: service.id, briefData, generatedPrompt, price: service.basePrice, status: "WAITING_PAYMENT" } });

  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  const stored = [];
  for (const file of files) stored.push(await saveOrderFile(order.id, file));
  if (stored.length) {
    await prisma.orderFile.createMany({ data: stored.map((file) => ({ ...file, orderId: order.id, uploadedBy: session.user!.id })) });
    const dbFiles = await prisma.orderFile.findMany({ where: { orderId: order.id } });
    await prisma.order.update({ where: { id: order.id }, data: { generatedPrompt: generateDesignPrompt({ service, briefData, files: dbFiles }) } });
  }
  redirect(`/dashboard/orders/${order.id}`);
}
