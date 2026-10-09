import type { Project } from "@/lib/types";
// Verified against the public projects' package manifests.
const defaults: Record<string, string[]> = {
  "taj finance": ["React", "JavaScript", "Vite", "Tailwind CSS", "Recharts"],
  "jeevandhara": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
};
export function projectTechStack(project: Pick<Project, "title" | "tech_stack">): string[] {
  return project.tech_stack?.length ? project.tech_stack : defaults[project.title.trim().toLowerCase()] ?? [];
}
