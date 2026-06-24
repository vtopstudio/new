"use client";

import { useActionState } from "react";
import { uploadResultAction, type UploadResultState } from "../../actions";

const initialState: UploadResultState = { error: null, success: false };

export function ResultUploadForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(uploadResultAction, initialState);

  return (
    <form action={formAction} className="card space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      <h2 className="text-xl font-black">Загрузить результат</h2>
      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">
          Результат загружен и доступен клиенту на странице заказа.
        </div>
      )}
      <input className="input" name="title" placeholder="Название варианта" />
      <textarea className="input" name="description" placeholder="Описание и комментарий клиенту" />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="recommended" /> Рекомендованный вариант (UI-заготовка)
      </label>
      <input className="input" name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />
      <button className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? "Загрузка..." : "Загрузить"}
      </button>
    </form>
  );
}
