import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { applyProviderPaymentStatus, fetchYooKassaPayment } from '@/lib/yookassa';
const schema = z.object({ providerPaymentId: z.string().min(1) });
export async function POST(req: Request) {
  await requireRole(['ADMIN','OPERATOR']);
  const input = schema.parse(await req.json());
  const payment = await prisma.payment.findUnique({ where: { providerPaymentId: input.providerPaymentId } });
  if (!payment) return NextResponse.json({ error: 'Платёж не найден' }, { status: 404 });
  const provider = await fetchYooKassaPayment(input.providerPaymentId);
  await applyProviderPaymentStatus(payment.id, provider.status, provider);
  return NextResponse.json({ ok: true, status: provider.status });
}
