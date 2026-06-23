"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="btn btn-secondary py-2"
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Выйти
    </button>
  );
}
