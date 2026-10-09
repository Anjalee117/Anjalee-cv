"use client";
import { useActionState } from "react";
import { saveProfile } from "@/app/admin/actions";

export default function ProfileForm({ children }: { children: React.ReactNode }) {
  const [state, action, pending] = useActionState(saveProfile, {});
  return <form action={action} className="bg-white border-2 border-neutral-900 p-6 space-y-4">
    {children}
    <div aria-live="polite">{state.error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{state.error}</p>}{state.success && <p className="text-sm text-green-800 bg-green-50 border border-green-200 p-3">{state.success}</p>}</div>
    <button disabled={pending} className="bg-neutral-900 text-white px-5 py-2 text-sm font-semibold disabled:opacity-60">{pending ? "Saving…" : "Save profile"}</button>
  </form>;
}
