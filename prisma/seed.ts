import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serviceSeedData } from "../src/lib/services";

const prisma = new PrismaClient();

async function main() {
  for (const service of serviceSeedData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }

  const passwordHash = await bcrypt.hash("Admin12345!", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: Role.ADMIN, passwordHash, name: "Администратор" },
    create: { email: "admin@example.com", name: "Администратор", passwordHash, role: Role.ADMIN }
  });

  await prisma.addon.upsert({
    where: { id: "source-files" },
    update: {},
    create: { id: "source-files", title: "Исходники", description: "Передача редактируемых исходных файлов после приёмки.", price: "1500" }
  });
}

main().finally(async () => prisma.$disconnect());
