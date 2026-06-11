import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";

export async function Nav() {
  const session = await getServerSession(authOptions);
  return <header className="border-b bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-black text-indigo-700">VTop AI Design</Link><nav className="flex items-center gap-4 text-sm font-semibold"><Link href="/services">Услуги</Link>{session ? <><Link href="/dashboard">Кабинет</Link>{isAdmin(session) && <Link href="/admin">Админка</Link>}<Link href="/api/auth/signout">Выйти</Link></> : <><Link href="/auth/sign-in">Войти</Link><Link className="btn px-4 py-2" href="/auth/sign-up">Регистрация</Link></>}</nav></div></header>;
}
