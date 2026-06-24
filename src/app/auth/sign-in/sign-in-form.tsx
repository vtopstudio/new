"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export default function SignInForm() {
  const params = useSearchParams();
  const [error, setError] = useState("");
  async function onSubmit(formData: FormData) {
    setError("");
    const result = await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirect: false });
    if (result?.error) {
      setError("Неверный email или пароль");
      return;
    }
    window.location.assign(safeRedirectPath(params.get("callbackUrl")));
  }
  return <form action={onSubmit} className="mt-6 space-y-4">{params.get("registered") && <p className="rounded-2xl bg-green-50 p-3 text-sm text-green-700">Аккаунт создан. Теперь войдите.</p>}<input className="input" name="email" type="email" placeholder="Email" required /><input className="input" name="password" type="password" placeholder="Пароль" required />{error && <p className="text-sm text-red-600">{error}</p>}<button className="btn btn-primary w-full">Войти</button></form>;
}
