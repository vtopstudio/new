export function rub(value: number | string | { toString(): string }) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number(value.toString()));
}

export const orderStatusLabels: Record<string, string> = {
  DRAFT: "Черновик",
  WAITING_PAYMENT: "Ожидает оплаты",
  PAID: "Оплачен",
  IN_PROGRESS: "В работе",
  NEEDS_CLARIFICATION: "Нужно уточнение",
  READY: "Готов",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён"
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  FAILED: "Ошибка оплаты",
  REFUNDED: "Возвращён",
  MANUAL_CONFIRMED: "Подтверждён вручную",
  CANCELLED: "Отменён"
};
