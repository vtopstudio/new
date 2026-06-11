import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, setSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
const schema = z.object({ email: z.string().email(), name: z.string().min(2), password: z.string().min(8) });
export async function POST(req: Request) {
  const body = Object.fromEntries((await req.formData()).entries());
  const data = schema.safeParse(body);
  if (!data.success) return NextResponse.redirect(new URL('/auth/sign-up?error=Проверьте данные', req.url));
  const exists = await prisma.user.findUnique({ where: { email: data.data.email } });
  if (exists) return NextResponse.redirect(new URL('/auth/sign-up?error=Email уже зарегистрирован', req.url));
  const user = await prisma.user.create({ data: { email: data.data.email, name: data.data.name, passwordHash: await hashPassword(data.data.password) } });
  await setSession({ id: user.id, email: user.email, name: user.name, role: user.role });
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
