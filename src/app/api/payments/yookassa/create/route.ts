import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createYooKassaPayment } from "@/lib/yookassa";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });

  const { orderId } = schema.parse(await request.json());
  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  if (order.paymentStatus === "PAID") return NextResponse.json({ error: "Заказ уже оплачен" }, { status: 400 });

  const reusablePayment = await prisma.payment.findFirst({
    where: { orderId: order.id, userId: session.user.id, status: "PENDING", confirmationUrl: { not: null }, providerPaymentId: { not: null } },
    orderBy: { createdAt: "desc" }
  });
  if (reusablePayment?.confirmationUrl) return NextResponse.json({ confirmationUrl: reusablePayment.confirmationUrl });

  await prisma.payment.updateMany({ where: { orderId: order.id, status: "PENDING" }, data: { status: "CANCELLED" } });

  const payment = await prisma.payment.create({
    data: { userId: session.user.id, orderId: order.id, amount: order.price, status: "PENDING", idempotenceKey: randomUUID() }
  });
  const yookassa = await createYooKassaPayment({
    amount: order.price.toString(),
    orderId: order.id,
    userId: session.user.id,
    internalPaymentId: payment.id,
    idempotenceKey: payment.idempotenceKey
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { providerPaymentId: yookassa.providerPaymentId, confirmationUrl: yookassa.confirmationUrl, rawPayload: yookassa }
  });
  return NextResponse.json({ confirmationUrl: yookassa.confirmationUrl });
}
