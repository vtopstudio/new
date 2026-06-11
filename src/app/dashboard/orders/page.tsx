import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, paymentStatusLabels, rub } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/auth/sign-in");
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, include: { service: true }, orderBy: { createdAt: "desc" } });
  return <main className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">Мои заказы</h1><div className="mt-8 space-y-4">{orders.map((order) => <Link className="card block" href={`/dashboard/orders/${order.id}`} key={order.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><b>{order.service.title}</b><p className="text-sm text-slate-500">№ {order.id}</p></div><div className="flex gap-2"><span className="badge">{orderStatusLabels[order.status]}</span><span className="badge">{paymentStatusLabels[order.paymentStatus]}</span><span className="font-black">{rub(order.price)}</span></div></div></Link>)}{!orders.length && <p className="text-slate-600">Заказов пока нет.</p>}</div></main>;
}
