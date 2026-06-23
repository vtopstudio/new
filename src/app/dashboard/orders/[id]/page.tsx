import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { PayButton } from "@/components/pay-button";
import { authOptions } from "@/lib/auth";
import { orderStatusLabels, paymentStatusLabels, rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/sign-in");

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { service: true, files: true, designResults: true }
  });
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <span className="badge">Статусный центр</span><h1 className="mt-4 text-4xl font-black">Заказ №{order.id}</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <section className="card">
          <h2 className="text-2xl font-black">{order.service.title}</h2><div className="mt-4 rounded-3xl bg-slate-50 p-4"><b>Что происходит сейчас:</b><p className="mt-1 text-slate-600">Оператор видит вашу заявку, файлы и 4 промта. Следующий шаг — проверка результата и загрузка защищённого превью.</p></div>
          <div className="mt-4 grid gap-2">
            {Object.entries(order.briefData as Record<string, string>).map(([key, value]) => (
              <p key={key}>
                <b>{key}:</b> {value || "—"}
              </p>
            ))}
          </div>
          <h3 className="mt-8 font-black">Комментарий администратора</h3>
          <p className="mt-2 text-slate-600">{order.adminComment || "Комментариев пока нет."}</p>
          <h3 className="mt-8 font-black">Превью и готовые результаты</h3>
          <div className="mt-3 grid gap-3">
            {order.designResults.map((result) => (
              <a className="rounded-2xl bg-slate-50 p-4" href={result.imageUrl} download key={result.id}>
                <b>{result.title}</b>
                <p>{result.description}</p>
                <span className="text-brand">Скачать после оплаты/списания</span>
              </a>
            ))}
            {!order.designResults.length && <p className="text-slate-500">Результаты появятся после работы оператора.</p>}
          </div>
        </section>
        <aside className="card h-fit">
          <p className="badge">{orderStatusLabels[order.status]}</p>
          <p className="mt-3 badge">{paymentStatusLabels[order.paymentStatus]}</p>
          <p className="mt-6 text-sm text-slate-500">Итоговая стоимость</p><p className="text-3xl font-black">{rub(order.price)}</p><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p>Доступный баланс: UI-подготовка</p><p>Зарезервировано под заказ: {rub(order.price)}</p><p>Финальные файлы открываются после списания.</p></div>
          {order.paymentStatus !== "PAID" && (
            <div className="mt-6">
              <PayButton orderId={order.id} />
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
