export type BriefField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: string[];
};

export type ServiceShowcase = {
  slug: string;
  title: string;
  shortDescription: string;
  includes: string[];
  resultFormat: string;
  priceFrom: string;
  timeFrom: string;
  audience: string;
  composition: string[];
  clientNeeds: string[];
  formats: string[];
  faq: { q: string; a: string }[];
  accent: string;
};

export const serviceShowcases: Record<string, ServiceShowcase> = {
  "marketplace-cards": {
    slug: "marketplace-cards",
    title: "Карточки товаров для маркетплейсов",
    shortDescription: "Продающие карточки для Ozon, Wildberries и Яндекс Маркета.",
    includes: ["Главный слайд", "Инфографика преимуществ", "Единый стиль серии", "Подготовка под площадку"],
    resultFormat: "4 варианта главной карточки или полная карточка 5+ слайдов",
    priceFrom: "500",
    timeFrom: "5 минут",
    audience: "Продавцам на Ozon, WB и Яндекс Маркете, которым нужен понятный визуал без долгой переписки.",
    composition: ["Главная карточка — 4 варианта на выбор — от 500 ₽", "Дополнительные слайды — +250 ₽/шт после превью", "Полная карточка на 5+ слайдов — от 1500 ₽", "Серия карточек в едином стиле — расчёт после количества товаров"],
    clientNeeds: ["Название и преимущества товара", "Площадка и категория", "Фото товара или ссылки", "Обязательные тексты и ограничения"],
    formats: ["Вертикальные карточки", "Инфографика", "Серия слайдов", "Единый стиль линейки"],
    faq: [
      { q: "Можно ли сделать серию товаров?", a: "Да, на этапе заявки укажите количество товаров и нужных слайдов — оператор рассчитает серию." },
      { q: "Нужны ли фотографии товара?", a: "Желательно приложить фото, старые карточки или ссылки. Если материалов мало, мы подготовим концепцию по описанию." }
    ],
    accent: "from-amber-200 via-orange-100 to-white"
  },
  "vk-design": {
    slug: "vk-design",
    title: "Оформление сообщества ВК",
    shortDescription: "Обложка, аватар и визуальная система для сообщества ВКонтакте.",
    includes: ["Обложка-шапка + мобильная версия", "Аватар", "Обложки меню/товаров/услуг", "Визуальная концепция"],
    resultFormat: "4 варианта визуальной концепции",
    priceFrom: "500",
    timeFrom: "5 минут",
    audience: "Сообществам, экспертам и локальному бизнесу, которым нужен аккуратный стартовый визуал ВК.",
    composition: ["Обложка — 4 варианта — от 500 ₽", "Мобильная обложка — +250 ₽ после превью", "Аватар — 4 варианта — от 500 ₽", "Полное оформление — 2500 ₽"],
    clientNeeds: ["Название и ссылка на сообщество", "Описание бизнеса", "Тексты для обложки", "Логотип, цвета и примеры стиля"],
    formats: ["Горизонтальная обложка", "Мобильная версия", "Аватар", "Меню/витрина"],
    faq: [
      { q: "Это полноценный брендбук?", a: "Нет, это практичная визуальная концепция для ВК с рекомендациями по стилю." },
      { q: "Можно добавить меню и товары?", a: "Да, выберите нужный состав заказа в заявке." }
    ],
    accent: "from-sky-200 via-indigo-100 to-white"
  },
  banners: {
    slug: "banners",
    title: "Баннеры и креативы",
    shortDescription: "Рекламные и информационные баннеры для сайтов, соцсетей и промо.",
    includes: ["Один или несколько размеров", "Продающий оффер", "CTA", "Адаптация под площадку"],
    resultFormat: "4 варианта одного баннера или серия размеров",
    priceFrom: "500",
    timeFrom: "5 минут",
    audience: "Маркетологам, предпринимателям и командам, которым нужен быстрый промо-креатив.",
    composition: ["Один баннер — 4 варианта — от 500 ₽", "Серия баннеров — от 500 ₽ +100 ₽/размер", "Автоулучшение оффера — как рекомендация оператора"],
    clientNeeds: ["Цель баннера", "Площадка и размеры", "Оффер и CTA", "Брендовые материалы"],
    formats: ["Горизонтальные баннеры", "Квадратные креативы", "Адаптации размеров", "Промо-объявления"],
    faq: [
      { q: "Можете улучшить оффер?", a: "Да, оператор может предложить более понятную формулировку для баннера." },
      { q: "Можно заказать несколько размеров?", a: "Да, серия рассчитывается по количеству адаптаций." }
    ],
    accent: "from-fuchsia-200 via-rose-100 to-white"
  },
  logos: {
    slug: "logos",
    title: "Концепции логотипа",
    shortDescription: "Идеи логотипа для нового продукта, услуги или компании.",
    includes: ["10–15 вариантов", "Объяснение идеи", "Визуализация использования", "Рекомендации по цветам и шрифтовому характеру"],
    resultFormat: "10 вариантов от 4500 ₽ или 15 вариантов от 6000 ₽",
    priceFrom: "4500",
    timeFrom: "от 1 дня",
    audience: "Новым проектам, которым нужны направления логотипа до полноценной бренд-айдентики.",
    composition: ["10 вариантов логотипа — 4500 ₽", "15 вариантов логотипа — 6000 ₽", "Визуализация — +300 ₽/шт", "Исходники — +1500 ₽/шт после выбора"],
    clientNeeds: ["Название бренда", "Сфера и аудитория", "Где будет использоваться логотип", "Что нельзя использовать"],
    formats: ["Знак + текст", "Текстовый логотип", "Эмблема", "Мокапы применения"],
    faq: [
      { q: "Это бренд-айдентика?", a: "Нет, услуга позиционируется как концепции логотипа. Полная айдентика — следующий этап." },
      { q: "Исходники входят?", a: "Исходные файлы можно заказать как отдельную опцию после выбора концепции." }
    ],
    accent: "from-emerald-200 via-teal-100 to-white"
  }
};

export function showcaseFor(slug: string) {
  return serviceShowcases[slug];
}

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
