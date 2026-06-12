import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function markPaymentSucceeded(paymentId: string, rawPayload: Prisma.InputJsonValue) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return;

  await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: "PAID", rawPayload } }),
    prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "PAID", status: "IN_PROGRESS" } })
  ]);
}

export async function markPaymentCanceled(paymentId: string, rawPayload: Prisma.InputJsonValue) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: { include: { payments: { where: { status: { in: ["PAID", "MANUAL_CONFIRMED"] } } } } } }
  });
  if (!payment) return;

  const updates: Prisma.PrismaPromise<unknown>[] = [
    prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED", rawPayload } })
  ];

  if (payment.order.paymentStatus !== "PAID" && payment.order.payments.length === 0) {
    updates.push(prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED" } }));
  }

  await prisma.$transaction(updates);
}

export async function markPaymentRefunded(paymentId: string, rawPayload: Prisma.InputJsonValue) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return;

  await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED", rawPayload } }),
    prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "REFUNDED" } })
  ]);
}
