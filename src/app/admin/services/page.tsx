import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/ui';
import { money } from '@/lib/format';
export default async function AdminServices() { await requireRole(['ADMIN','OPERATOR']); const services = await prisma.service.findMany({ orderBy: { slug: 'asc' } }); return <Shell title="Услуги"><div className="grid gap-5 md:grid-cols-2">{services.map(s => <div className="card" key={s.id}><h2 className="text-xl font-bold">{s.title}</h2><p className="text-slate-300">/{s.slug}</p><p className="mt-3">{money(s.basePrice)} · {s.isActive ? 'активна' : 'выключена'}</p></div>)}</div></Shell>; }
