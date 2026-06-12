import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/auth/sign-in");
  const orders = await prisma.order.count({ where: { userId: session.user.id } });
  return <main className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">Личный кабинет</h1><div className="mt-8 grid gap-4 md:grid-cols-3"><Link className="card" href="/dashboard/orders"><b>Мои заказы</b><p className="mt-2 text-3xl font-black">{orders}</p></Link><Link className="card" href="/dashboard/balance"><b>Баланс</b><p className="mt-2 text-slate-600">История и бонусы</p></Link><Link className="card" href="/dashboard/profile"><b>Профиль</b><p className="mt-2 text-slate-600">Данные аккаунта</p></Link></div></main>;
}
