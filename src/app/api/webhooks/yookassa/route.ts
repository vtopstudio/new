import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyProviderPaymentStatus } from '@/lib/yookassa';
export async function POST(req: Request) {
  const expectedSecret = process.env.YOOKASSA_WEBHOOK_SECRET;
  const providedSecret = req.headers.get('x-yookassa-webhook-secret') || req.headers.get('x-webhook-secret');
  if (expectedSecret && providedSecret !== expectedSecret) return NextResponse.json({ error: 'Некорректная подпись webhook' }, { status: 401 });
  const payload = await req.json();
  const object = payload.object || {};
  const providerPaymentId = object.id as string | undefined;
  const internalPaymentId = object.metadata?.internalPaymentId as string | undefined;
  const payment = internalPaymentId ? await prisma.payment.findUnique({ where: { id: internalPaymentId } }) : providerPaymentId ? await prisma.payment.findUnique({ where: { providerPaymentId } }) : null;
  const event = String(payload.event || 'unknown');
  await prisma.paymentEvent.create({ data: { paymentId: payment?.id, providerPaymentId, eventType: event, rawPayload: payload } });
  if (payment && event === 'payment.succeeded') await applyProviderPaymentStatus(payment.id, 'succeeded', payload);
  if (payment && event === 'payment.canceled') await applyProviderPaymentStatus(payment.id, 'canceled', payload);
  if (event === 'refund.succeeded' && payment) await prisma.payment.update({ where: { id: payment.id }, data: { status: 'REFUNDED', rawPayload: payload } });
  return NextResponse.json({ ok: true });
}
