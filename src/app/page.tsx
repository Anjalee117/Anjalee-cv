import type { CSSProperties } from "react";
import SetupNotice from "@/components/SetupNotice";
import { getSupabaseConfig } from "@/lib/supabase/config";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/portfolio/Shell";
import { SectionContent, ProjectContent } from "@/components/portfolio/Content";
import { getPortfolio, sectionSlug, displayName } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!getSupabaseConfig()) return <SetupNotice />;
  const { profile: p, sections, projects } = await getPortfolio();
  const experience = sections.find(s => s.title.toLowerCase() === "experience");
  const remaining = sections.filter(s => s !== experience).sort((a, b) => {
    const order = ["skills", "education", "achievements"];
    const rank = (title: string) => { const i = order.indexOf(title.toLowerCase()); return i < 0 ? 99 : i; };
    return rank(a.title) - rank(b.title);
  });
  return <div className="wrap" style={{ "--accent": p.accent_color } as CSSProperties}>
    <a className="skip-link" href="#intro">Skip to content</a>
    <SiteHeader sections={sections} />
    <main>
      <section id="intro" className="hero-section">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">PRODUCT THINKING. HUMAN IMPACT.</p>
            <h1 className="hero-title">Hi, I&apos;m <span>{displayName(p.name)}.</span><br />I turn ideas into<br />useful experiences.</h1>
            <p className="hero-description">{p.bio ? p.bio.split(/(?<=\.)\s+/).slice(0, 2).join(" ") : "Aspiring product manager and web developer, combining technical understanding with a focus on people."}</p>
            <div className="hero-roles">{p.roles.map(role => <span key={role}>{role}</span>)}</div>
            <div className="hero-actions">
              <a className="btn primary" href="#work">Explore my work <span aria-hidden>↗</span></a>
              {p.resume_url ? <a className="btn" href={p.resume_url} target="_blank" rel="noopener noreferrer">Download resume ↓</a> : <Link className="btn" href="/about">More about me →</Link>}
            </div>
            <a className="hero-email" href="mailto:anjaleemalhotra305@gmail.com">anjalee@dev.com <span aria-hidden>↗</span></a>
          </div>
          <figure className="hero-portrait">
            <div className="portrait-frame">
              {p.profile_pic_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.profile_pic_url} alt={`Portrait of ${displayName(p.name)}`} width={480} height={600} fetchPriority="high" />
              ) : <div className="portrait-placeholder"><span className="font-display">A</span></div>}
            </div>
            <figcaption><span className="portrait-dot" />Product mindset. Builder at heart.</figcaption>
          </figure>
        </div>
      </section>
      <section id="work" className="portfolio-section">
        <div className="section-heading"><div><p className="eyebrow">SELECTED WORK</p><h2>Selected projects</h2></div><Link className="text-link" href="/projects">All projects ↗</Link></div>
        <ProjectContent projects={projects} />
      </section>
      {experience && <section id="experience" className="portfolio-section"><div className="section-heading"><div><p className="eyebrow">EXPERIENCE</p><h2>Experience & leadership</h2></div><Link className="text-link" href="/experience">Full experience ↗</Link></div><SectionContent section={experience} /></section>}
      {remaining.map(s => <section id={sectionSlug(s.title)} key={s.id} className="portfolio-section"><div className="section-heading"><div><p className="eyebrow">{s.title.toUpperCase()}</p><h2>{s.title}</h2></div><Link className="text-link" href={`/${sectionSlug(s.title)}`}>Explore {s.title.toLowerCase()} ↗</Link></div><SectionContent section={s} /></section>)}
    </main>
    <SiteFooter profile={p} sections={sections} />
  </div>;
}
