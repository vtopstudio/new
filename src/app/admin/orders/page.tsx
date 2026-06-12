import Link from "next/link";
import { orderStatusLabels, paymentStatusLabels, rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: { service: true, user: true, payments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-black">Заказы</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link className="card block" href={`/admin/orders/${order.id}`} key={order.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <b>{order.service.title}</b>
                <p className="text-sm text-slate-500">{order.user.email} · №{order.id}</p>
              </div>
              <div className="flex gap-2">
                <span className="badge">{orderStatusLabels[order.status]}</span>
                <span className="badge">{paymentStatusLabels[order.paymentStatus]}</span>
                <b>{rub(order.price)}</b>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
