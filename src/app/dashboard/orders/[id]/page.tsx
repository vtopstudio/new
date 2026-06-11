import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, paymentStatusLabels, rub } from "@/lib/format";
import { PayButton } from "@/components/pay-button";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/auth/sign-in");
  const { id } = await params;
  const order = await prisma.order.findFirst({ where: { id, userId: session.user.id }, include: { service: true, files: true, designResults: true } });
  if (!order) notFound();
  return <main className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">Заказ №{order.id}</h1><div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]"><section className="card"><h2 className="text-2xl font-black">{order.service.title}</h2><div className="mt-4 grid gap-2">{Object.entries(order.briefData as Record<string,string>).map(([k,v]) => <p key={k}><b>{k}:</b> {v || "—"}</p>)}</div><h3 className="mt-8 font-black">Комментарий администратора</h3><p className="mt-2 text-slate-600">{order.adminComment || "Комментариев пока нет."}</p><h3 className="mt-8 font-black">Готовые варианты</h3><div className="mt-3 grid gap-3">{order.designResults.map((result) => <a className="rounded-2xl bg-slate-50 p-4" href={result.imageUrl} download key={result.id}><b>{result.title}</b><p>{result.description}</p><span className="text-brand">Скачать</span></a>)}{!order.designResults.length && <p className="text-slate-500">Результаты появятся после работы оператора.</p>}</div></section><aside className="card h-fit"><p className="badge">{orderStatusLabels[order.status]}</p><p className="mt-3 badge">{paymentStatusLabels[order.paymentStatus]}</p><p className="mt-6 text-3xl font-black">{rub(order.price)}</p>{order.paymentStatus !== "PAID" && <div className="mt-6"><PayButton orderId={order.id} /></div>}</aside></div></main>;
}
