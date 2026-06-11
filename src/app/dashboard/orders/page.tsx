import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell, StatusPill } from '@/components/ui';
import { money } from '@/lib/format';
export default async function Orders() { const user = await requireUser(); const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { service: true }, orderBy: { createdAt: 'desc' } }); return <Shell title="Мои заказы"><div className="space-y-3">{orders.map(o => <Link className="card flex items-center justify-between" href={`/dashboard/orders/${o.id}`} key={o.id}><div><b>{o.service.title}</b><p className="text-slate-400">{o.id}</p></div><div className="flex gap-2"><StatusPill value={o.status}/><StatusPill type="payment" value={o.paymentStatus}/><span>{money(o.price)}</span></div></Link>)}</div></Shell>; }
