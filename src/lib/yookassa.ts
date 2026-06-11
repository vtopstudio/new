import { randomUUID } from 'crypto';
import { prisma } from './prisma';

const api = 'https://api.yookassa.ru/v3';
function authHeader() { return `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`; }
export function hasYooKassaConfig() { return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY); }
export async function createYooKassaPayment(order: { id: string; userId: string; price: unknown }, internalPaymentId: string, idempotenceKey = randomUUID()) {
  if (!hasYooKassaConfig()) throw new Error('Не заданы YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY');
  const res = await fetch(`${api}/payments`, { method: 'POST', headers: { 'Authorization': authHeader(), 'Idempotence-Key': idempotenceKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: { value: Number(order.price).toFixed(2), currency: 'RUB' }, capture: true, confirmation: { type: 'redirect', return_url: process.env.YOOKASSA_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success` }, description: `Заказ №${order.id}`, metadata: { orderId: order.id, userId: order.userId, internalPaymentId } }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.description || 'ЮKassa вернула ошибку');
  return data as { id: string; status: string; confirmation?: { confirmation_url?: string } };
}
export async function fetchYooKassaPayment(providerPaymentId: string) {
  if (!hasYooKassaConfig()) throw new Error('Не заданы YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY');
  const res = await fetch(`${api}/payments/${providerPaymentId}`, { headers: { Authorization: authHeader() } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.description || 'Не удалось проверить платёж');
  return data as { id: string; status: string };
}
export async function applyProviderPaymentStatus(paymentId: string, providerStatus: string, rawPayload: unknown) {
  if (providerStatus === 'succeeded') {
    const payment = await prisma.payment.update({ where: { id: paymentId }, data: { status: 'PAID', rawPayload: rawPayload as object } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'PAID', status: 'IN_PROGRESS' } });
  } else if (providerStatus === 'canceled') {
    const payment = await prisma.payment.update({ where: { id: paymentId }, data: { status: 'CANCELLED', rawPayload: rawPayload as object } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'FAILED' } });
  }
}
