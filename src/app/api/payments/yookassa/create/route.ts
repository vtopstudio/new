import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createYooKassaPayment } from '@/lib/yookassa';
const schema = z.object({ orderId: z.string().min(1) });
export async function POST(req: Request) {
  const user = await requireUser();
  const input = schema.parse(await req.json().catch(async () => Object.fromEntries((await req.formData()).entries())));
  const order = await prisma.order.findFirst({ where: { id: input.orderId, userId: user.id } });
  if (!order) return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
  if (order.paymentStatus === 'PAID') return NextResponse.json({ error: 'Заказ уже оплачен' }, { status: 400 });
  const payment = await prisma.payment.create({ data: { userId: user.id, orderId: order.id, amount: order.price, idempotenceKey: randomUUID() } });
  try {
    const provider = await createYooKassaPayment(order, payment.id, payment.idempotenceKey);
    const updated = await prisma.payment.update({ where: { id: payment.id }, data: { providerPaymentId: provider.id, confirmationUrl: provider.confirmation?.confirmation_url, rawPayload: provider as object } });
    return NextResponse.json({ confirmationUrl: updated.confirmationUrl });
  } catch (e) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', rawPayload: { error: e instanceof Error ? e.message : 'Ошибка' } } });
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Ошибка ЮKassa' }, { status: 500 });
  }
}
