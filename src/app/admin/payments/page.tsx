import { paymentStatusLabels, rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPayments() {
  const payments = await prisma.payment.findMany({
    include: { order: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-black">Платежи</h1>
      <div className="mt-8 space-y-3">
        {payments.map((payment) => (
          <div className="card" key={payment.id}>
            <b>{rub(payment.amount)} · {paymentStatusLabels[payment.status]}</b>
            <p className="text-sm text-slate-500">
              {payment.user.email} · Заказ {payment.orderId} · providerPaymentId: {payment.providerPaymentId || "—"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
