"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authOptions, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { protectedFileUrl, saveOrderFile } from "@/lib/storage";

const statusSchema = z.object({
  orderId: z.string(),
  status: z.enum(["DRAFT", "WAITING_PAYMENT", "PAID", "IN_PROGRESS", "NEEDS_CLARIFICATION", "READY", "COMPLETED", "CANCELLED"]),
  adminComment: z.string().optional()
});

async function requireStaff() {
  const session = await getServerSession(authOptions);
  if (!isStaff(session?.user?.role)) throw new Error("Недостаточно прав");
  return session;
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireStaff();
  const parsed = statusSchema.parse(Object.fromEntries(formData));
  await prisma.order.update({ where: { id: parsed.orderId }, data: { status: parsed.status, adminComment: parsed.adminComment } });
  revalidatePath(`/admin/orders/${parsed.orderId}`);
}

export async function uploadResultAction(formData: FormData) {
  const session = await requireStaff();
  const orderId = String(formData.get("orderId"));
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Файл результата обязателен");

  const stored = await saveOrderFile(orderId, file);
  const orderFile = await prisma.orderFile.create({ data: { orderId, uploadedBy: session.user!.id, ...stored } });
  await prisma.designResult.create({
    data: {
      orderId,
      imageUrl: protectedFileUrl(orderFile.id),
      title: String(formData.get("title") || file.name),
      description: String(formData.get("description") || "Готовый вариант дизайна"),
      isPaid: true
    }
  });
  revalidatePath(`/admin/orders/${orderId}`);
}
