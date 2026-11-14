"use client";

import { useActionState } from "react";
import { login } from "@/lib/admin-actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="grid gap-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy">
          Лозинка
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-xl border-[1.5px] border-line px-4 py-3 outline-none focus:border-navy focus:ring-3 focus:ring-leaf/35"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary justify-center">
        {pending ? "Се најавува…" : "Најави се"}
      </button>
    </form>
  );
}
