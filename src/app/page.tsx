import Link from "next/link";
import { rub } from "@/lib/format";
import { serviceSeedData, serviceShowcases } from "@/lib/services";

const processSteps = [
  ["В очереди", "Заказ принят, оператор скоро возьмёт его в работу."],
  ["ИИ готовит концепции", "Демонстрационный этап: формируем 4/8/12 направлений."],
  ["Дизайнер отбирает и дорабатывает", "Человек проверяет читаемость, композицию и коммерческий смысл."],
  ["Готово", "Защищённое превью и файлы появляются в личном кабинете."]
];

const examples = ["Вертикальная карточка товара", "Горизонтальная обложка ВК", "Квадратный логотип", "Промо-баннер", "Серия слайдов"];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <span className="badge">AI + контроль человека</span>
          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">Готовый дизайн для бизнеса без долгой переписки с дизайнером</h1>
          <p className="mt-6 max-w-2xl text-xl text-slate-600">
            Выберите услугу, ответьте на простые вопросы — ИИ и дизайнер подготовят варианты, проверят качество и загрузят результат в ваш кабинет.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-primary">Попробовать без риска</Link>
            <a href="#process" className="btn btn-secondary">Как это работает</a>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-500">Сначала защищённое превью — потом получение файлов.</p>
        </div>
        <div className="card bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Демо процесса, не live-статус</p>
          <div className="mt-6 space-y-4">
            {processSteps.map(([title, text], index) => (
              <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-sm" key={title}>
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span><b>{title}</b></div>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between gap-4"><div><h2 className="text-3xl font-black">Популярные услуги</h2><p className="mt-2 text-slate-600">Витрина быстрых дизайн-материалов для бизнес-задач.</p></div><Link className="btn btn-secondary hidden md:inline-flex" href="/services">Все услуги</Link></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceSeedData.map((service) => {
            const showcase = serviceShowcases[service.slug];
            return (
              <Link className={`card min-h-80 overflow-hidden bg-gradient-to-br ${showcase.accent} hover:shadow-soft`} href={`/services/${service.slug}`} key={service.slug}>
                <p className="badge bg-white/80">{showcase.resultFormat}</p>
                <h3 className="mt-12 text-2xl font-black">{showcase.title}</h3>
                <p className="mt-3 text-sm text-slate-700">{service.shortDescription}</p>
                <p className="mt-6 font-black">от {rub(showcase.priceFrom)} · {showcase.timeFrom}</p>
                <span className="mt-5 inline-flex font-bold text-brand">Подробнее →</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 rounded-3xl bg-white p-5 text-slate-600">Скоро: презентации, упаковка и этикетки, фирменный стиль, дизайн сайтов, нейминг и дизайн интерьеров.</p>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-4 py-12"><h2 className="text-3xl font-black">Почему это не просто генератор картинок</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{["Не нужно искать доступ к топовым ИИ, писать промты и отбирать случайные варианты.", "Быстрее фрилансера: меньше переписки, понятный статус и результат в кабинете.", "Доступнее студии: ниже порог входа, но есть контроль человека и чек-лист качества."].map((item) => <div className="card" key={item}><p className="text-lg font-semibold">{item}</p></div>)}</div></section>

      <section id="examples" className="mx-auto max-w-7xl px-4 py-12"><h2 className="text-3xl font-black">Примеры форматов, которые можно заказать</h2><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">{examples.map((item, index) => <div className={`${index % 2 ? "aspect-[3/4]" : "aspect-[4/3]"} rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-600 p-5 text-white`} key={item}><p className="mt-auto text-lg font-black">{item}</p></div>)}</div></section>
    </main>
  );
}
