export type BriefField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: string[];
};

export const serviceSeedData = [
  {
    slug: "marketplace-cards",
    title: "Карточки товаров для маркетплейсов",
    shortDescription: "Продающие карточки для Ozon, Wildberries и Яндекс Маркета.",
    description: "Создаём визуальную упаковку товара: первый экран, преимущества, инфографика и единый стиль серии.",
    basePrice: "3900",
    fieldsConfig: [
      { name: "productName", label: "Название товара", type: "text", required: true },
      { name: "marketplace", label: "Маркетплейс", type: "select", options: ["Ozon", "Wildberries", "Яндекс Маркет", "Другое"], required: true },
      { name: "category", label: "Категория", type: "text", required: true },
      { name: "targetAudience", label: "Целевая аудитория", type: "textarea", required: true },
      { name: "benefits", label: "Преимущества товара", type: "textarea", required: true },
      { name: "offerText", label: "Акция или оффер", type: "text" },
      { name: "style", label: "Желаемый стиль", type: "text" },
      { name: "colors", label: "Цвета", type: "text" },
      { name: "requiredTexts", label: "Обязательные тексты", type: "textarea" },
      { name: "additionalNotes", label: "Дополнительные пожелания", type: "textarea" }
    ],
    promptTemplate: "Создай коммерческий дизайн карточек маркетплейса с фокусом на конверсию и читаемость."
  },
  {
    slug: "vk-design",
    title: "Оформление сообщества ВК",
    shortDescription: "Обложка, аватар и визуальная система для сообщества ВКонтакте.",
    description: "Подготовим узнаваемое оформление ВК: шапка, обложка, аватар и рекомендации по визуальному стилю.",
    basePrice: "4900",
    fieldsConfig: [
      { name: "communityName", label: "Название сообщества", type: "text", required: true },
      { name: "communityTopic", label: "Тематика", type: "text", required: true },
      { name: "vkUrl", label: "Ссылка на ВК", type: "text" },
      { name: "businessDescription", label: "Описание бизнеса", type: "textarea", required: true },
      { name: "targetAudience", label: "Целевая аудитория", type: "textarea", required: true },
      { name: "style", label: "Стиль", type: "text" },
      { name: "colors", label: "Цвета", type: "text" },
      { name: "logoAvailability", label: "Есть ли логотип", type: "select", options: ["Да", "Нет", "Нужно адаптировать" ] },
      { name: "coverText", label: "Текст на обложке", type: "textarea" },
      { name: "additionalNotes", label: "Дополнительные пожелания", type: "textarea" }
    ],
    promptTemplate: "Создай оформление ВК, которое быстро объясняет ценность сообщества и сохраняет брендовый стиль."
  },
  {
    slug: "logos",
    title: "Логотипы",
    shortDescription: "Концепции логотипа для нового продукта, услуги или компании.",
    description: "Соберём бриф и подготовим варианты логотипа с объяснением идеи, ограничениями и сценариями использования.",
    basePrice: "5900",
    fieldsConfig: [
      { name: "brandName", label: "Название бренда", type: "text", required: true },
      { name: "businessArea", label: "Сфера бизнеса", type: "text", required: true },
      { name: "brandDescription", label: "Описание бренда", type: "textarea", required: true },
      { name: "targetAudience", label: "Целевая аудитория", type: "textarea", required: true },
      { name: "logoType", label: "Тип логотипа", type: "select", options: ["Текстовый", "Знак + текст", "Эмблема", "Не знаю" ] },
      { name: "style", label: "Стиль", type: "text" },
      { name: "colors", label: "Цвета", type: "text" },
      { name: "usagePlaces", label: "Где будет использоваться", type: "textarea" },
      { name: "forbiddenElements", label: "Что нельзя использовать", type: "textarea" },
      { name: "additionalNotes", label: "Дополнительные пожелания", type: "textarea" }
    ],
    promptTemplate: "Создай практичный логотип, который легко масштабируется и работает в цифровых и печатных каналах."
  },
  {
    slug: "banners",
    title: "Баннеры",
    shortDescription: "Рекламные и информационные баннеры для сайтов, соцсетей и промо.",
    description: "Делаем баннеры под конкретный оффер, площадку и размер, с акцентом на читаемость и CTA.",
    basePrice: "2900",
    fieldsConfig: [
      { name: "bannerPurpose", label: "Цель баннера", type: "text", required: true },
      { name: "placementPlatform", label: "Площадка размещения", type: "text", required: true },
      { name: "sizes", label: "Размеры", type: "text", required: true },
      { name: "topic", label: "Тема", type: "text", required: true },
      { name: "offer", label: "Оффер", type: "textarea", required: true },
      { name: "bannerText", label: "Текст баннера", type: "textarea" },
      { name: "cta", label: "Призыв к действию", type: "text" },
      { name: "style", label: "Стиль", type: "text" },
      { name: "colors", label: "Цвета", type: "text" },
      { name: "brandFiles", label: "Брендовые материалы", type: "textarea" },
      { name: "additionalNotes", label: "Дополнительные пожелания", type: "textarea" }
    ],
    promptTemplate: "Создай баннер с понятной иерархией, заметным оффером и читаемым CTA."
  }
] as const;
