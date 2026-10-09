"use client";
import { useActionState } from "react";
type State = { error?: string; success?: string };
export default function UploadForm({ action, accept, label }: {
  action: (state: State, data: FormData) => Promise<State>; accept: string; label: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="space-y-3">
    <div className="flex flex-wrap gap-3 items-center"><input type="file" name="file" accept={accept} required aria-label={label} className="text-sm max-w-full" /><button disabled={pending} className="bg-neutral-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60">{pending ? "Uploading…" : label}</button></div>
    <p className="text-xs text-neutral-500">Maximum file size: 5MB.</p>
    <div aria-live="polite">{state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}{state.success && <p className="text-sm text-green-800">{state.success}</p>}</div>
  </form>;
}
