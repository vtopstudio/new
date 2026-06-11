'use client';
import { useState } from 'react';
export function PaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  async function pay() { setLoading(true); setError(''); const res = await fetch('/api/payments/yookassa/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) }); const data = await res.json(); setLoading(false); if (data.confirmationUrl) location.href = data.confirmationUrl; else setError(data.error || 'Не удалось создать платёж'); }
  return <div><button className="btn" disabled={loading} onClick={pay}>{loading ? 'Создаём платёж…' : 'Оплатить через ЮKassa'}</button>{error && <p className="mt-2 text-sm text-red-300">{error}</p>}</div>;
}
