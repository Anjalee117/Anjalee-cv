# Changelog

A chronological record of what's been built. For current status (done vs. still
open) see `STATUS.md`; for what to do next see `IMPLEMENTATION_PLAN.md`.

## 2026-10-09 — Projects refreshed from updated resume
- Replaced two of three seeded projects with the current resume's versions:
  **Jeevandhara** (AI-powered agriculture dashboard) and **Sign Language Live**
  (webcam-based sign-language recognition, 84.2% test accuracy) now stand in for
  the earlier Smart Tourism / SmartTask Pro entries
- **Sign Language Live** got real tech-stack tags (Python, TensorFlow, MediaPipe)
  — the resume states these explicitly, unlike the other two projects
- Taj Finance unchanged; Education, Experience, Achievements, Skills, and contact
  info all cross-checked against the new resume and matched exactly, no changes
  needed there

## 2026-10-06 — Supabase provisioned
- [x] Supabase project created, `schema.sql` and `seed.sql` run successfully
- Site is now backed by a live database — remaining work is the admin account,
  env vars, filling in links/images, and deploying

## 2026-10-05 — Skills redesign + direct project links
- Added a new `"tags"` section layout: a bordered chip grid (with optional skill
  icons) replacing the old single-paragraph Skills rendering

- Projects now carry two separate, direct links — **Website** (`link_url`) and
  **Repository** (`repo_url`) — each its own button opening in a new tab, instead
  of the whole card being one link

- Admin UI updated: Sections manager got a "Tags" layout option with a
  comma-separated editor; Projects manager got separate Website/Repository URL
  fields

- `supabase/schema.sql` updated with the new `projects.repo_url` column
- Design/behavior reference: Pratham's old prathudev.in site (section structure,
  direct dual links, skills chip grid) — content stayed resume-only throughout,
  per your instruction

## 2026-10-04 — Security hardening pass
- Security response headers added (`next.config.ts`): clickjacking protection,
  MIME-sniffing protection, forced HTTPS, locked-down browser permissions

- Server-side validation added for every admin input (`src/lib/validate.ts`):
  length-capped text, format-checked URLs/emails, shape-checked section JSON

- Image uploads validated server-side: MIME-type allowlist + 5MB cap, enforced in
  the server action itself, not just the file picker

- Added a proper admin error screen instead of a crash page on failure
- New doc: `docs/SECURITY.md` — threat model, what's protected and how, honest
  residual risk

## 2026-10-04 — Real content + documentation suite
- Real resume content seeded: profile, Education, Experience, Achievements,
  Skills, and 3 projects (`supabase/seed.sql`)

- Fixed the hero headline so a multi-line tagline actually renders as line breaks
- Full documentation suite written: `README.md`, `ARCHITECTURE.md`, `DESIGN.md`,
  `DEVELOPMENT.md`, `DEPLOYMENT.md`, `STATUS.md`, `IMPLEMENTATION_PLAN.md`

## 2026-10-04 — Initial build
- Next.js 16 app scaffolded (TypeScript, Tailwind, App Router)
- Supabase schema designed: `profile`, `sections`, `projects` tables, storage
  bucket, row-level security policies

- Public homepage built: renders profile/sections/projects live, no caching, dark
  mode toggle, brutalist theme (Bubblegum pink accent)

- Admin dashboard built: profile editor, sections manager (add/reorder/hide/
  delete), projects manager (same, plus image upload)

- Single-admin auth wired up via Supabase Auth, middleware-protected `/admin/*`

## 2026-10-09

Added explicit admin authorization, repeatable schema setup, database error handling,
PDF resume upload, environment setup guidance, public photo/accent rendering, mobile
and accessibility fixes. Updated Next.js to 16.4.0 and compatible dependency patches.
Verified lint and production webpack build; hosted Supabase checks remain pending.

## Section pages and contact updates

Added dedicated About, Projects, Contact and visible Supabase section pages,
shared header/footer and mobile navigation. Kept existing card and tag styles.
Display name corrected to Anjalee; displayed anjalee@dev.com links to
anjaleemalhotra305@gmail.com via mailto (no mailbox forwarding configured).

## Professional portfolio redesign

Replaced the grid background, heavy borders and offset shadows with a quiet
neutral palette, restrained rose accent, rounded cards and sans-serif body text.
Simplified primary navigation to About, Projects, Experience and Contact.
Reordered the homepage to introduction, projects, experience, skills, education
and achievements; removed duplicated biography and repeated button blocks.
Added project identity panels for missing screenshots, consistent section headings
and a compact contact footer. Existing Supabase content and admin editing remain.

## Theme restoration and smoother navigation

Restored the original pink palette, grid texture, monospace body, square borders
and offset shadows. Kept cleaner section organization and simplified navigation;
replaced decorative section headlines with explicit section names. Cached anonymous
public Supabase reads for 60 seconds with immediate cache expiration on admin
mutations, and added a route loading state. Local preview uses a production build
to avoid development compilation delays.

## Admin profile save repair

Diagnosed repeated LinkedIn URL validation failures in server logs. Normalize
scheme-less website URLs to HTTPS, reject invalid protocols and malformed input,
and show validation errors inline without replacing the profile form. Added pending
and saved states. URL validation checks, lint, and production build verified.
