"use client";
import { useEffect, useRef, useState } from "react";
import type { ExperiencePhoto } from "@/lib/types";

export default function ExperienceGallery({ photos, title }: { photos: ExperiencePhoto[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useRef(false);
  const interacting = useRef(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { visible.current = entries[0].isIntersecting; }, { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (photos.length < 2 || paused) return;
    const timer = setInterval(() => {
      if (visible.current && !interacting.current && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setIndex(value => (value + 1) % photos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [photos.length, paused]);
  if (!photos.length) return null;
  const active = index % photos.length;
  return <figure ref={root} className="experience-gallery" aria-label={`${title} event photos`} onMouseEnter={() => { interacting.current = true; }} onMouseLeave={() => { interacting.current = false; }} onFocusCapture={() => { interacting.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}>
    <div className="experience-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[active].url} alt={`${title} — event photo ${active + 1}`} width={960} height={600} loading="lazy" />
    </div>
    <figcaption className="experience-gallery-controls"><span>{active + 1} / {photos.length}</span>{photos.length > 1 && <div><button type="button" aria-label={`Previous photo for ${title}`} onClick={() => setIndex((active + photos.length - 1) % photos.length)}>←</button><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Play" : "Pause"}</button><button type="button" aria-label={`Next photo for ${title}`} onClick={() => setIndex((active + 1) % photos.length)}>→</button></div>}</figcaption>
  </figure>;
}
