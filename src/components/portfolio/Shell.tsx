import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { sectionSlug, displayName } from "@/lib/portfolio";
import type { Profile, Section } from "@/lib/types";

function Navigation({ sections }: { sections: Section[] }) {
  const experience = sections.find(s => s.title.toLowerCase() === "experience");
  return <><Link href="/about">About</Link><Link href="/projects">Projects</Link>{experience && <Link href={`/${sectionSlug(experience.title)}`}>Experience</Link>}</>;
}
export function SiteHeader({ sections }: { sections: Section[] }) {
  return <header className="site-header">
    <Link href="/" className="wordmark">Anjalee<span>.</span></Link>
    <nav aria-label="Main navigation" className="desktop-nav"><Navigation sections={sections} /></nav>
    <ThemeToggle />
    <details className="mobile-nav"><summary>Menu +</summary><nav aria-label="Mobile navigation"><Navigation sections={sections} /></nav></details>
  </header>;
}
export function SiteFooter({ profile, sections }: { profile: Profile | null; sections: Section[] }) {
  const hasSocials = Boolean(profile?.linkedin_url || profile?.github_url || profile?.resume_url);
  return <footer id="contact" className="site-footer">
    <div className="footer-main">
      <div className="footer-contact"><p className="eyebrow">CONTACT</p><h2>Let&apos;s connect.</h2><p>For opportunities and collaborations.</p><a className="btn primary" href="mailto:anjaleemalhotra305@gmail.com">anjalee@dev.com ↗</a></div>
      <div className="footer-navigation"><h3>Explore</h3><nav aria-label="Footer navigation"><Navigation sections={sections} />{sections.filter(s => !["experience", "about", "projects", "contact"].includes(s.title.toLowerCase())).map(s => <Link key={s.id} href={`/${sectionSlug(s.title)}`}>{s.title}</Link>)}</nav></div>
      {hasSocials && <div className="footer-socials"><h3>Find me online</h3>{profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}{profile?.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">Resume ↓</a>}</div>}
    </div>
    <div className="footer-bottom">© {new Date().getFullYear()} {displayName(profile?.name)}<a href="#intro">Back to top ↑</a></div>
  </footer>;
}
