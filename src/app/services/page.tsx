import Link from "next/link";
import { rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { showcaseFor } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: "asc" } });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <span className="badge">Витрина услуг</span>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight lg:text-6xl">
        Выберите <span className="text-gradient">дизайн-материал</span> для бизнеса
      </h1>
      <p className="muted mt-4 max-w-3xl text-lg">
        Не нужно писать технический бриф: выберите услугу, ответьте на вопросы, а оператор подготовит промты и проверит результат.
      </p>

      {!services.length && (
        <div className="surface mt-8">
          <h2 className="text-2xl font-bold">Услуги скоро появятся</h2>
          <p className="muted mt-2">Мы готовим витрину. Попробуйте обновить страницу позже или напишите администратору.</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const showcase = showcaseFor(service.slug);
          return (
            <div key={service.id} className="surface flex flex-col p-6 transition-transform hover:-translate-y-0.5">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-purple-300">✦</div>
              <h2 className="mt-4 text-lg font-semibold">{showcase?.title ?? service.title}</h2>
              <p className="muted mt-1 text-sm">{service.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="muted">от <span className="font-semibold text-slate-50">{rub(showcase?.priceFrom ?? service.basePrice)}</span></span>
                <span className="muted">{showcase?.timeFrom ?? "от 1 дня"}</span>
              </div>
              <div className="mt-5 flex gap-2">
                <Link href={`/services/${service.slug}`} className="btn btn-secondary flex-1 px-3 py-2 text-sm">Подробнее</Link>
                <Link href={`/order/new/${service.slug}`} className="btn btn-primary flex-1 px-3 py-2 text-sm">Заказать</Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
