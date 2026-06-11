import './globals.css';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
export const metadata = { title: 'AI + Human дизайн', description: 'Готовый дизайн для бизнеса с ИИ и контролем человека' };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return <html lang="ru"><body><header className="border-b border-white/10 bg-slate-950/80"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-black">DesignPilot</Link><nav className="flex gap-4 text-sm text-slate-300"><Link href="/services">Услуги</Link>{user ? <><Link href="/dashboard">Кабинет</Link>{user.role !== 'USER' && <Link href="/admin">Админка</Link>}<form action="/api/auth/sign-out" method="post"><button>Выйти</button></form></> : <><Link href="/auth/sign-in">Вход</Link><Link href="/auth/sign-up">Регистрация</Link></>}</nav></div></header><main>{children}</main></body></html>;
}
