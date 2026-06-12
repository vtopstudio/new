import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { markPaymentCanceled, markPaymentRefunded, markPaymentSucceeded } from "@/lib/payment-sync";
import { getYooKassaPayment } from "@/lib/yookassa";

type YooKassaWebhook = {
  event?: string;
  object?: { id?: string; status?: string; metadata?: { internalPaymentId?: string; orderId?: string; userId?: string } };
};

function hasValidWebhookSecret(request: Request) {
  const secret = process.env.YOOKASSA_WEBHOOK_SECRET;
  if (!secret) return true;
  const headerSecret = request.headers.get("x-webhook-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return headerSecret === secret || bearer === secret;
}

async function verifiedProviderPayment(payload: YooKassaWebhook) {
  const providerPaymentId = payload.object?.id;
  if (!providerPaymentId) return null;
  const provider = await getYooKassaPayment(providerPaymentId);
  if (provider.id !== providerPaymentId) return null;
  if (provider.metadata?.internalPaymentId !== payload.object?.metadata?.internalPaymentId) return null;
  if (provider.metadata?.orderId !== payload.object?.metadata?.orderId) return null;
  return provider;
}

export async function POST(request: Request) {
  if (!hasValidWebhookSecret(request)) return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });

  const payload = (await request.json()) as YooKassaWebhook;
  const providerPaymentId = payload.object?.id;
  const internalPaymentId = payload.object?.metadata?.internalPaymentId;
  const payment = internalPaymentId
    ? await prisma.payment.findUnique({ where: { id: internalPaymentId } })
    : providerPaymentId
      ? await prisma.payment.findUnique({ where: { providerPaymentId } })
      : null;
  const rawPayload = JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue;

  await prisma.paymentEvent.create({
    data: { paymentId: payment?.id, providerPaymentId, eventType: payload.event ?? "unknown", rawPayload }
  });

  if (!payment) return NextResponse.json({ ok: true });

  if (payload.event === "payment.succeeded") {
    if (payload.object?.status !== "succeeded") return NextResponse.json({ ok: true });
    const provider = await verifiedProviderPayment(payload);
    if (provider?.status !== "succeeded") return NextResponse.json({ ok: true });
    await markPaymentSucceeded(payment.id, JSON.parse(JSON.stringify(provider)) as Prisma.InputJsonValue);
  }

  if (payload.event === "payment.canceled") await markPaymentCanceled(payment.id, rawPayload);
  if (payload.event === "refund.succeeded") await markPaymentRefunded(payment.id, rawPayload);

  return NextResponse.json({ ok: true });
}
