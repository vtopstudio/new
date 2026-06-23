import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, isStaff } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-black tracking-tight">DesignMate AI</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/services">Услуги</Link>
          <Link href="/#process">Как работает</Link>
          <Link href="/#faq">FAQ</Link>
          {session?.user && <Link href="/dashboard">Кабинет</Link>}
          {session?.user && <Link href="/dashboard/orders">Мои заказы</Link>}
          {isStaff(session?.user?.role) && <Link href="/admin">Админка</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <SignOutButton />
          ) : (
            <>
              <Link className="btn btn-secondary py-2" href="/auth/sign-in">Войти</Link>
              <Link className="btn btn-primary py-2" href="/auth/sign-up">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
