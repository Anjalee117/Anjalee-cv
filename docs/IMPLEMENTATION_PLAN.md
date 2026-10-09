# Implementation plan

Everything below is what's left between "code on disk" and "live site you can edit
from your phone." It's ordered — each step assumes the ones above it are done. This
is written so it can be handed to another developer, or to an AI coding assistant
(e.g. "follow docs/IMPLEMENTATION_PLAN.md and do steps 1–6"), not just read by you.

For *why* things are built this way, see `ARCHITECTURE.md` and `DESIGN.md`. This
file is only the *what to do next*.

---

### 1. Provision the database
- [x] Create a free Supabase project at supabase.com
- [ ] In **SQL Editor**, run `supabase/schema.sql` once (creates tables, storage
      bucket, RLS policies)

- [ ] In the same editor, run `supabase/seed.sql` once (loads real resume content —
      optional, but skips starting from an empty admin panel)

### 2. Create the one admin account
- [ ] **Authentication → Users → Add user** — your email + a **strong, unique**
      password (this is the single most important security decision in the whole
      project — see `docs/SECURITY.md`), "Auto confirm user" checked

- [ ] There is no sign-up page anywhere in the app; this is the only way an account
      gets created, by design

### 3. Wire up environment variables
- [ ] **Project Settings → API** → copy the Project URL and anon/public key
- [ ] Copy `.env.local.example` → `.env.local`, paste both values in
- [ ] `npm install && npm run dev` — confirm `localhost:3000` renders your seeded
      content, and `localhost:3000/admin` lets you sign in

### 4. Fill in what the seed couldn't know
These are things only you have, not guessable from the resume text:

- [ ] Real **LinkedIn URL** (confirm it's correct — the resume PDF text for this
      field may have been abbreviated or a placeholder; double check before publishing)

- [ ] Real **GitHub URL** (same check)
- [ ] **Profile picture** — upload via `/admin` (Profile picture section)
- [ ] **Resume PDF** — host it somewhere (Google Drive share link, GitHub, or
      use the dedicated Resume PDF upload in `/admin`), then paste the link into the "Resume URL" field in `/admin`

- [ ] **Project images, Website links, and Repository links** — none of the 3
      seeded projects have these (your resume listed outcomes, not URLs or
      screenshots) — add them per project via `/admin/projects`

- [ ] Re-read every seeded section once in `/admin` — the content came from a resume
      PDF parse and is a strong first draft, not guaranteed word-perfect

### 5. Deploy
- [ ] Push this folder to a new GitHub repo (`git init && git add . && git commit -m
      "initial commit" && git remote add origin <repo-url> && git push`)

- [ ] Vercel → New Project → import that repo
- [ ] Add the same two environment variables from `.env.local` to the Vercel project
- [ ] Deploy — you'll get a `*.vercel.app` URL
- [ ] Sign in to `/admin` on the *production* URL and confirm your content shows up
      (it's reading the same Supabase project, so it should match local exactly)

### 6. Optional polish (not required to launch)
- [ ] Custom domain (Vercel → Project → Settings → Domains)
- [ ] Favicon — currently none; add `src/app/icon.png` (Next.js picks it up
      automatically) or `src/app/favicon.ico`

- [ ] Open Graph preview image — add `src/app/opengraph-image.png` so links shared
      on LinkedIn/WhatsApp show a preview card instead of a blank one

- [ ] Analytics (Vercel Analytics is a one-line add if you want visit counts)

---

## Status of each step

See `docs/STATUS.md` for what's already done vs. still open — this plan is the
"how," that file is the "where things currently stand."
