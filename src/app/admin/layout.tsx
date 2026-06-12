import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isStaff } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!isStaff(session?.user?.role)) redirect("/dashboard");
  return <div><nav className="border-b bg-slate-900 text-white"><div className="mx-auto flex max-w-7xl gap-5 px-4 py-3 text-sm font-semibold"><Link href="/admin">Обзор</Link><Link href="/admin/orders">Заказы</Link><Link href="/admin/services">Услуги</Link><Link href="/admin/users">Пользователи</Link><Link href="/admin/payments">Платежи</Link></div></nav>{children}</div>;
}
