"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExperiencePhoto, removeExperiencePhoto, saveExperienceDetails } from "@/app/admin/actions";
import type { SectionItem } from "@/lib/types";

export default function ExperiencePhotoEditor({ sectionId, index, item }: { sectionId: string; index: number; item: SectionItem }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function save(data: FormData) {
    setBusy(true);
    try { const result = await saveExperienceDetails(sectionId, index, item.title, data); setMessage(result.error ?? "Experience details saved."); }
    catch { setMessage("Could not save details. Please refresh and try again."); }
    finally { setBusy(false); router.refresh(); }
  }
  async function upload(data: FormData) {
    const files = data.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
    if (!files.length) return;
    if (files.length + (item.photos?.length ?? 0) > 12) { setMessage("Maximum 12 photos per experience."); return; }
    if (files.some(file => file.size > 5 * 1024 * 1024)) { setMessage("Each photo must be under 5MB."); return; }
    setBusy(true);
    let uploaded = 0;
    try {
      for (const file of files) {
        setMessage(`Uploading ${uploaded + 1} of ${files.length}…`);
        const form = new FormData(); form.set("file", file);
        const result = await addExperiencePhoto(sectionId, index, item.title, form);
        if (result.error) { setMessage(`${uploaded} uploaded. ${result.error}`); return; }
        uploaded++;
      }
      setMessage(`${uploaded} photos added. They appear only on Full Experience.`);
    } catch { setMessage("Upload could not finish. Refresh to see any saved photos, then retry."); }
    finally { setBusy(false); router.refresh(); }
  }
  async function remove(path: string) {
    setBusy(true);
    try { const result = await removeExperiencePhoto(sectionId, index, item.title, path); setMessage(result.error ?? "Photo removed."); }
    catch { setMessage("Could not remove photo. Please try again."); }
    finally { setBusy(false); router.refresh(); }
  }
  return <div className="border border-neutral-300 p-4 space-y-3">
    <h3 className="font-semibold text-sm">{item.title}</h3>
    <form action={save} className="space-y-3">
      <fieldset disabled={busy} className="space-y-3">
        <label className="block text-xs font-semibold">Experience / event title<input name="title" required maxLength={120} defaultValue={item.title} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1 font-normal" /></label>
        <label className="block text-xs font-semibold">Dates / role label<input name="tag" maxLength={60} defaultValue={item.tag ?? ""} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1 font-normal" /></label>
        <label className="block text-xs font-semibold">Description<textarea name="body" maxLength={2000} rows={4} defaultValue={item.body} className="block w-full border border-neutral-900 px-3 py-2 text-sm mt-1 font-normal" /></label>
        <button className="bg-neutral-900 text-white px-3 py-2 text-xs disabled:opacity-50">{busy ? "Working…" : "Save experience"}</button>
      </fieldset>
    </form>
    <div className="border-t border-neutral-300 pt-3"><h4 className="text-xs font-semibold">Photos for this experience</h4></div>
    <div className="flex flex-wrap gap-3">{(item.photos ?? []).map((photo, i) => <div key={photo.path}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={`${item.title} photo ${i + 1}`} width={120} height={80} className="h-20 w-30 object-cover border" />
      <button type="button" disabled={busy} onClick={() => remove(photo.path)} className="text-xs text-red-700 mt-1">Remove photo {i + 1}</button>
    </div>)}</div>
    <form action={upload} className="flex flex-wrap gap-3 items-center"><input aria-label={`Photos for ${item.title}`} type="file" name="photos" multiple required accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} className="text-xs max-w-full" /><button disabled={busy} className="bg-neutral-900 text-white px-3 py-2 text-xs disabled:opacity-50">{busy ? "Working…" : "Add event photos"}</button></form>
    <p className="text-xs text-neutral-500">Up to 12 photos; 5MB per photo. Photos rotate automatically on the Full Experience page.</p>
    <p aria-live="polite" className="text-xs">{message}</p>
  </div>;
}
