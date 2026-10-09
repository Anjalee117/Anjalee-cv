import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { requireSupabaseConfig } from "@/lib/supabase/config";
import type { Profile, Section, Project } from "@/lib/types";

export function displayName(name?: string | null) {
  return !name || name === "Anjalee Malhotra" ? "Anjalee" : name;
}
export function sectionSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const loadPortfolio = unstable_cache(async () => {
  const { url, key } = requireSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const [profile, sections, projects] = await Promise.all([
    client.from("profile").select("*").eq("id", 1).single(),
    client.from("sections").select("*").eq("visible", true).order("position"),
    client.from("projects").select("*").eq("visible", true).order("position"),
  ]);
  if (profile.error || sections.error || projects.error) throw new Error("Portfolio content could not be loaded.");
  return { profile: profile.data as Profile, sections: sections.data as Section[], projects: projects.data as Project[] };
}, ["public-portfolio-v1"], { tags: ["portfolio"], revalidate: 60 });

export const getPortfolio = cache(loadPortfolio);
