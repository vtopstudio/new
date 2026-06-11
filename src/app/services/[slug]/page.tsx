import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rub } from "@/lib/format";
import type { BriefField } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();
  const fields = service.fieldsConfig as BriefField[];
  return <main className="mx-auto max-w-5xl px-4 py-12"><Link href="/services" className="text-sm text-slate-500">← Все услуги</Link><div className="mt-6 card"><span className="badge">от {rub(service.basePrice)}</span><h1 className="mt-4 text-4xl font-black">{service.title}</h1><p className="mt-4 text-lg text-slate-600">{service.description}</p><h2 className="mt-8 text-xl font-black">Что спросим в брифе</h2><div className="mt-4 grid gap-2 md:grid-cols-2">{fields.map((field) => <div className="rounded-2xl bg-slate-50 p-3" key={field.name}>{field.label}</div>)}</div><Link className="btn btn-primary mt-8" href={`/order/new/${service.slug}`}>Заполнить бриф</Link></div></main>;
}
