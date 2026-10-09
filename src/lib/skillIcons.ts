// Maps a skill's display name to a skillicons.dev slug, so the Tags/Skills
// section can show a small icon next to the label. Unmapped names just render
// as a text-only chip — this is a nice-to-have, not a requirement, so an
// unrecognized skill name never breaks anything.
const ICONS: Record<string, string> = {
  "c": "c", "c++": "cpp", "c/c++": "cpp", "java": "java", "python": "py",
  "javascript": "js", "typescript": "ts", "html": "html", "html5": "html",
  "css": "css", "css3": "css", "react": "react", "react.js": "react",
  "next.js": "nextjs", "nextjs": "nextjs", "node.js": "nodejs", "nodejs": "nodejs",
  "tailwind": "tailwind", "astro": "astro", "vercel": "vercel", "git": "git",
  "github": "github", "linux": "linux", "docker": "docker", "figma": "figma",
  "postgresql": "postgres", "postgres": "postgres", "mysql": "mysql",
  "mongodb": "mongodb", "sql": "mysql", "tensorflow": "tensorflow",
  "opencv": "opencv", "ai/ml": "pytorch", "machine learning": "pytorch",
  "generative ai": "pytorch", "ml": "pytorch",
};

export function skillIconUrl(name: string): string | null {
  const slug = ICONS[name.trim().toLowerCase()];
  return slug ? `https://skillicons.dev/icons?i=${slug}` : null;
}
