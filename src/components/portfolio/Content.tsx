import ExperienceGallery from "@/components/ExperienceGallery";
import { projectTechStack } from "@/lib/projectStacks";
import { skillIconUrl } from "@/lib/skillIcons";
import type { Section, Project } from "@/lib/types";

export function SectionContent({ section: s, showExperiencePhotos = false }: { section: Section; showExperiencePhotos?: boolean }) {
  if (s.layout === "text") return <p className="section-body">{s.content.body}</p>;
  if (s.layout === "tags") return <div className="skills-grid">{(s.content.tags ?? []).map((tag, i) => {
    const icon = skillIconUrl(tag);
    return <span key={`${tag}-${i}`} className="skill-chip">{icon && (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt="" width={20} height={20} loading="lazy" />
    )}{tag}</span>;
  })}</div>;
  return <div className={`content-grid ${s.title.toLowerCase() === "experience" ? "experience-grid" : ""}`}>{(s.content.items ?? []).map((item, i) => <article className="content-card" key={i}>
    {item.tag && <p className="card-meta">{item.tag}</p>}
    <h3>{item.title}</h3><p>{item.body}</p>
    {showExperiencePhotos && item.photos?.length ? <ExperienceGallery photos={item.photos} title={item.title} /> : null}
  </article>)}</div>;
}

export function ProjectContent({ projects }: { projects: Project[] }) {
  return <div className="project-grid">{projects.map((project, i) => <article key={project.id} className={`project-card ${project.link_url ? "project-card-linked" : ""}`}>
    {project.link_url && <a className="project-card-destination" href={project.link_url} aria-label={`Open ${project.title}`} />}
    <div className={`project-visual project-tone-${i % 3}`}>
      {project.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image_url} alt={project.title} loading="lazy" />
      ) : <><span className="project-index">PROJECT {String(i + 1).padStart(2, "0")}</span><svg className="project-placeholder-icon" viewBox="0 0 64 48" width="80" height="60" fill="none" aria-hidden="true"><rect x="2" y="2" width="60" height="44" rx="3" stroke="currentColor" strokeWidth="2"/><circle cx="44" cy="14" r="5" stroke="currentColor" strokeWidth="2"/><path d="M3 39 20 22l13 13 8-8 21 18" stroke="currentColor" strokeWidth="2"/></svg><span className="project-visual-title">{project.title}</span></>}
    </div>
    <div className="project-info"><h3>{project.title}</h3><p>{project.description}</p>
      <div className="project-tags">{projectTechStack(project).map(tech => <span key={tech}>{tech}</span>)}</div>
      {(project.link_url || project.repo_url) && <div className="project-links">{project.link_url && <a href={project.link_url}>Open project ↗</a>}{project.repo_url && <a href={project.repo_url} target="_blank" rel="noopener noreferrer">Source code ↗</a>}</div>}
    </div>
  </article>)}</div>;
}
