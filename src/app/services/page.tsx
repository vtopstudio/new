import Link from "next/link";
import { rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { showcaseFor } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: "asc" } });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <section className="surface glow-ring p-8 md:p-10">
        <span className="badge">Витрина услуг</span>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Выберите <span className="text-gradient">дизайн-материал</span> для бизнес-задачи
        </h1>
        <p className="muted mt-5 max-w-3xl text-lg">
          Не нужно писать технический бриф: выберите услугу, ответьте на вопросы, а оператор подготовит промты,
          проверит результат и загрузит файлы в кабинет.
        </p>
      </section>

      {!services.length && (
        <div className="surface mt-8">
          <h2 className="text-2xl font-black">Услуги скоро появятся</h2>
          <p className="muted mt-2">Мы готовим витрину. Попробуйте обновить страницу позже или напишите администратору.</p>
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {services.map((service) => {
          const showcase = showcaseFor(service.slug);
          return (
            <article className="surface flex flex-col transition duration-200 hover:-translate-y-1" key={service.id}>
              <div className="flex flex-wrap gap-2">
                <span className="badge">от {rub(showcase?.priceFrom ?? service.basePrice)}</span>
                <span className="badge">срок {showcase?.timeFrom ?? "от 1 дня"}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black md:text-3xl">{showcase?.title ?? service.title}</h2>
              <p className="muted mt-3">{service.description}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <b>Что входит</b>
                  <ul className="muted mt-3 space-y-2 text-sm">
                    {(showcase?.includes ?? []).map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div>
                  <b>Для кого</b>
                  <p className="muted mt-3 text-sm">{showcase?.audience}</p>
                  <p className="mt-4 text-sm font-bold text-emerald-200">{showcase?.resultFormat}</p>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <Link href={`/services/${service.slug}`} className="btn btn-secondary">Подробнее</Link>
                <Link href={`/order/new/${service.slug}`} className="btn btn-primary">Заполнить бриф</Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
