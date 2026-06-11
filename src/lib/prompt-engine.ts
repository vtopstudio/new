type BriefData = Record<string, unknown>;

export function renderPrompt(template: string, brief: BriefData) {
  return template.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key: string) => String(brief[key] ?? "не указано"));
}

export function buildSystemPrompt(serviceTitle: string, brief: BriefData, template: string) {
  const rendered = renderPrompt(template, brief);
  return [
    "Ты — AI-ассистент дизайн-студии VTop Studio.",
    "Сформируй подробное ТЗ и промпт для генерации визуального дизайна, который затем проверит дизайнер-человек.",
    `Услуга: ${serviceTitle}.`,
    `Данные клиента: ${JSON.stringify(brief, null, 2)}.`,
    `Итоговый промпт: ${rendered}`,
    "Ответ должен быть применим для production-дизайна, с композицией, стилем, цветом, ограничениями и критериями качества.",
  ].join("\n");
}
