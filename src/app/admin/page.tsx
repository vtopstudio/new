import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/ui';
export default async function Admin() { await requireRole(['ADMIN','OPERATOR']); const [orders, users, payments] = await Promise.all([prisma.order.count(), prisma.user.count(), prisma.payment.count()]); return <Shell title="Админ-панель"><div className="grid gap-5 md:grid-cols-4"><Link className="card" href="/admin/orders">Заказы: {orders}</Link><Link className="card" href="/admin/services">Услуги</Link><Link className="card" href="/admin/users">Пользователи: {users}</Link><Link className="card" href="/admin/payments">Платежи: {payments}</Link></div></Shell>; }
