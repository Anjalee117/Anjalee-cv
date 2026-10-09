# Anjalee — Portfolio

A brutalist personal portfolio with a live-editable admin dashboard. Every piece of
content — profile, sections, projects, images — is stored in Supabase and rendered
fresh on every request, so changes made in `/admin` appear on the production URL
immediately, with no redeploy.

**Live areas:**
- `/` — the public portfolio
- `/admin` — password-protected dashboard (only you can sign in)

## Features

- **Full content control**: edit name, tagline, bio, role tags, contact links, resume
  link, and accent color from the browser
- **Profile & project image uploads**, stored in Supabase Storage
- **Add / remove / reorder / hide sections** — not fixed to a template; you can add
  a brand-new section (e.g. "Experience", "Awards") at any time
- **Add / remove / reorder / hide projects**, each with its own image, description,
  tech-stack tags, and external link
- **Dark mode toggle**, persisted per visitor
- Brutalist visual language: hard borders, offset shadows, dotted/grid background,
  monospace + display type pairing

## Tech stack

| Layer          | Choice                                   | Why |
|----------------|-------------------------------------------|-----|
| Framework      | Next.js 16 (App Router, TypeScript)       | Server Components fetch content directly, no separate API layer needed |
| Styling        | Tailwind (admin UI) + hand-written CSS custom properties (public site) | Public site needed exact brutalist control; admin just needed to be fast to build |
| Data + Auth + File storage | Supabase (Postgres, Auth, Storage) | One free-tier service covers all three, with row-level security built in |
| Hosting        | Vercel                                    | Native Next.js support, free tier, git-push deploys |

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin` to sign in.

**First time setting this up?** Follow [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) —
it walks through creating the Supabase project, running the schema, creating your
admin login, and deploying to Vercel.

## Documentation

- [`docs/DESIGN.md`](docs/DESIGN.md) — the product/visual design: brutalist language, color tokens, section order and why, content-model-to-layout mapping
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the system is put together: data model, request flow, auth/security model
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — running it locally, coding conventions, and how to extend it (new section types, new admin fields, new features)
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — first-time setup and shipping to production
- [`docs/SECURITY.md`](docs/SECURITY.md) — threat model: what's protected against, how, and the honest residual risk
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — the ordered checklist of what's left to do to go live (hand this to yourself, a collaborator, or an AI assistant)
- [`docs/STATUS.md`](docs/STATUS.md) — a living snapshot of what's done vs. still open
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — a dated, chronological record of every change made

## Project structure

```
src/
  app/
    page.tsx              # public homepage (Server Component, fetches live content)
    layout.tsx             # root layout, fonts, theme bootstrap script
    globals.css            # design tokens (CSS variables) + brutalist primitives
    admin/
      layout.tsx            # admin shell (nav + sign out)
      page.tsx              # profile editor
      actions.ts             # all server actions (profile/sections/projects/media)
      login/
        page.tsx              # login form
        actions.ts             # sign-in server action
      sections/page.tsx      # sections manager
      projects/page.tsx      # projects manager
  components/
    ThemeToggle.tsx         # dark mode toggle (client component)
  lib/
    supabase/
      client.ts              # browser Supabase client
      server.ts               # server Supabase client (Server Components/Actions)
      middleware.ts            # session refresh + route protection logic
    types.ts                # shared TypeScript types for the content model
  middleware.ts             # Next.js entry point wiring up the above
supabase/
  schema.sql               # tables, storage bucket, and RLS policies — run once
```
