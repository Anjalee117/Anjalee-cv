# Development guide

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
npm run build       # production build — run this before every deploy/push
npx tsc --noEmit     # type-check only, faster than a full build
npm run lint          # ESLint
```

You need a `.env.local` (copied from `.env.local.example`) pointing at a real
Supabase project for any of this to render actual content — see
`docs/DEPLOYMENT.md` if you haven't created one yet. Without it, the public page
will fail its Supabase queries at request time (you'll see this in the terminal
running `next dev`, not as a build error).

## Where things live

See the tree in the root `README.md`. The short version: **`src/app/admin/actions.ts`**
is the one file that touches the database for writes; **`src/app/page.tsx`** is the
one file that reads it for the public site. Almost everything you'll want to change
touches one of those two.

## Common extension tasks

### Add a new field to the profile (e.g. a "location" field)

1. `supabase/schema.sql`: add the column, e.g. `alter table profile add column location text;`
   Run that single line in the Supabase SQL Editor (don't re-run the whole file —
   see "Changing the schema after launch" below).
2. `src/lib/types.ts`: add `location: string | null;` to the `Profile` type.
3. `src/app/admin/page.tsx`: add an `<input name="location" defaultValue={p?.location ?? ""} />` to the form.
4. `src/app/admin/actions.ts`: add `location: formData.get("location"),` to the `updateProfile` update call.
5. `src/app/page.tsx`: render `{p?.location}` wherever you want it to show up.

### Add a new section layout (beyond text / two-col / cards)

1. `src/lib/types.ts`: widen `SectionLayout` to include your new value, and extend
   `Section["content"]` if it needs a new shape.
2. `src/app/admin/actions.ts` (`updateSection`): add a branch for how the new layout's
   `content` should be built from the submitted form fields.
3. `src/app/admin/sections/page.tsx`: add the option to the `<select name="layout">`,
   and, if it needs more than a JSON textarea, a dedicated form for it.
4. `src/app/page.tsx`: add a render branch for `s.layout === "your-new-layout"`.

### Add an entirely new admin-managed collection (e.g. "Testimonials")

This is the same pattern as `projects`, just copied:
1. Add a table to `supabase/schema.sql` (columns + RLS policies, mirroring `projects`).
2. Add a type to `src/lib/types.ts`.
3. Add CRUD server actions to `src/app/admin/actions.ts` (copy the `*Project` actions).
4. Add `src/app/admin/testimonials/page.tsx` (copy `projects/page.tsx`), and a link to
   it in `src/app/admin/layout.tsx`.
5. Fetch and render it in `src/app/page.tsx`.

### Changing the schema after launch

`supabase/schema.sql` is written to be safe to re-run (`create table if not exists`,
`on conflict do nothing`), but re-running it will **not** apply column changes to a
table that already exists. Once you're live, make schema changes as individual
`alter table ...` statements run directly in the SQL Editor, and keep a copy of each
one — either appended to `schema.sql` under a comment like `-- added 2026-10-01:
location field`, or as separate numbered files in `supabase/migrations/` if the
project grows. This project doesn't use a migration tool (Prisma/Drizzle-style) by
design, to keep it simple for a single-admin site — worth introducing one if you
outgrow hand-written SQL.

## Conventions

- **Types first**: `src/lib/types.ts` is the single source of truth for the shape of
  `profile`/`sections`/`projects`. Update it whenever the schema changes.
- **Server Actions live in `actions.ts` files**, not inline in page components — keeps
  data-mutation logic in one place per route group.
- **`revalidatePath("/")` after every mutation** that could affect the public site, so
  an admin edit is reflected without a manual refresh (the public page is already
  `force-dynamic`, so this is mostly redundant belt-and-suspenders, but keep the
  pattern for consistency when adding new actions).
- **No client-side data fetching** on the public site — everything is fetched once,
  server-side, in `page.tsx`. If you add an interactive piece that needs live data
  without a full page reload, that's the first place you'd reach for a client
  component with its own `fetch`/Supabase browser client (`lib/supabase/client.ts`).
