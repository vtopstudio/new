import { getServerSession } from "next-auth";import { authOptions } from "@/lib/auth";
export default async function ProfilePage(){const s=await getServerSession(authOptions);return <main className="mx-auto max-w-4xl px-4 py-12"><div className="card"><h1 className="text-4xl font-black">Профиль</h1><p className="mt-3">{s?.user?.name} · {s?.user?.email}</p></div></main>}
