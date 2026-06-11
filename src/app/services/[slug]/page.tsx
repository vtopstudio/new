import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/ui';
import { money } from '@/lib/format';
export default async function ServicePage({ params }: { params: { slug: string } }) { const service = await prisma.service.findUnique({ where: { slug: params.slug } }); if (!service) notFound(); const fields = service.fieldsConfig as {label:string}[]; return <Shell title={service.title} subtitle={service.description}><div className="card"><p className="text-2xl font-black">Стоимость от {money(service.basePrice)}</p><h2 className="mt-6 text-xl font-bold">Что спросим в брифе</h2><ul className="mt-3 grid gap-2 md:grid-cols-2">{fields.map((f) => <li key={f.label}>• {f.label}</li>)}</ul><Link className="btn mt-6" href={`/order/new/${service.slug}`}>Заполнить бриф</Link></div></Shell>; }
