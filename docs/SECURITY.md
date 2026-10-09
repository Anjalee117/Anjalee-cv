# Security

You asked for "no bugs, foolproof, no hackers can get in." This doc is the honest
version of that: what's actually protected against, what the stack gives you for
free, and where the real residual risk sits. No internet-facing system is provably
unhackable — the goal here is to close every common attack path for a single-admin
content site and be explicit about the few things that are genuinely out of this
project's control.

## What's protected against, and how

| Threat | Protection | Where |
|---|---|---|
| Public sign-up / extra admin accounts | No sign-up route exists anywhere in the app — accounts are only created manually in the Supabase dashboard | by design |
| Guessing `/admin` without logging in | Middleware checks the session on every `/admin/*` request and redirects to login | `src/lib/supabase/middleware.ts` |
| Database writes without logging in | Row-level security on every table requires `auth.uid() is not null` — even a direct database request can't write without a valid session, independent of the app code | `supabase/schema.sql` |
| Password theft via plaintext storage | Passwords are hashed by Supabase Auth (bcrypt) — the app never sees or stores one | Supabase |
| Session token theft via JS (XSS) | Session cookies are `httpOnly`, set by `@supabase/ssr` — not readable by client-side JavaScript | `src/lib/supabase/{client,server}.ts` |
| Cross-site request forgery (CSRF) on admin actions | Every mutation is a Next.js Server Action, which uses signed, origin-checked action IDs — not a plain form POST a malicious site could replay | built into Next.js |
| Clickjacking (embedding the site in a hidden iframe to hijack clicks) | `X-Frame-Options: DENY` | `next.config.ts` |
| MIME-sniffing attacks | `X-Content-Type-Options: nosniff` | `next.config.ts` |
| Malicious file upload (e.g. uploading an `.html`/script file as an "image") | Server-side MIME type allowlist (JPEG/PNG/WebP/GIF only) and a 5MB size cap, checked on the server regardless of what the browser sent | `src/lib/validate.ts` → `assertValidImage`, used in every upload action |
| Oversized / malformed input corrupting content or the database | Every text field is trimmed and length-capped server-side; the "cards" section JSON is parsed, shape-checked, and capped at 24 items before it's stored | `src/lib/validate.ts`, used throughout `src/app/admin/actions.ts` |
| SQL injection | Not applicable — every query goes through the Supabase client library with parameterized queries; there is no raw SQL built from user input anywhere in the app code | by construction |
| Unencrypted traffic | HTTPS is enforced by Vercel for every deployment, and `Strict-Transport-Security` tells browsers to never downgrade | Vercel + `next.config.ts` |
| Brute-forcing the admin password | Supabase Auth rate-limits sign-in attempts per IP/account automatically | Supabase |

## What you're responsible for (no code can enforce this)

- **A strong, unique password** for the one admin account. This is the single
  highest-value thing you control — everything above assumes that account itself
  isn't trivially guessable.
- **Never commit `.env.local`** or paste your Supabase keys anywhere public. The
  `anon` key is safe to expose (it's meant to be public — RLS is what actually
  protects data), but treat it carefully anyway; never use the Supabase *service
  role* key in this app at all (it isn't used anywhere in this codebase — keep it
  that way).
- **Keep dependencies updated** (`npm outdated`, then `npm update`) every so often.
  As of the last build, `npm audit` reports vulnerabilities only in ESLint's
  dev-time tooling (`eslint-config-next`'s dependency chain) — these run during
  `npm run lint`/local development only and are never bundled into the deployed
  app, but it's still worth running `npm audit` periodically and upgrading when a
  non-breaking fix becomes available, since that changes over time.
- **Review seeded/AI-assisted content before publishing** — not a security issue,
  but a correctness one: see `docs/STATUS.md`'s "known content caveats."

## Honest limits

- **Free-tier Supabase has no automatic point-in-time backups.** If you delete
  something by mistake, there's no "undo." Mitigate this by periodically exporting
  your tables (Supabase → Table Editor → Export, or `supabase db dump`), especially
  before a big content change.
- **This is not a high-traffic / adversarial-grade system.** It's correctly built
  for what it is — a single-admin personal portfolio — but it has not been
  penetration-tested, and nothing here defends against, say, a targeted attacker
  with access to your email account (which could reset your Supabase password
  regardless of anything in this codebase). Use a strong, unique password and
  enable 2FA on your Supabase account and email if you want to raise that bar
  further.
- **"No bugs" isn't a provable property of any software.** What's true instead:
  the app type-checks cleanly, builds cleanly, and every admin input path goes
  through validation rather than trusting the client. If you find a bug, it goes
  in `docs/STATUS.md`'s open list and gets fixed — that's the realistic version of
  "foolproof."

## If you ever suspect you've been compromised

1. Supabase dashboard → **Authentication → Users** → reset your password immediately.
2. **Authentication → Sessions** (or the user's row) → revoke all active sessions.
3. Check **Database → Logs** for unexpected writes around the time in question.
4. Rotate your `NEXT_PUBLIC_SUPABASE_ANON_KEY` only if you suspect the *project*
   itself (not just your account) was exposed — this is rarely necessary since the
   anon key alone can't bypass RLS.
