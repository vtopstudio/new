import Link from "next/link";
import { rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { showcaseFor } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: "asc" } });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <span className="badge">Витрина услуг</span>
      <h1 className="mt-4 text-4xl font-black">Выберите дизайн-материал для бизнеса</h1>
      <p className="mt-3 max-w-3xl text-slate-600">Не нужно писать технический бриф: выберите услугу, ответьте на вопросы, а оператор подготовит промты и проверит результат.</p>
      {!services.length && <div className="card mt-8"><h2 className="text-2xl font-black">Услуги скоро появятся</h2><p className="mt-2 text-slate-600">Мы готовим витрину. Попробуйте обновить страницу позже или напишите администратору.</p></div>}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {services.map((service) => {
          const showcase = showcaseFor(service.slug);
          return (
            <article className={`card bg-gradient-to-br ${showcase?.accent ?? "from-white to-slate-50"}`} key={service.id}>
              <div className="flex flex-wrap gap-2"><span className="badge bg-white/80">от {rub(showcase?.priceFrom ?? service.basePrice)}</span><span className="badge bg-white/80">срок от {showcase?.timeFrom ?? "1 дня"}</span></div>
              <h2 className="mt-5 text-2xl font-black">{showcase?.title ?? service.title}</h2>
              <p className="mt-3 text-slate-700">{service.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2"><div><b>Что входит</b><ul className="mt-2 space-y-1 text-sm text-slate-700">{(showcase?.includes ?? []).map((item) => <li key={item}>• {item}</li>)}</ul></div><div><b>Для кого</b><p className="mt-2 text-sm text-slate-700">{showcase?.audience}</p><p className="mt-3 text-sm font-bold">{showcase?.resultFormat}</p></div></div>
              <div className="mt-6 flex flex-wrap gap-3"><Link href={`/services/${service.slug}`} className="btn btn-secondary">Подробнее</Link><Link href={`/order/new/${service.slug}`} className="btn btn-primary">Попробовать</Link></div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
