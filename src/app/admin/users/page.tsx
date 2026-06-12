import { prisma } from "@/lib/prisma";
export const dynamic="force-dynamic";
export default async function AdminUsers(){const users=await prisma.user.findMany({orderBy:{createdAt:"desc"}});return <main className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">Пользователи</h1><div className="mt-8 space-y-3">{users.map(u=><div className="card" key={u.id}><b>{u.email}</b><p>{u.name||"Без имени"} · {u.role}</p></div>)}</div></main>}
