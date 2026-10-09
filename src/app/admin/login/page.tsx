"use client";
import { useActionState } from "react";
import { signIn } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-100 p-6">
      <form action={formAction} className="w-full max-w-sm bg-white border-2 border-neutral-900 p-8 shadow-[6px_6px_0_#000]">
        <h1 className="font-bold text-2xl mb-1">Admin login</h1>
        <p className="text-sm text-neutral-500 mb-6">Only the owner account can sign in.</p>

        <label className="block text-xs font-semibold mb-1">Email</label>
        <input name="email" type="email" required className="w-full border-2 border-neutral-900 px-3 py-2 mb-4 text-sm" />

        <label className="block text-xs font-semibold mb-1">Password</label>
        <input name="password" type="password" required className="w-full border-2 border-neutral-900 px-3 py-2 mb-4 text-sm" />

        {state?.error && <p className="text-sm text-red-600 mb-4">{state.error}</p>}

        <button disabled={pending} className="w-full bg-neutral-900 text-white py-2 font-semibold text-sm">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
