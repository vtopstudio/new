import crypto from "crypto";

export type YooKassaPaymentRequest = { amount: string; orderId: string; description: string; returnUrl: string };

const API_URL = "https://api.yookassa.ru/v3/payments";

function authHeader() {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secret = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secret) throw new Error("YooKassa не настроена: укажите YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
  return `Basic ${Buffer.from(`${shopId}:${secret}`).toString("base64")}`;
}

export async function createYooKassaPayment({ amount, orderId, description, returnUrl }: YooKassaPaymentRequest) {
  const idempotenceKey = crypto.randomUUID();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: authHeader(), "Idempotence-Key": idempotenceKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: { value: amount, currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: returnUrl },
      description,
      metadata: { orderId },
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.description || "Ошибка создания платежа YooKassa");
  return { payload, idempotenceKey, confirmationUrl: payload.confirmation?.confirmation_url as string | undefined };
}

export async function fetchYooKassaPayment(paymentId: string) {
  const response = await fetch(`${API_URL}/${paymentId}`, { headers: { Authorization: authHeader(), "Content-Type": "application/json" } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.description || "Ошибка проверки платежа YooKassa");
  return payload;
}

export function verifyWebhookSignature(rawBody: string, signature?: string | null) {
  const secret = process.env.YOOKASSA_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
