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

  const detailBlocks = [
    ["Что входит", showcase?.includes],
    ["Для кого подходит", showcase?.audience ? [showcase.audience] : []],
    ["Что нужно от клиента", showcase?.clientNeeds],
    ["Как проходит работа", ["Ответьте на вопросы", "Оператор проверит заявку", "Prompt Engine подготовит рабочие промты", "Результаты появятся в кабинете"]],
    ["Форматы результата", showcase?.formats],
    ["Состав и цены", showcase?.composition]
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <Link href="/services" className="muted text-sm hover:text-slate-50">← Все услуги</Link>

      <section className="surface glow-ring mt-6 p-8 md:p-10">
        <span className="badge">от {rub(showcase?.priceFrom ?? service.basePrice)} · срок {showcase?.timeFrom ?? "от 1 дня"}</span>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          {showcase?.title ?? service.title}
        </h1>
        <p className="muted mt-5 max-w-3xl text-lg">{service.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn btn-primary" href={`/order/new/${service.slug}`}>Заполнить бриф</Link>
          <a className="btn btn-secondary" href="#details">Что входит</a>
        </div>
        <p className="muted mt-4 text-sm">Сначала заявка и рабочий процесс, затем результат в личном кабинете.</p>
      </section>

      <section id="details" className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {detailBlocks.map(([title, items]) => (
          <div className="surface" key={String(title)}>
            <h2 className="text-xl font-black">{String(title)}</h2>
            <ul className="muted mt-4 space-y-2 text-sm">
              {(items as string[] | undefined)?.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="surface">
          <h2 className="text-2xl font-black">Какие вопросы зададим</h2>
          <p className="muted mt-2">Поля названы человеческим языком — без технических ключей и лишнего жаргона.</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {fields.map((field) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm" key={field.name}>{field.label}</div>
            ))}
          </div>
        </div>
        <div className="surface glow-ring">
          <h2 className="text-2xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {showcase?.faq.map((item) => (
              <div key={item.q}>
                <b>{item.q}</b>
                <p className="muted mt-1 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
          <Link className="btn btn-primary mt-7 w-full" href={`/order/new/${service.slug}`}>Заполнить заявку</Link>
        </div>
      </section>
    </main>
  );
}
