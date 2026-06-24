"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authOptions, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStorageConfigurationError, protectedFileUrl, saveOrderFile } from "@/lib/storage";

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

export type UploadResultState = { error: string | null; success: boolean };

export async function uploadResultAction(_prevState: UploadResultState, formData: FormData): Promise<UploadResultState> {
  try {
    const session = await requireStaff();
    const orderId = String(formData.get("orderId") || "");
    const file = formData.get("file");
    if (!orderId) return { error: "Не найден идентификатор заказа.", success: false };
    if (!(file instanceof File) || file.size === 0) return { error: "Файл результата обязателен.", success: false };

    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { userId: true } });
    if (!order) return { error: "Заказ не найден.", success: false };

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
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { error: null, success: true };
  } catch (error) {
    if (isStorageConfigurationError(error)) {
      return { error: error.message, success: false };
    }
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: "Не удалось загрузить результат. Попробуйте ещё раз.", success: false };
  }
}
