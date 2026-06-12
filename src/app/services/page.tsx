import Link from "next/link";
import { rub } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: "asc" } });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-black">Каталог услуг</h1>
      <p className="mt-3 text-slate-600">Выберите готовый дизайн-продукт и заполните бриф.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <Link href={`/services/${service.slug}`} className="card hover:shadow-soft" key={service.id}>
            <h2 className="text-2xl font-black">{service.title}</h2>
            <p className="mt-3 text-slate-600">{service.description}</p>
            <p className="mt-5 font-black">от {rub(service.basePrice)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
