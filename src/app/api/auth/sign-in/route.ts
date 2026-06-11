import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession, verifyPassword } from '@/lib/auth';
export async function POST(req: Request) {
  const body = Object.fromEntries((await req.formData()).entries());
  const user = await prisma.user.findUnique({ where: { email: String(body.email) } });
  if (!user || !(await verifyPassword(String(body.password), user.passwordHash))) return NextResponse.redirect(new URL('/auth/sign-in?error=Неверный email или пароль', req.url));
  await setSession({ id: user.id, email: user.email, name: user.name, role: user.role });
  return NextResponse.redirect(new URL(user.role === 'USER' ? '/dashboard' : '/admin', req.url));
}
