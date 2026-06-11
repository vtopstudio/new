import { randomUUID } from "crypto";
import { z } from "zod";

const paymentResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  confirmation: z.object({ confirmation_url: z.string().url() }).optional()
});

export function requireYooKassaConfig() {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) throw new Error("Не настроены YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
  return { shopId, secretKey };
}

function authHeader(shopId: string, secretKey: string) {
  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
}

export async function createYooKassaPayment(input: {
  amount: string;
  orderId: string;
  userId: string;
  internalPaymentId: string;
  idempotenceKey?: string;
}) {
  const { shopId, secretKey } = requireYooKassaConfig();
  const idempotenceKey = input.idempotenceKey ?? randomUUID();
  const returnUrl = process.env.YOOKASSA_RETURN_URL ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/payment/success`;

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      Authorization: authHeader(shopId, secretKey),
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey
    },
    body: JSON.stringify({
      amount: { value: Number(input.amount).toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: returnUrl },
      description: `Заказ №${input.orderId}`,
      metadata: { orderId: input.orderId, userId: input.userId, internalPaymentId: input.internalPaymentId }
    })
  });

  if (!response.ok) throw new Error(`ЮKassa вернула ошибку ${response.status}: ${await response.text()}`);
  const parsed = paymentResponseSchema.parse(await response.json());
  if (!parsed.confirmation?.confirmation_url) throw new Error("ЮKassa не вернула ссылку подтверждения");
  return { providerPaymentId: parsed.id, status: parsed.status, confirmationUrl: parsed.confirmation.confirmation_url, idempotenceKey };
}

export async function getYooKassaPayment(providerPaymentId: string) {
  const { shopId, secretKey } = requireYooKassaConfig();
  const response = await fetch(`https://api.yookassa.ru/v3/payments/${providerPaymentId}`, {
    headers: { Authorization: authHeader(shopId, secretKey) }
  });
  if (!response.ok) throw new Error(`Не удалось получить статус платежа: ${response.status}`);
  return response.json() as Promise<{ id: string; status: string; metadata?: Record<string, string> }>;
}
