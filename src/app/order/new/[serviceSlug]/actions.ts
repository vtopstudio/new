"use server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildSystemPrompt } from "@/lib/prompt-engine";

export async function createOrder(serviceSlug: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/sign-in");
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) throw new Error("Услуга не найдена");
  const briefData = Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)]));
  const generatedPrompt = buildSystemPrompt(service.title, briefData, service.promptTemplate);
  const order = await prisma.order.create({ data: { userId: (session.user as any).id, serviceId: service.id, briefData, generatedPrompt, price: service.basePrice } });
  redirect(`/dashboard/orders/${order.id}`);
}
