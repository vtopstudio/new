import Link from "next/link";
import { rub } from "@/lib/format";
import { serviceSeedData, serviceShowcases } from "@/lib/services";

const processSteps = [
  ["Бриф", "Вы выбираете услугу и отвечаете на понятные вопросы без дизайнерского жаргона."],
  ["AI-задание", "Сервис собирает вводные в рабочее задание и промты для оператора."],
  ["Работа оператора", "Человек запускает AI-инструменты, отбирает варианты и проверяет качество."],
  ["Готовый дизайн", "Результат загружается в кабинет, где его можно посмотреть и скачать."]
];

const comparison = [
  ["Самостоятельно", ["Нужно самому писать промты", "Много случайных результатов", "Сложно получить читаемый текст", "Самому отбирать и дорабатывать"]],
  ["Через DesignMate", ["Структурированный бриф", "Задание под конкретную услугу", "Операторский отбор", "Контроль качества", "Результат в кабинете"]]
];

const formats = [
  ["Карточка товара", "1200×1600", "from-purple-500/30 to-emerald-300/10"],
  ["Обложка ВК", "1920×768", "from-emerald-400/25 to-violet-500/10"],
  ["Рекламный баннер", "1080×1080", "from-fuchsia-400/25 to-purple-500/10"],
  ["Логотип / знак", "SVG / PNG", "from-violet-400/30 to-emerald-300/10"]
];

const faq = [
  ["Это полностью автоматический сервис?", "Нет. AI ускоряет работу, но финальный отбор и проверку делает оператор."],
  ["Когда нужна регистрация?", "Сначала можно выбрать услугу и заполнить бриф. Кабинет нужен для сохранения заказа и получения результата."],
  ["Можно загрузить свои фото и логотип?", "Да. Материалы можно приложить к заказу, чтобы результат был точнее."],
  ["Что клиент получает в итоге?", "Готовые файлы и результат в личном кабинете после обработки заказа."]
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <span className="badge">AI + контроль человека</span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Готовый дизайн для бизнеса <span className="text-gradient">без долгой переписки</span> с дизайнером
          </h1>
          <p className="muted mt-6 max-w-2xl text-lg md:text-xl">
            Выберите услугу, заполните понятный бриф, оплатите — оператор с помощью AI-инструментов подготовит варианты,
            проверит качество и загрузит результат в ваш кабинет.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-primary">Выбрать услугу →</Link>
            <a href="#process" className="btn btn-secondary">Как это работает</a>
          </div>
          <p className="muted mt-4 text-sm">MVP: AI помогает оператору, но не заменяет ручной контроль качества.</p>
        </div>

        <div className="surface glow-ring p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-200/80">Как мы работаем</p>
          <ol className="mt-6 space-y-3">
            {processSteps.map(([title, text], index) => (
              <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-sm font-black text-emerald-200">{index + 1}</span>
                  <b>{title}</b>
                </div>
                <p className="muted mt-2 text-sm">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12" id="services">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="badge">Услуги</span>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Форматы, которые можно заказать</h2>
            <p className="muted mt-2">Выберите формат — остальное сделаем мы.</p>
          </div>
          <Link className="btn btn-secondary hidden md:inline-flex" href="/services">Все услуги</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSeedData.map((service) => {
            const showcase = serviceShowcases[service.slug];
            return (
              <article className="surface group flex min-h-80 flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-1" key={service.slug}>
                <Link href={`/services/${service.slug}`} className="flex h-full flex-col p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl">✦</div>
                  <h3 className="mt-5 text-xl font-black">{showcase?.title ?? service.title}</h3>
                  <p className="muted mt-2 text-sm">{service.shortDescription}</p>
                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="muted">от <b className="text-slate-50">{rub(showcase?.priceFrom ?? service.basePrice)}</b></span>
                      <span className="muted">{showcase?.timeFrom ?? "от 1 дня"}</span>
                    </div>
                    <span className="mt-5 inline-flex font-bold text-purple-200 group-hover:text-emerald-200">Подробнее →</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-4 py-16">
        <span className="badge">Процесс</span>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Почему это не просто генератор картинок</h2>
        <p className="muted mt-3 max-w-3xl">Человек проверяет читаемость, композицию, соответствие задаче и отбирает лучшие варианты — AI ускоряет, но не решает за клиента.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {comparison.map(([title, items], blockIndex) => (
            <div className={`surface ${blockIndex === 1 ? "glow-ring" : ""}`} key={String(title)}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-200/80">{String(title)}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {(items as string[]).map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className={`mt-1.5 h-2 w-2 rounded-full ${blockIndex === 1 ? "bg-emerald-300" : "bg-purple-300/60"}`} />
                    <span className={blockIndex === 1 ? "text-slate-100" : "muted"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="examples" className="mx-auto max-w-7xl px-4 py-16">
        <span className="badge">Витрина</span>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Примеры форматов</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map(([title, size, gradient]) => (
            <div className="surface overflow-hidden p-0" key={title}>
              <div className={`aspect-[4/5] bg-gradient-to-br ${gradient} grid place-items-center`}>
                <span className="text-5xl text-white/25">✦</span>
              </div>
              <div className="p-5">
                <div className="font-bold">{title}</div>
                <div className="muted mt-1 text-xs">{size}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <span className="badge">FAQ</span>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Частые вопросы</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faq.map(([q, a]) => (
            <div className="surface" key={q}>
              <h3 className="font-bold">{q}</h3>
              <p className="muted mt-2 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 pb-24">
        <div className="surface glow-ring flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">Начнём с одной задачи?</h2>
            <p className="muted mt-2">Выберите услугу, заполните короткий бриф и проверьте рабочий сценарий сервиса.</p>
          </div>
          <Link href="/services" className="btn btn-primary shrink-0">Перейти к услугам</Link>
        </div>
      </section>
    </main>
  );
}
