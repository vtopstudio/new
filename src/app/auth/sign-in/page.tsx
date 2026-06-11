import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");
  return <main className="mx-auto max-w-md px-4 py-16"><div className="card"><h1 className="text-3xl font-black">Вход</h1><p className="mt-2 text-slate-600">Войдите, чтобы видеть заказы и оплачивать услуги.</p><SignInForm /></div></main>;
}
