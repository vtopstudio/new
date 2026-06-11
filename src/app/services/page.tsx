import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ServicesPage(){const services=await prisma.service.findMany({where:{isActive:true},orderBy:{createdAt:"asc"}});return <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-4xl font-black">Услуги</h1><p className="mt-3 text-slate-600">Выберите задачу, заполните бриф и оплатите заказ онлайн.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{services.map(s=><article className="card p-6" key={s.id}><h2 className="text-xl font-black">{s.title}</h2><p className="mt-3 text-slate-600">{s.description}</p><p className="mt-5 text-2xl font-black">{s.basePrice.toString()} руб.</p><Link href={`/order/new/${s.slug}`} className="btn mt-5 w-full">Заказать</Link></article>)}</div></main>}
