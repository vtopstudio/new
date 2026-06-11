import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import type { UserRole } from '@prisma/client';

const cookieName = 'ai_design_session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
export type SessionUser = { id: string; email: string; name: string | null; role: UserRole };

export async function hashPassword(password: string) { return bcrypt.hash(password, 10); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function signSession(user: SessionUser) { return new SignJWT(user).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret); }
export async function setSession(user: SessionUser) { cookies().set(cookieName, await signSession(user), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 }); }
export function clearSession() { cookies().delete(cookieName); }
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return { id: String(payload.id), email: String(payload.email), name: payload.name ? String(payload.name) : null, role: payload.role as UserRole }; } catch { return null; }
}
export async function requireUser() { const user = await getSessionUser(); if (!user) redirect('/auth/sign-in'); return user; }
export async function requireRole(roles: UserRole[]) { const user = await requireUser(); if (!roles.includes(user.role)) redirect('/dashboard'); return user; }
export async function getDbUser() { const session = await getSessionUser(); if (!session) return null; return prisma.user.findUnique({ where: { id: session.id } }); }
