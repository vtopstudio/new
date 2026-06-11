import { prisma } from '@/lib/prisma';
import { ServiceCard, Shell } from '@/components/ui';
export default async function ServicesPage() { const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: 'asc' } }); return <Shell title="Каталог услуг" subtitle="Выберите дизайн-продукт под вашу бизнес-задачу."><div className="grid gap-5 md:grid-cols-2">{services.map((s) => <ServiceCard key={s.id} service={s} />)}</div></Shell>; }
