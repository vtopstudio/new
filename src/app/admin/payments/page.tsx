import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell, StatusPill } from '@/components/ui';
import { money } from '@/lib/format';
export default async function AdminPayments() { await requireRole(['ADMIN','OPERATOR']); const payments = await prisma.payment.findMany({ include: { user: true, order: true }, orderBy: { createdAt: 'desc' } }); return <Shell title="Платежи"><div className="space-y-3">{payments.map(p => <div className="card" key={p.id}><div className="flex justify-between"><b>{money(p.amount)}</b><StatusPill type="payment" value={p.status}/></div><p className="mt-2 text-slate-300">{p.user.email} · заказ {p.orderId}</p><p className="text-slate-400">ЮKassa: {p.providerPaymentId || 'ещё не создан'}</p></div>)}</div></Shell>; }
