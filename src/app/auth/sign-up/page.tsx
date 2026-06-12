import { signUpAction } from "../actions";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <form action={signUpAction} className="card space-y-4">
        <h1 className="text-3xl font-black">Регистрация</h1>
        <p className="text-slate-600">Создайте аккаунт, чтобы оформить первый заказ.</p>
        {error === "email-exists" && (
          <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
            Пользователь с таким email уже зарегистрирован. Войдите или используйте другой email.
          </p>
        )}
        <input className="input" name="name" placeholder="Ваше имя" required />
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="password" type="password" minLength={8} placeholder="Пароль от 8 символов" required />
        <button className="btn btn-primary w-full">Создать аккаунт</button>
      </form>
    </main>
  );
}
