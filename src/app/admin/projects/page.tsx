import { projectTechStack } from "@/lib/projectStacks";
import UploadForm from "@/components/UploadForm";
import { createClient } from "@/lib/supabase/server";
import {
  addProject, updateProject, saveProjectImage, toggleProjectVisible, moveProject, deleteProject,
} from "../actions";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").order("position");
  if (error) throw new Error(error.message);
  const projects = (data as Project[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">Projects</h1>
        <p className="text-sm text-neutral-500">Shown as the &quot;Selected work&quot; grid on the live site.</p>
      </div>

      <section className="bg-white border-2 border-neutral-900 p-6">
        <h2 className="font-semibold mb-3">Add a project</h2>
        <form action={addProject} className="space-y-3">
          <input name="title" placeholder="Project title" required className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <textarea name="description" placeholder="One or two sentences on the outcome" rows={2} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <input name="tech_stack" placeholder="Tech stack, comma separated (e.g. Python, ML, A/B testing)" className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <input name="link_url" placeholder="Project destination URL — opens when visitors click the card" className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <input name="repo_url" placeholder="Repository URL — source code (optional)" className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          <button className="bg-neutral-900 text-white px-5 py-2 text-sm font-semibold">Add project</button>
        </form>
      </section>

      {projects.map((proj) => (
        <section key={proj.id} className="bg-white border-2 border-neutral-900 p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-neutral-500">{proj.visible ? "VISIBLE" : "HIDDEN"}</span>
            <div className="flex gap-2 text-sm">
              <form action={moveProject.bind(null, proj.id, "up")}><button>↑</button></form>
              <form action={moveProject.bind(null, proj.id, "down")}><button>↓</button></form>
              <form action={toggleProjectVisible.bind(null, proj.id, !proj.visible)}>
                <button>{proj.visible ? "Hide" : "Show"}</button>
              </form>
              <form action={deleteProject.bind(null, proj.id)}>
                <button className="text-red-600">Delete</button>
              </form>
            </div>
          </div>

          <h2 className="font-semibold">{proj.title} — Project picture</h2>
          <p className="text-xs text-neutral-500">Upload a screenshot or cover image. It appears on the homepage and Projects page. Landscape images work best.</p>
          {proj.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proj.image_url} alt={proj.title} className="w-full h-32 object-cover border-2 border-neutral-900" />
          )}
          <UploadForm action={saveProjectImage.bind(null, proj.id)} accept="image/jpeg,image/png,image/webp,image/gif" label={proj.image_url ? "Replace picture" : "Add project picture"} />

          <form action={updateProject.bind(null, proj.id)} className="space-y-2">
            <input name="title" defaultValue={proj.title} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            <textarea name="description" defaultValue={proj.description} rows={2} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            <input name="tech_stack" defaultValue={projectTechStack(proj).join(", ")} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            <label className="block text-xs font-semibold text-neutral-500">Project destination URL</label>
            <p className="text-xs text-neutral-500">Clicking this project card opens this URL. Leave blank if the project is not live yet.</p>
            <input name="link_url" placeholder="https://your-project.com" defaultValue={proj.link_url ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            <label className="block text-xs font-semibold text-neutral-500">Repository URL</label>
            <input name="repo_url" defaultValue={proj.repo_url ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
            <button className="bg-neutral-900 text-white px-4 py-2 text-sm font-semibold">Save</button>
          </form>
        </section>
      ))}
    </div>
  );
}
