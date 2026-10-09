"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExperienceDetails } from "@/app/admin/actions";
export default function AddExperienceForm({ sectionId }: { sectionId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function add(data: FormData) {
    setBusy(true);
    try { const result = await addExperienceDetails(sectionId, data); setMessage(result.error ?? "Experience added. Add photos in its card below."); }
    catch { setMessage("Could not add experience. Please try again."); }
    finally { setBusy(false); router.refresh(); }
  }
  return <details className="border border-neutral-300 p-4"><summary className="text-sm font-semibold cursor-pointer">Add an experience</summary><form action={add} className="space-y-3 mt-4"><fieldset disabled={busy} className="space-y-3">
    <label className="block text-xs">Title<input name="title" required maxLength={120} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1" /></label>
    <label className="block text-xs">Dates / role label<input name="tag" maxLength={60} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1" /></label>
    <label className="block text-xs">Description<textarea name="body" maxLength={2000} rows={3} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1" /></label>
    <button className="bg-neutral-900 text-white px-3 py-2 text-xs">{busy ? "Adding…" : "Add experience"}</button>
  </fieldset><p aria-live="polite" className="text-xs">{message}</p></form></details>;
}
