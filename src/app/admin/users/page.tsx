import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/ui';
export default async function AdminUsers() { await requireRole(['ADMIN']); const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } }); return <Shell title="Пользователи"><div className="space-y-3">{users.map(u => <div className="card flex justify-between" key={u.id}><div><b>{u.email}</b><p className="text-slate-400">{u.name}</p></div><span>{u.role}</span></div>)}</div></Shell>; }
