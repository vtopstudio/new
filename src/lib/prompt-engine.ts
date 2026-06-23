import type { Service, OrderFile } from "@prisma/client";

type PromptInput = {
  service: Pick<Service, "title" | "description" | "promptTemplate">;
  briefData: Record<string, unknown>;
  files?: Pick<OrderFile, "fileUrl" | "fileType" | "originalName">[];
  notes?: string;
};

function valueToText(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value ?? "Не указано");
}

const conceptAngles = [
  "рациональная и чистая коммерческая подача",
  "более эмоциональная и заметная визуальная гипотеза",
  "премиальный минималистичный вариант",
  "контрастный performance-вариант с сильным оффером"
];

export function generateDesignPrompt({ service, briefData, files = [], notes }: PromptInput) {
  const fields = Object.entries(briefData).map(([key, value]) => `- ${key}: ${valueToText(value)}`).join("\n");
  const refs = files.length ? files.map((file) => `- ${file.originalName} (${file.fileType}): ${file.fileUrl}`).join("\n") : "- Референсы не загружены";
  const variants = conceptAngles.map((angle, index) => `### Промт ${index + 1}: ${angle}\nТип услуги: ${service.title}\nЦель дизайна: подготовить прикладной коммерческий дизайн-материал, а не случайную нейросетевую картинку.\nКонтекст бизнеса и заявка клиента:\n${fields || "- Ответы клиента пока пустые"}\nРеференсы и файлы:\n${refs}\nФормат и размеры: взять из заявки клиента, площадки и обязательных текстов.\nСтиль и визуальное направление: ${angle}; учитывать выбранные примеры стиля, цвета, ограничения и то, что нельзя использовать.\nNegative prompt: нечитаемый текст, перегруз деталями, искажённые логотипы, лишние элементы, AI-артефакты, ошибки в русском тексте, несоответствие площадке.\nИнструкция оператору: ${service.promptTemplate}\nЧек-лист проверки: текст читается, композиция аккуратная, соблюдён формат площадки, учтены пожелания клиента, нет орфографических ошибок и явных AI-артефактов.`).join("\n\n");

  return `# Prompt Engine 2.0: 4 промта для AI + Human дизайна\n\n## Тип услуги\n${service.title}\n\n## Описание услуги\n${service.description}\n\n## Данные клиента\n${fields || "- Заявка пока пустая"}\n\n## Файлы, референсы и материалы\n${refs}\n\n## Ограничения и требования качества\nНе использовать запрещённые элементы, не перегружать макет, не обещать то, чего нет в оффере клиента. Проверить читаемость на мобильных экранах, композицию, контраст, соответствие площадке и коммерческую пригодность.\n\n## Четыре концептуальных промта\n${variants}${notes ? `\n\n## Внутренние заметки оператора\n${notes}` : ""}`;
}
