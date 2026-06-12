import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BriefField } from "@/lib/services";
import { createOrderAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewOrderPage({ params }: { params: Promise<{ serviceSlug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/sign-in");

  const { serviceSlug } = await params;
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) notFound();

  const fields = service.fieldsConfig as BriefField[];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black">Бриф: {service.title}</h1>
      <p className="mt-3 text-slate-600">Заполните детали задачи. После создания заказа можно перейти к оплате.</p>
      <form action={createOrderAction} className="card mt-8 space-y-5">
        <input type="hidden" name="serviceSlug" value={service.slug} />
        {fields.map((field) => (
          <label className="block" key={field.name}>
            <span className="mb-2 block font-semibold">
              {field.label}
              {field.required && " *"}
            </span>
            {field.type === "textarea" ? (
              <textarea className="input min-h-28" name={field.name} required={field.required} />
            ) : field.type === "select" ? (
              <select className="input" name={field.name} required={field.required}>
                {field.options?.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : (
              <input className="input" name={field.name} required={field.required} />
            )}
          </label>
        ))}
        <label className="block">
          <span className="mb-2 block font-semibold">Файлы и референсы (jpg/png/webp/pdf, до 8 МБ за файл и 32 МБ суммарно)</span>
          <input className="input" name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" />
        </label>
        <button className="btn btn-primary">Создать заказ</button>
      </form>
    </main>
  );
}
