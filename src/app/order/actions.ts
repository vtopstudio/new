"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDesignPrompt } from "@/lib/prompt-engine";
import { protectedFileUrl, saveOrderFile, validateAggregateUploadSize } from "@/lib/storage";
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
  for (const field of fields) briefData[field.label] = String(formData.get(field.name) ?? "");
  briefData["Состав заказа"] = String(formData.get("orderComposition") ?? "Базовый состав");
  const styleExamples = formData.getAll("styleExamples").map(String).filter(Boolean);
  briefData["Выбранные примеры стиля"] = styleExamples.length ? styleExamples.join(", ") : "Не выбраны";

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      serviceId: service.id,
      briefData,
      generatedPrompt: generateDesignPrompt({ service, briefData }),
      price: service.basePrice,
      status: "WAITING_PAYMENT"
    }
  });

  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  validateAggregateUploadSize(files);

  const createdFiles = [];
  for (const file of files) {
    const stored = await saveOrderFile(order.id, file);
    createdFiles.push(
      await prisma.orderFile.create({ data: { ...stored, orderId: order.id, uploadedBy: session.user.id } })
    );
  }

  if (createdFiles.length) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        generatedPrompt: generateDesignPrompt({
          service,
          briefData,
          files: createdFiles.map((file) => ({ ...file, fileUrl: protectedFileUrl(file.id) }))
        })
      }
    });
  }

  redirect(`/dashboard/orders/${order.id}`);
}
