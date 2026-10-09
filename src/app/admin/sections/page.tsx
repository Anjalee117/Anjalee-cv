import AddExperienceForm from "@/components/AddExperienceForm";
import ExperiencePhotoEditor from "@/components/ExperiencePhotoEditor";
import { createClient } from "@/lib/supabase/server";
import {
  addSection, updateSection, toggleSectionVisible, moveSection, deleteSection,
} from "../actions";
import type { Section } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sections").select("*").order("position");
  if (error) throw new Error(error.message);
  const sections = (data as Section[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">Sections</h1>
        <p className="text-sm text-neutral-500">
          &quot;Text&quot; is a single paragraph. &quot;Tags&quot; is a chip grid — good for Skills (comma-separated list, e.g.
          <code className="text-xs bg-neutral-200 px-1">Python, React, Figma</code>). &quot;Two-col&quot; / &quot;Cards&quot; render a
          grid of boxes — edit their content as a small JSON list, e.g.{" "}
          <code className="text-xs bg-neutral-200 px-1">{`[{"title":"Product Management","body":"..."}]`}</code>
        </p>
      </div>

      <section className="bg-white border-2 border-neutral-900 p-6">
        <h2 className="font-semibold mb-3">Add a new section</h2>
        <form action={addSection} className="space-y-3">
          <input name="title" placeholder="Section title (e.g. Experience)" required className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <select name="layout" className="w-full border-2 border-neutral-900 px-3 py-2 text-sm">
            <option value="text">Text (one paragraph)</option>
            <option value="tags">Tags (chip grid — e.g. Skills)</option>
            <option value="two-col">Two column grid</option>
            <option value="cards">Cards grid</option>
          </select>
          <textarea name="body" placeholder="Paragraph text (Text layout) or comma-separated tags (Tags layout) — leave blank for Cards/Two-col, add items after creating" rows={2} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <button className="bg-neutral-900 text-white px-5 py-2 text-sm font-semibold">Add section</button>
        </form>
      </section>

      {sections.map((s) => (
        <section key={s.id} className="bg-white border-2 border-neutral-900 p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-neutral-500">{s.layout.toUpperCase()} · {s.visible ? "VISIBLE" : "HIDDEN"}</span>
            <div className="flex gap-2 text-sm">
              <form action={moveSection.bind(null, s.id, "up")}><button>↑</button></form>
              <form action={moveSection.bind(null, s.id, "down")}><button>↓</button></form>
              <form action={toggleSectionVisible.bind(null, s.id, !s.visible)}>
                <button>{s.visible ? "Hide" : "Show"}</button>
              </form>
              <form action={deleteSection.bind(null, s.id)}>
                <button className="text-red-600">Delete</button>
              </form>
            </div>
          </div>

          <form action={updateSection.bind(null, s.id)} className="space-y-2">
            <input type="hidden" name="layout" value={s.layout} />
            <input name="title" defaultValue={s.title} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            {s.layout === "text" && (
              <textarea name="body" defaultValue={s.content.body} rows={3} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            )}
            {s.layout === "tags" && (
              <input name="tags_text" defaultValue={(s.content.tags ?? []).join(", ")} placeholder="Python, React, Figma, ..." className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            )}
            {(s.layout === "cards" || s.layout === "two-col") && !s.title.toLowerCase().includes("experience") && (
              <textarea key={JSON.stringify(s.content.items)} name="items_json" defaultValue={JSON.stringify(s.content.items ?? [], null, 2)} rows={6} className="w-full border-2 border-neutral-900 px-3 py-2 text-xs font-mono" />
            )}
            <button className="bg-neutral-900 text-white px-4 py-2 text-sm font-semibold">Save</button>
          </form>
          {s.title.toLowerCase().includes("experience") && (s.layout === "cards" || s.layout === "two-col") && <div className="space-y-4 pt-4">
            <h2 className="font-semibold">Experiences</h2>
            <AddExperienceForm sectionId={s.id} />
            {(s.content.items ?? []).map((item, index) => <ExperiencePhotoEditor key={`${item.title}-${index}`} sectionId={s.id} index={index} item={item} />)}
          </div>}
        </section>
      ))}
    </div>
  );
}
