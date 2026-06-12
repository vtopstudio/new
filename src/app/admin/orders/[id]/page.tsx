import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { protectedFileUrl } from "@/lib/storage";
import { updateOrderStatusAction, uploadResultAction } from "../../actions";

const statuses = ["DRAFT", "WAITING_PAYMENT", "PAID", "IN_PROGRESS", "NEEDS_CLARIFICATION", "READY", "COMPLETED", "CANCELLED"] as const;

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { service: true, user: true, files: true, designResults: true, payments: { include: { events: true } } }
  });
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-black">Заказ №{order.id}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-black">Бриф</h2>
            <p className="mt-2 text-slate-600">Клиент: {order.user.email}</p>
            <div className="mt-4 grid gap-2">
              {Object.entries(order.briefData as Record<string, string>).map(([key, value]) => (
                <p key={key}>
                  <b>{key}:</b> {value || "—"}
                </p>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between gap-3">
              <h2 className="text-2xl font-black">Сгенерированный промт</h2>
              <CopyButton text={order.generatedPrompt} />
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm text-white">{order.generatedPrompt}</pre>
          </div>

          <div className="card">
            <h2 className="text-2xl font-black">Файлы и результаты</h2>
            {order.files.map((file) => (
              <a className="mt-2 block text-brand" href={protectedFileUrl(file.id)} key={file.id}>
                {file.originalName}
              </a>
            ))}
            {order.designResults.map((result) => (
              <a className="mt-2 block text-brand" href={result.imageUrl} key={result.id}>
                {result.title}
              </a>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <form action={updateOrderStatusAction} className="card space-y-4">
            <input type="hidden" name="orderId" value={order.id} />
            <p className="badge">{orderStatusLabels[order.status]}</p>
            <p className="badge">{paymentStatusLabels[order.paymentStatus]}</p>
            <select className="input" name="status" defaultValue={order.status}>
              {statuses.map((status) => (
                <option value={status} key={status}>
                  {orderStatusLabels[status]}
                </option>
              ))}
            </select>
            <textarea className="input" name="adminComment" defaultValue={order.adminComment ?? ""} placeholder="Комментарий клиенту" />
            <button className="btn btn-primary w-full">Сохранить статус</button>
          </form>

          <form action={uploadResultAction} className="card space-y-4">
            <input type="hidden" name="orderId" value={order.id} />
            <h2 className="text-xl font-black">Загрузить результат</h2>
            <input className="input" name="title" placeholder="Название варианта" />
            <textarea className="input" name="description" placeholder="Описание" />
            <input className="input" name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />
            <button className="btn btn-primary w-full">Загрузить</button>
          </form>

          <div className="card">
            <h2 className="text-xl font-black">Платежи</h2>
            {order.payments.map((payment) => (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3" key={payment.id}>
                <p>{payment.status} · {payment.providerPaymentId || "без provider id"}</p>
                <p className="text-sm text-slate-500">Событий: {payment.events.length}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
