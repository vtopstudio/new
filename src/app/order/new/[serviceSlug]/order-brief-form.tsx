"use client";

import { useMemo, useState } from "react";
import type { BriefField } from "@/lib/services";

type OrderBriefFormProps = {
  action: (formData: FormData) => void;
  checkoutPrice: string;
  composition: string[];
  fields: BriefField[];
  serviceSlug: string;
  serviceTitle: string;
};

const styleTags = ["Минимализм", "Премиум", "Ярко", "Строго", "Технологично", "Натурально", "Дружелюбно", "Контрастно"];

function chunkFields(fields: BriefField[], start: number, count: number) {
  return fields.slice(start, start + count);
}

function FieldInput({ field }: { field: BriefField }) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold">{field.label}{field.required && " *"}</span>
      {field.type === "textarea" ? (
        <textarea className="input min-h-28 resize-y" name={field.name} placeholder="Коротко опишите своими словами" />
      ) : field.type === "select" ? (
        <select className="input" name={field.name} defaultValue="">
          <option value="" disabled>Выберите вариант</option>
          {field.options?.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : (
        <input className="input" name={field.name} placeholder="Например: Кофейня «Север»" />
      )}
    </label>
  );
}

export function OrderBriefForm({ action, checkoutPrice, composition, fields, serviceSlug, serviceTitle }: OrderBriefFormProps) {
  const [step, setStep] = useState(0);
  const steps = useMemo(() => [
    {
      title: "О задаче",
      subtitle: "Расскажите, для чего нужен дизайн.",
      content: <div className="space-y-5">{chunkFields(fields, 0, 3).map((field) => <FieldInput field={field} key={field.name} />)}</div>
    },
    {
      title: "Состав заказа",
      subtitle: "Выберите базовый формат. Детали можно уточнить с оператором.",
      content: (
        <div className="space-y-3">
          {(composition.length ? composition : ["Базовый состав"]).map((item, index) => (
            <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm transition hover:bg-white/[0.07]" key={item}>
              <input className="mt-1 accent-purple-400" name="orderComposition" type="radio" value={item} defaultChecked={index === 0} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Тексты и смысл",
      subtitle: "Что обязательно должно быть написано или показано?",
      content: <div className="space-y-5">{chunkFields(fields, 3, 3).map((field) => <FieldInput field={field} key={field.name} />)}</div>
    },
    {
      title: "Материалы",
      subtitle: "Загрузите логотип, фото, старый дизайн или референсы, если они есть.",
      content: (
        <label className="block">
          <span className="mb-2 block font-semibold">Материалы и референсы</span>
          <input className="input" name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" />
          <span className="muted mt-2 block text-xs">jpg/png/webp/pdf, до 8 МБ за файл и 32 МБ суммарно.</span>
        </label>
      )
    },
    {
      title: "Стиль",
      subtitle: "Укажите настроение, цвета и то, что точно не нравится.",
      content: (
        <div className="space-y-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {styleTags.map((item) => (
              <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm transition hover:border-purple-300/50 hover:bg-white/[0.07]" key={item}>
                <input className="mr-2 accent-purple-400" name="styleExamples" type="checkbox" value={item} />{item}
              </label>
            ))}
          </div>
          {fields.slice(6).map((field) => <FieldInput field={field} key={field.name} />)}
        </div>
      )
    },
    {
      title: "Проверка",
      subtitle: "Проверьте заказ и отправьте заявку в работу.",
      content: (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="muted">Услуга: <b className="text-slate-50">{serviceTitle}</b></p>
          <p className="muted mt-2">Стоимость на этом этапе: <b className="text-slate-50">{checkoutPrice}</b></p>
          <p className="muted mt-2 text-sm">После создания заказ появится в кабинете. Оператор увидит бриф, материалы и подготовит результат.</p>
        </div>
      )
    }
  ], [checkoutPrice, composition, fields, serviceTitle]);

  return (
    <form action={action} className="mx-auto max-w-4xl">
      <input type="hidden" name="serviceSlug" value={serviceSlug} />
      <div className="mb-8 flex items-center justify-between gap-4 text-sm">
        <span className="muted">← {serviceTitle}</span>
        <span className="muted">Шаг {step + 1} из {steps.length}</span>
      </div>
      <div className="mb-8 h-1 rounded-full bg-purple-950/80">
        <div className="h-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      <div className="surface p-8 md:p-10">
        <h1 className="text-3xl font-bold">{steps[step].title}</h1>
        <p className="muted mt-2">{steps[step].subtitle}</p>

        <div className="mt-8">{steps.map((item, index) => <div key={item.title} className={index === step ? "block" : "hidden"}>{item.content}</div>)}</div>

        <div className="mt-9 flex items-center justify-between gap-3">
          <button className="btn btn-secondary py-2" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Назад</button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary py-2" type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Далее</button>
          ) : (
            <button className="btn btn-primary py-2" type="submit">Создать заказ</button>
          )}
        </div>
      </div>
    </form>
  );
}
