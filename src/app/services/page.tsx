import Link from "next/link";
import { rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { showcaseFor } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: "asc" } });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <h1 className="text-5xl font-bold leading-tight lg:text-6xl">Каталог услуг</h1>
      <p className="muted mt-4 max-w-3xl text-lg">Выберите формат — мы поможем заполнить бриф и подготовим результат.</p>

      {!services.length && (
        <div className="surface mt-8">
          <h2 className="text-2xl font-bold">Услуги скоро появятся</h2>
          <p className="muted mt-2">Мы готовим витрину. Попробуйте обновить страницу позже или напишите администратору.</p>
        </div>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {services.map((service) => {
          const showcase = showcaseFor(service.slug);
          const audience = showcase?.audience ? showcase.audience.split(",").slice(0, 4).map((item) => item.trim()) : [];
          return (
            <article key={service.id} className="surface flex min-h-[300px] flex-col p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{showcase?.title ?? service.title}</h2>
                  <p className="muted mt-2">{service.shortDescription}</p>
                </div>
                <div className="shrink-0 text-sm font-semibold text-slate-100">от {rub(showcase?.priceFrom ?? service.basePrice)}</div>
              </div>

              <div className="mt-7 grid gap-8 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Что входит</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {(showcase?.includes ?? []).slice(0, 4).map((item) => (
                      <li key={item} className="flex gap-2"><span className="neon-green">✓</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Кому подходит</div>
                  <ul className="muted mt-3 space-y-2 text-sm">
                    {(audience.length ? audience : ["Бизнес", "Маркетологи", "Эксперты", "Стартапы"]).map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto grid gap-3 pt-7 md:grid-cols-2">
                <Link href={`/services/${service.slug}`} className="btn btn-secondary py-2">Подробнее</Link>
                <Link href={`/order/new/${service.slug}`} className="btn btn-primary py-2">Заполнить бриф</Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
