import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rub } from "@/lib/format";
import { showcaseFor, type BriefField } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();
  const fields = service.fieldsConfig as BriefField[];
  const showcase = showcaseFor(service.slug);

  return <main className="mx-auto max-w-6xl px-4 py-12"><Link href="/services" className="text-sm text-slate-500">← Все услуги</Link><section className={`card mt-6 bg-gradient-to-br ${showcase?.accent ?? "from-white to-slate-50"}`}><span className="badge bg-white/80">от {rub(showcase?.priceFrom ?? service.basePrice)} · срок от {showcase?.timeFrom ?? "1 дня"}</span><h1 className="mt-4 text-5xl font-black">{showcase?.title ?? service.title}</h1><p className="mt-4 max-w-3xl text-lg text-slate-700">{service.description}</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href={`/order/new/${service.slug}`}>Попробовать без риска</Link><a className="btn btn-secondary" href="#details">Что входит</a></div><p className="mt-3 text-sm font-semibold text-slate-500">Сначала защищённое превью — потом получение файлов.</p></section><section id="details" className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[["Что входит", showcase?.includes], ["Для кого подходит", [showcase?.audience]], ["Что нужно от клиента", showcase?.clientNeeds], ["Как проходит работа", ["Ответьте на вопросы", "Оператор проверит заявку", "Prompt Engine подготовит 4 промта", "Результаты появятся в кабинете"]], ["Форматы результата", showcase?.formats], ["Состав и цены", showcase?.composition]].map(([title, items]) => <div className="card" key={String(title)}><h2 className="text-xl font-black">{String(title)}</h2><ul className="mt-4 space-y-2 text-slate-700">{(items as string[] | undefined)?.map((item) => <li key={item}>• {item}</li>)}</ul></div>)}</section><section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]"><div className="card"><h2 className="text-2xl font-black">Какие вопросы зададим</h2><p className="mt-2 text-slate-600">Поля названы человеческим языком — без технических ключей и лишнего жаргона.</p><div className="mt-4 grid gap-2 md:grid-cols-2">{fields.map((field) => <div className="rounded-2xl bg-slate-50 p-3" key={field.name}>{field.label}</div>)}</div></div><div className="card"><h2 className="text-2xl font-black">FAQ</h2><div className="mt-4 space-y-4">{showcase?.faq.map((item) => <div key={item.q}><b>{item.q}</b><p className="mt-1 text-sm text-slate-600">{item.a}</p></div>)}</div><Link className="btn btn-primary mt-6 w-full" href={`/order/new/${service.slug}`}>Заполнить заявку</Link></div></section></main>;
}
