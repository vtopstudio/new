import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rub } from "@/lib/format";
import { showcaseFor, type BriefField } from "@/lib/services";
import { createOrderAction } from "../../actions";
import { OrderBriefForm } from "./order-brief-form";

export const dynamic = "force-dynamic";

export default async function NewOrderPage({ params }: { params: Promise<{ serviceSlug: string }> }) {
  const { serviceSlug } = await params;
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) notFound();

  const fields = service.fieldsConfig as BriefField[];
  const showcase = showcaseFor(service.slug);
  const checkoutPrice = rub(service.basePrice);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <OrderBriefForm
        action={createOrderAction}
        checkoutPrice={checkoutPrice}
        composition={showcase?.composition ?? []}
        fields={fields}
        serviceSlug={service.slug}
        serviceTitle={showcase?.title ?? service.title}
      />
    </main>
  );
}
