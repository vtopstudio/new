"use client";

import { useState } from "react";

export function PayButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    setLoading(true); setError("");
    const response = await fetch("/api/payments/yookassa/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setError(data.error ?? "Не удалось создать платёж"); return; }
    window.location.href = data.confirmationUrl;
  }
  return <div><button className="btn btn-primary" onClick={pay} disabled={loading}>{loading ? "Создаём платёж..." : "Оплатить через ЮKassa"}</button>{error && <p className="mt-2 text-sm text-red-600">{error}</p>}</div>;
}
