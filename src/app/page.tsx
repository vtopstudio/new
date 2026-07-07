import Link from "next/link";
import { rub } from "@/lib/format";
import { serviceSeedData, serviceShowcases } from "@/lib/services";

const processSteps = ["Бриф", "AI-задание", "Работа оператора", "Готовый дизайн", "Результат в кабинете"];

const howSteps = [
  ["Вы выбираете услугу", "Карточки, баннеры, оформление ВК или концепции логотипа."],
  ["Заполняете понятный бриф", "Простые вопросы — без технических терминов."],
  ["Сервис формирует задание", "Готовый промт и инструкция уходят оператору."],
  ["Оператор готовит результат", "AI-инструменты + ручной отбор и контроль качества."],
  ["Вы получаете материалы", "Результат и файлы появляются в вашем кабинете."]
];

const formats = [
  ["Карточка товара", "1200×1600", "from-purple-500/30 to-purple-900/20"],
  ["Обложка ВК", "1920×768", "from-emerald-400/25 to-purple-700/20"],
  ["Рекламный баннер", "1080×1080", "from-fuchsia-500/30 to-purple-700/20"],
  ["Логотип / знак", "SVG", "from-violet-500/30 to-emerald-400/20"]
];

const faq = [
  ["Это полностью автоматический сервис?", "Нет. AI помогает оператору, но финальный отбор, проверку качества и подгонку делает человек."],
  ["Кто делает результат?", "Оператор сервиса с помощью AI-инструментов. Вы получаете отобранные и проверенные варианты."],
  ["Можно ли загрузить свои фото и логотип?", "Да, на шаге «Материалы». Это необязательно — без них заказ тоже будет принят."],
  ["Что будет после оплаты?", "Заказ переходит в статус «В работе». Вы увидите изменения в личном кабинете."]
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <span className="badge">AI + контроль человека</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
            Готовый дизайн для бизнеса <span className="text-gradient">без долгой переписки</span> с дизайнером
          </h1>
          <p className="muted mt-5 max-w-xl text-lg">
            Выберите услугу, заполните понятный бриф, оплатите — оператор с помощью AI-инструментов подготовит варианты,
            проверит качество и загрузит результат в ваш кабинет.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-primary">Выбрать услугу →</Link>
            <a href="#how" className="btn btn-secondary">Как это работает</a>
          </div>
        </div>

        <div className="surface glow-ring p-6">
          <div className="mb-4 text-xs uppercase tracking-widest text-slate-400">Как мы работаем</div>
          <ol className="space-y-3">
            {processSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-sm font-semibold">{index + 1}</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12" id="services">
        <h2 className="text-3xl font-bold lg:text-4xl">Услуги</h2>
        <p className="muted mt-2">Выберите формат — остальное сделаем мы.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSeedData.map((service) => {
            const showcase = serviceShowcases[service.slug];
            return (
              <div key={service.slug} className="surface flex flex-col p-6 transition-transform hover:-translate-y-0.5">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-purple-300">✦</div>
                <h3 className="mt-4 text-lg font-semibold">{showcase?.title ?? service.title}</h3>
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
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold lg:text-4xl">Как работает сервис</h2>
        <p className="muted mt-2 max-w-2xl">Человек проверяет читаемость, композицию, соответствие задаче и отбирает лучшие варианты — AI ускоряет, но не решает за вас.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {howSteps.map(([title, text], index) => (
            <div key={title} className="surface p-5">
              <div className="font-mono text-sm text-emerald-300">0{index + 1}</div>
              <div className="mt-2 font-semibold">{title}</div>
              <div className="muted mt-1 text-sm">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold lg:text-4xl">Почему не просто самому в нейросети</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="surface p-6">
            <div className="text-sm uppercase tracking-widest text-slate-400">Самостоятельно</div>
            <ul className="mt-4 space-y-2 text-sm">
              {["Нужно самому писать промты", "Много случайных результатов", "Сложно получить читаемый текст", "Сложно соблюдать требования площадок", "Самому отбирать и дорабатывать"].map((item) => (
                <li key={item} className="muted flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/70" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface border-purple-300/40 p-6">
            <div className="text-sm uppercase tracking-widest text-purple-300">Через сервис</div>
            <ul className="mt-4 space-y-2 text-sm">
              {["Структурированный бриф", "Задание под конкретную услугу", "Операторский отбор", "Контроль качества", "Результат в кабинете"].map((item) => (
                <li key={item} className="flex gap-2"><span className="text-emerald-300">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="examples" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold lg:text-4xl">Форматы, которые можно заказать</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map(([title, size, gradient]) => (
            <div className="surface overflow-hidden p-0" key={title}>
              <div className={`relative aspect-[4/5] bg-gradient-to-br ${gradient}`}>
                <div className="absolute inset-0 grid place-items-center text-5xl text-white/20">✦</div>
              </div>
              <div className="p-4">
                <div className="font-semibold">{title}</div>
                <div className="muted text-xs">{size}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold lg:text-4xl">FAQ</h2>
        <div className="mt-8 grid max-w-3xl gap-4">
          {faq.map(([question, answer]) => (
            <div className="surface" key={question}>
              <h3 className="font-semibold">{question}</h3>
              <p className="muted mt-2 text-sm">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 pb-24">
        <div className="surface glow-ring flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Готовы попробовать на одной задаче?</h2>
            <p className="muted mt-2">Выберите услугу и заполните короткий бриф — дальше оператор подготовит результат.</p>
          </div>
          <Link href="/services" className="btn btn-primary shrink-0">Выбрать услугу</Link>
        </div>
      </section>
    </main>
  );
}
