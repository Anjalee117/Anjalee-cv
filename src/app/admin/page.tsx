import UploadForm from "@/components/UploadForm";
import ProfileForm from "@/components/ProfileForm";
import { displayName } from "@/lib/portfolio";
import { createClient } from "@/lib/supabase/server";
import { saveProfilePicture, saveResume } from "./actions";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).single();
  if (error) throw new Error(error.message);
  const p = data as Profile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">Profile</h1>
        <p className="text-sm text-neutral-500">This drives the hero section and footer on the live site.</p>
      </div>

      <section className="bg-white border-2 border-neutral-900 p-6">
        <h2 className="font-semibold mb-3">Profile picture</h2>
        {p?.profile_pic_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profile_pic_url} alt="Profile" className="w-20 h-20 object-cover border-2 border-neutral-900 mb-3" />
        )}
        <UploadForm action={saveProfilePicture} accept="image/jpeg,image/png,image/webp,image/gif" label="Upload photo" />
      </section>

      <section className="bg-white border-2 border-neutral-900 p-6">
        <h2 className="font-semibold mb-3">Resume PDF</h2>
        {p?.resume_url && <a className="underline block mb-3 text-sm" href={p.resume_url} target="_blank" rel="noopener noreferrer">View current resume ↗</a>}
        <UploadForm action={saveResume} accept="application/pdf" label="Upload PDF" />
      </section>

      <ProfileForm>
        <div>
          <label className="block text-xs font-semibold mb-1">Name</label>
          <input name="name" defaultValue={displayName(p?.name)} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Hero tagline (supports line breaks)</label>
          <textarea name="tagline" defaultValue={p?.tagline} rows={3} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Bio (one paragraph, shown under the tagline)</label>
          <textarea name="bio" defaultValue={p?.bio} rows={3} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Role tags (comma separated)</label>
          <input name="roles" defaultValue={p?.roles?.join(", ")} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Email</label>
            <input name="email" defaultValue={p?.email ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Accent color (hex)</label>
            <input name="accent_color" defaultValue={p?.accent_color} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">LinkedIn URL</label>
            <input placeholder="linkedin.com/in/your-name" name="linkedin_url" defaultValue={p?.linkedin_url ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">GitHub URL</label>
            <input placeholder="github.com/your-username" name="github_url" defaultValue={p?.github_url ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Resume URL (upload your PDF anywhere and paste the link)</label>
          <input name="resume_url" defaultValue={p?.resume_url ?? ""} className="w-full border-2 border-neutral-900 px-3 py-2 text-sm" />
        </div>
      </ProfileForm>
    </div>
  );
}
