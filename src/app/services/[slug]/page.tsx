import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ServiceDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=await prisma.service.findUnique({where:{slug}});if(!s)notFound();return <main className="mx-auto max-w-3xl px-4 py-10"><div className="card p-8"><span className="badge">Услуга</span><h1 className="mt-4 text-4xl font-black">{s.title}</h1><p className="mt-4 text-slate-600">{s.description}</p><p className="mt-6 text-3xl font-black text-indigo-700">{s.basePrice.toString()} руб.</p><Link className="btn mt-8" href={`/order/new/${s.slug}`}>Заполнить бриф</Link></div></main>}
