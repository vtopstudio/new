import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { serviceSeeds } from '../src/lib/services-data';
const prisma = new PrismaClient();
async function main() {
  for (const service of serviceSeeds) {
    await prisma.service.upsert({ where: { slug: service.slug }, update: { ...service, basePrice: service.basePrice }, create: { ...service, basePrice: service.basePrice } });
  }
  await prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { email: 'admin@example.com', name: 'Администратор', role: UserRole.ADMIN, passwordHash: await bcrypt.hash('admin12345', 10) } });
  await prisma.user.upsert({ where: { email: 'operator@example.com' }, update: {}, create: { email: 'operator@example.com', name: 'Оператор', role: UserRole.OPERATOR, passwordHash: await bcrypt.hash('operator12345', 10) } });
  await prisma.addon.createMany({ data: [
    { title: 'Исходники', description: 'Передача редактируемых исходных файлов.', price: '2500' },
    { title: 'Срочная доработка', description: 'Приоритетная итерация правок.', price: '1900' }
  ], skipDuplicates: true });
}
main().finally(() => prisma.$disconnect());
