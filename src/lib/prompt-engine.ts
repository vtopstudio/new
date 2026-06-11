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

export function generateDesignPrompt({ service, briefData, files = [], notes }: PromptInput) {
  const fields = Object.entries(briefData)
    .map(([key, value]) => `- ${key}: ${valueToText(value)}`)
    .join("\n");
  const refs = files.length
    ? files.map((file) => `- ${file.originalName} (${file.fileType}): ${file.fileUrl}`).join("\n")
    : "- Референсы не загружены";

  return `# Промт для AI + Human дизайна\n\n## 1. Тип услуги\n${service.title}\n\n## 2. Цель дизайна\nПодготовить конечный прикладной коммерческий дизайн-продукт для бизнес-задачи клиента, а не случайную нейросетевую картинку.\n\n## 3. Описание услуги\n${service.description}\n\n## 4. Данные пользователя и бриф\n${fields || "- Бриф пока пуст"}\n\n## 5. Технические требования\nИспользовать размеры, площадки, обязательные тексты и ограничения из брифа. Проверить читаемость текста на мобильных экранах и аккуратность композиции.\n\n## 6. Целевая аудитория\nСформулировать визуальное решение под аудиторию из брифа, её ожидания, боли и мотивы покупки.\n\n## 7. Стиль и цвета\nСоблюдать стиль, цветовые пожелания и брендовые ограничения из брифа. Если данных мало — предложить современное, чистое и коммерчески понятное направление.\n\n## 8. Тексты\nВсе тексты должны быть короткими, читаемыми, без ошибок и с понятной иерархией.\n\n## 9. Референсы и файлы\n${refs}\n\n## 10. Ограничения\nНе использовать запрещённые элементы, не перегружать макет, не обещать то, чего нет в оффере клиента.\n\n## 11. Количество вариантов\nПодготовить 3 сильных варианта с разными визуальными гипотезами.\n\n## 12. Инструкция оператору\n${service.promptTemplate}\n\n## 13. Контроль качества\nПеред отдачей проверить композицию, контраст, читаемость, соответствие площадке, отсутствие артефактов и пригодность для реального коммерческого использования.${notes ? `\n\n## 14. Заметки администратора/оператора\n${notes}` : ""}`;
}
