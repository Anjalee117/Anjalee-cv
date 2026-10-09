import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio, sectionSlug, displayName } from "@/lib/portfolio";
import { SiteHeader } from "@/components/portfolio/Shell";
import { SectionContent, ProjectContent } from "@/components/portfolio/Content";
import SetupNotice from "@/components/SetupNotice";
import { getSupabaseConfig } from "@/lib/supabase/config";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ section: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: `${section.charAt(0).toUpperCase() + section.slice(1)} — Anjalee` };
}
export default async function SectionPage({ params }: Props) {
  if (!getSupabaseConfig()) return <SetupNotice />;
  const { section: slug } = await params;
  const { profile, sections, projects } = await getPortfolio();
  const section = sections.find(s => sectionSlug(s.title) === slug);
  if (!section && !["about", "projects", "contact"].includes(slug)) notFound();
  const title = section?.title ?? ({ about: "About me", projects: "Projects", contact: "Let's talk." }[slug]);
  return <div className="wrap" style={{ "--accent": profile.accent_color } as CSSProperties}>
    <a className="skip-link" href="#content">Skip to content</a>
    <SiteHeader sections={sections} />
    <main id="content" className="portfolio-section" style={{ borderColor: "var(--border)", minHeight: "55vh" }}>
      <Link href="/" className="text-xs">← BACK HOME</Link>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-6 mb-10">{title}<span style={{ color: "var(--accent)" }}>.</span></h1>
      {section && <SectionContent section={section} showExperiencePhotos={slug === "experience"} />}
      {slug === "projects" && <ProjectContent projects={projects} />}
      {slug === "about" && <div className="hero-layout"><div><h2 className="font-display text-2xl mb-5">{displayName(profile.name)}</h2><p style={{ color: "var(--muted)" }}>{profile.bio}</p><div className="flex flex-wrap gap-2 mt-6">{profile.roles.map(role => <span key={role} className="tag">{role}</span>)}</div></div>{profile.profile_pic_url && <div className="portrait-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.profile_pic_url} alt={displayName(profile.name)} width={480} height={600} />
      </div>}</div>}
      {slug === "contact" && <div className="box max-w-xl"><p className="mb-6">Have a project or collaboration in mind? Send me a message.</p><a className="btn primary" href="mailto:anjaleemalhotra305@gmail.com">anjalee@dev.com ↗</a></div>}
    </main>
  </div>;
}
