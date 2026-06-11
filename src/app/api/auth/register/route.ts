import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2).max(80).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Проверьте email и пароль" }, { status: 400 });
  const { email, password, name } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
  const user = await prisma.user.create({ data: { email: email.toLowerCase(), name, passwordHash: await bcrypt.hash(password, 10) } });
  return NextResponse.json({ id: user.id, email: user.email });
}
