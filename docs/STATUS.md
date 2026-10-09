# Status

Last updated: 2026-10-09. Update this file's "Done" / "Open" lists as you work
through `IMPLEMENTATION_PLAN.md` — it's meant to stay a true snapshot, not a
one-time record.

## Done

- [x] Next.js 16 app scaffolded (TypeScript, Tailwind, App Router) — builds and
      type-checks clean
- [x] Supabase schema designed and written (`supabase/schema.sql`) — profile,
      sections, projects tables, storage bucket, row-level security policies
- [x] Public homepage built — renders profile, sections, and projects live from
      Supabase, dark mode toggle, brutalist theme (Sky blue accent)
- [x] Admin dashboard built — profile editor, sections manager (add/reorder/hide/
      delete, text or cards layout), projects manager (same, plus image upload)
- [x] Auth wired up — single-admin login via Supabase Auth, middleware-protected
      `/admin/*` routes
- [x] Real content seeded from resume (`supabase/seed.sql`) — education,
      experience, achievements, skills, and 3 projects
- [x] Documentation written: `README.md`, `ARCHITECTURE.md`, `DESIGN.md`,
      `DEVELOPMENT.md`, `DEPLOYMENT.md`, `SECURITY.md`, this file, and
      `IMPLEMENTATION_PLAN.md`
- [x] Security hardening pass: security response headers (`next.config.ts`),
      server-side validation on every admin input (`src/lib/validate.ts`),
      server-side file-type/size checks on every upload, a friendly admin error
      boundary instead of a crash screen — see `docs/SECURITY.md` for the full
      threat model

## 2026-10-05 update: skills redesign + direct project links

Pratham's old portfolio (prathudev.in) was used as a **design/behavior
reference** for this update — its section structure (direct dual links per
project, a Skills chip grid) shaped what got built below. All actual data still
comes from your resume alone.

- [x] Added a new `"tags"` section layout — a bordered chip grid (with optional
      skill icons) replacing the old single-paragraph Skills rendering
- [x] Projects now carry two separate, direct links — **Website** (`link_url`) and
      **Repository** (`repo_url`) — each its own button opening in a new tab,
      instead of the whole card being one link
- [x] Admin UI updated: Sections manager has a "Tags" layout option with a
      comma-separated editor; Projects manager has separate Website/Repository
      URL fields
- [x] `supabase/schema.sql` updated with the new `projects.repo_url` column (safe
      `alter table ... add column if not exists` noted at the top of the file for
      anyone who already ran an earlier version against a live project)
- [x] Seed data refreshed: Skills now seeds as `tags` (same resume skill list,
      just restyled). Project Website/Repository links are intentionally left
      blank — your resume didn't list URLs for any project — add the real ones
      via `/admin/projects` whenever you have them

## Open

- [x] User created the hosted Supabase project `Anjalee-portfolio`
- [x] Hosted schema and seed verified through public API: one profile, four sections, three projects
- [ ] No admin account created
- [x] `.env.local` configured with hosted project URL and anon key
- [ ] Real LinkedIn URL unconfirmed
- [ ] GitHub URL unconfirmed
- [ ] No profile picture uploaded
- [ ] No resume PDF linked
- [ ] No project images uploaded, and no Website/Repository links added (all 3
      projects are text-only right now — your resume didn't list URLs for them)
- [ ] Not deployed — no live URL yet
- [ ] No custom domain, favicon, or OG image

## Known content caveats

- Seeded content was parsed from a resume PDF — worth a read-through for accuracy
  before going live, especially bullet phrasing that was condensed to fit the card
  format.
- Dates across the two portfolios (yours and Pratham's) were cross-checked where
  the same event appears on both resumes (e.g. the SIH 2026 win) and aligned to
  match — double check nothing else drifts if either resume gets updated later.

## 2026-10-09 implementation checks

- Explicit admin allowlist and matching Auth checks added; schema can be reapplied.
- Database failures now surface in the admin UI; public failures show a retry page.
- Profile photo/accent now render; About anchor, mobile forms, reduced motion,
  theme persistence and favicon improved.
- Added PDF resume upload and raised Server Action limit for 5MB files.
- Missing credentials show setup instructions rather than crashing.
- Next.js updated to 16.4.0; compatible dependency security fixes applied.
- ESLint and webpack production build passed. Hosted Auth/Storage/RLS remain
  unverified until credentials and database setup are supplied.
- Five audit findings remain in the development-only ESLint glob dependency chain;
  npm's proposed automatic fix downgrades eslint-config-next to Next 14.

## Hosted connection verification

Connected to `zjcdweulpyyfvquurytj`. Public reads and anonymous admin rejection
verified. Local server runs at http://127.0.0.1:3000. Admin login and uploads
still need an authenticated browser check.
