import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rub } from "@/lib/format";
import { showcaseFor, type BriefField } from "@/lib/services";
import { createOrderAction } from "../../actions";

export const dynamic = "force-dynamic";

const stepHints = [
  ["Бизнес/продукт", "Коротко расскажите, что вы продаёте или продвигаете."],
  ["Задача", "Опишите своими словами, какой результат хотите увидеть."],
  ["Состав заказа", "Выберите базовый формат. Итог можно уточнить с оператором."],
  ["Материалы и тексты", "Приложите логотип, фото, PDF или старый дизайн, если они есть."],
  ["Визуальный стиль", "Укажите цвета, настроение, ссылки и то, что точно не нравится."],
  ["Проверка заказа", "Проверьте цену, резерв и отправьте заявку в работу."],
];

export default async function NewOrderPage({ params }: { params: Promise<{ serviceSlug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/sign-in?next=soft-order");

  const { serviceSlug } = await params;
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) notFound();

  const fields = service.fieldsConfig as BriefField[];
  const showcase = showcaseFor(service.slug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <span className="badge">Шаг 1 из 6 — Бизнес/продукт</span>
      <h1 className="mt-4 text-4xl font-black">Заявка: {showcase?.title ?? service.title}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">Ответьте на простые вопросы. Минимальная стоимость резервируется под текущий заказ, а финальные файлы открываются после оплаты.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-6">{stepHints.map(([title], index) => <div className="rounded-2xl bg-white p-3 text-sm font-bold" key={title}>{index + 1}. {title}</div>)}</div>
      <form action={createOrderAction} className="card mt-8 space-y-8">
        <input type="hidden" name="serviceSlug" value={service.slug} />
        {stepHints.slice(0, 5).map(([title, hint], stepIndex) => (
          <fieldset className="rounded-3xl border border-slate-200 p-5" key={title}>
            <legend className="px-2 font-black">Шаг {stepIndex + 1} из 6 — {title}</legend>
            <p className="mt-2 text-sm text-slate-600">{hint}</p>
            {stepIndex === 2 && <div className="mt-4 grid gap-2">{showcase?.composition.map((item) => <label className="rounded-2xl bg-slate-50 p-3" key={item}><input className="mr-2" name="orderComposition" type="radio" value={item} />{item}</label>)}</div>}
            {stepIndex === 4 && <div className="mt-4 grid gap-2 md:grid-cols-4">{["Минимализм", "Премиум", "Ярко", "Строго", "Технологично", "Натурально", "Дружелюбно", "Контрастно"].map((item) => <label className="rounded-2xl bg-slate-50 p-3 text-sm" key={item}><input className="mr-2" name="styleExamples" type="checkbox" value={item} />{item}</label>)}</div>}
          </fieldset>
        ))}
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label className="block" key={field.name}>
              <span className="mb-2 block font-semibold">{field.label}{field.required && " *"}</span>
              {field.type === "textarea" ? <textarea className="input min-h-28" name={field.name} required={field.required} /> : field.type === "select" ? <select className="input" name={field.name} required={field.required}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input className="input" name={field.name} required={field.required} />}
            </label>
          ))}
        </div>
        <label className="block"><span className="mb-2 block font-semibold">Материалы и референсы (jpg/png/webp/pdf, до 8 МБ за файл и 32 МБ суммарно)</span><input className="input" name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" /></label>
        <div className="rounded-3xl bg-slate-50 p-5"><h2 className="text-xl font-black">Шаг 6 из 6 — Проверка заказа</h2><p className="mt-2 text-slate-600">Минимальная стоимость: <b>{rub(showcase?.priceFrom ?? service.basePrice)}</b>. Зарезервировано под заказ после оплаты: <b>{rub(showcase?.priceFrom ?? service.basePrice)}</b>. Доплаты за варианты, исходники и адаптации будут показаны отдельно.</p><p className="mt-2 text-sm font-semibold text-slate-500">Попробовать без риска: сначала защищённое превью — потом получение файлов.</p></div>
        <button className="btn btn-primary">Всё верно — создать заказ</button>
      </form>
    </main>
  );
}
