export function money(value: unknown) { return `${Number(value).toLocaleString('ru-RU')} ₽`; }
export const orderStatus: Record<string,string> = { DRAFT:'Черновик', WAITING_PAYMENT:'Ожидает оплату', PAID:'Оплачен', IN_PROGRESS:'В работе', NEEDS_CLARIFICATION:'Нужно уточнение', READY:'Готов', COMPLETED:'Завершён', CANCELLED:'Отменён' };
export const paymentStatus: Record<string,string> = { PENDING:'Ожидает', PAID:'Оплачен', FAILED:'Ошибка', REFUNDED:'Возврат', MANUAL_CONFIRMED:'Подтверждён вручную', CANCELLED:'Отменён' };
