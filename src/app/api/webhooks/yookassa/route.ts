import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type YooKassaWebhook = { event?: string; object?: { id?: string; status?: string; metadata?: { internalPaymentId?: string; orderId?: string } } };

export async function POST(request: Request) {
  const payload = (await request.json()) as YooKassaWebhook;
  const providerPaymentId = payload.object?.id;
  const internalPaymentId = payload.object?.metadata?.internalPaymentId;
  const payment = await prisma.payment.findFirst({ where: { OR: [{ id: internalPaymentId }, { providerPaymentId }] } });
  const rawPayload = JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue;

  await prisma.paymentEvent.create({ data: { paymentId: payment?.id, providerPaymentId, eventType: payload.event ?? "unknown", rawPayload } });

  if (payment && payload.event === "payment.succeeded") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "PAID", rawPayload } }),
      prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "PAID", status: "IN_PROGRESS" } })
    ]);
  }
  if (payment && payload.event === "payment.canceled") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED", rawPayload } }),
      prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED" } })
    ]);
  }
  if (payment && payload.event === "refund.succeeded") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED", rawPayload } }),
      prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "REFUNDED" } })
    ]);
  }
  return NextResponse.json({ ok: true });
}
