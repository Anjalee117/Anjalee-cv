# Deployment guide

## 1. Create a Supabase project (free tier)
1. Go to https://supabase.com → New project.
2. Pick any name/region, set a database password (save it somewhere), wait ~2 min for it to provision.

## 2. Run the schema
1. In your new project, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` from this folder and click **Run**.
   This creates the `profile`, `sections`, `projects` tables, the `media` storage bucket, and all the
   row-level-security policies (public can read, only an approved admin can write).

## 2b. Load your real content (optional but recommended)
Paste the contents of `supabase/seed.sql` into a new SQL Editor query and run it.
This fills in your actual profile, education, experience, achievements, skills, and
projects from your resume, so `/admin` starts populated instead of empty. Everything
it adds can be edited or deleted from `/admin` afterward — it's just a starting point.
Note: the LinkedIn/GitHub fields are left blank in the seed — your resume's text for
those read like placeholders, not real links, so add the actual ones from `/admin`.

## 3. Create your admin login
1. Go to **Authentication → Users → Add user**.
2. Enter your email and a password. Leave "Auto confirm user" checked.
3. Copy the new user's UUID, then run in SQL Editor:
   ```sql
   insert into public.portfolio_admins (user_id)
   values ('PASTE-YOUR-AUTH-USER-UUID')
   on conflict do nothing;
   ```
4. Disable new user signups in Authentication settings. Only UUIDs listed in
   `portfolio_admins` have admin access, even if another Auth user exists.

## 4. Get your API keys
1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **publishable key** (or legacy anon key).
3. Copy `.env.local.example` to `.env.local` and paste both values in.

## 5. Run it locally
```
npm install
npm run dev
```
Visit http://localhost:3000 for the public site, and http://localhost:3000/admin to sign in
and start editing. Everything you save writes straight to Supabase.

## 6. Deploy to Vercel (free tier)
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → New Project → import that repo.
3. Under **Environment Variables**, add the same two variables from your `.env.local`.
4. Deploy. You'll get a live `*.vercel.app` URL — every save in `/admin` updates that URL immediately,
   no redeploy needed.
5. (Optional) Add a custom domain later under the Vercel project's **Settings → Domains**.

## Notes
- Uploading a profile picture or project image goes straight into the Supabase `media` bucket and is
  public immediately.
- Adding a new section: for "Text" you just type a paragraph. For "Two column" or "Cards" layouts you
  edit a small JSON list, e.g.:
  ```json
  [{ "title": "Product Management", "body": "...", "tag": "optional label" }]
  ```
## Redeploying after a code change

Content edits (`/admin`) never need a redeploy — only push to GitHub when you've
changed actual code (a new section layout, a new admin field, etc.). Vercel redeploys
automatically on every push to your default branch.

## Rolling back

Every deploy in Vercel's dashboard (**Deployments** tab) can be "promoted to
production" individually — if a code change breaks something, roll back to the
previous deployment there while you fix it locally. This doesn't affect your
Supabase data, since content lives in the database, not in the deployed code.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Public site shows empty sections/hero | `.env.local` (or Vercel env vars) missing/wrong, or `schema.sql` wasn't run |
| Can't sign in to `/admin` | No user created yet (step 3), or wrong email/password |
| Image upload fails | `media` bucket wasn't created, or the "public bucket" checkbox wasn't set |
| Changes in `/admin` don't appear on the live site | Confirm the deployed env vars point at the *same* Supabase project you're editing in |
