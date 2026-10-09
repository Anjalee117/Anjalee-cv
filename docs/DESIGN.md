# Design

This is the *product* design doc — what the portfolio is meant to say and how it's
laid out. For the *technical* design (data model, request flow), see
[`ARCHITECTURE.md`](ARCHITECTURE.md).

## Visual language: brutalism

- **Hard borders, no soft shadows** — every block is a 2px solid border with a flat,
  offset "hard shadow" (`box-shadow: 6px 6px 0 <accent>` — no blur). Nothing fades;
  edges are exact.
- **Two typefaces, one job each** — Space Grotesk (bold, large) for headings; IBM
  Plex Mono for everything else (nav, body copy, tags, buttons). The mono face is
  what gives the site its "technical/raw" feel rather than reading as a generic
  template.
- **Flat color, one accent** — a single accent color drives tags, the active button,
  and every shadow. No gradients, no multiple competing accent colors.
- **Dotted/grid background** — a faint CSS grid (`48px` lines, 6% opacity) behind
  all content, reinforcing the "blueprint / raw construction" feel without
  distracting from text.
- **Dark mode is a palette swap, not a redesign** — background/foreground/card
  colors flip; the accent color stays the same in both modes so the identity (blue
  for Anjalee, pink for Anjalee) is recognizable either way.

## Color tokens

| Token | Light mode | Dark mode | Used for |
|---|---|---|---|
| `--bg` | white | near-black | page background |
| `--fg` | near-black | off-white | body text, borders, grid lines |
| `--accent` | Bubblegum `#EE8FB5` | same | tags, primary button, shadows |
| `--card` | white | dark gray | section/project boxes |
| `--muted` | dark gray | light gray | secondary text |
| `--on-accent` | deep plum `#3D0E22` | same | text sitting on the accent color |

Changing `--accent` (and `--shadow`, which mirrors it) is the entire re-theme — see
`src/app/globals.css`. The admin's "Accent color" field is a content-level override
on top of this for quick experiments, but a *permanent* palette change belongs in
`globals.css` since that's what ships without depending on the database value.

## Page structure, top to bottom

| Order | Section | Source | Why here |
|---|---|---|---|
| 1 | **Nav** | static | name, section links, dark-mode toggle — always visible context |
| 2 | **Hero** | `profile` table | first impression: who you are, tagline, role tags, primary CTA |
| 3 | **Education** | `sections` (cards) | credibility, fast — a recruiter's first filter |
| 4 | **Experience** | `sections` (cards) | leadership/work history, chronological relevance |
| 5 | **Achievements** | `sections` (cards) | proof points — hackathon wins, placements |
| 6 | **Skills** | `sections` (text) | compact, scannable — kept short on purpose |
| 7 | **Selected work** | `projects` table | the proof: what you actually built, with real outcomes |
| 8 | **Contact** | `profile` table | low-friction close: email / LinkedIn / GitHub |

This order is a deliberate choice, not a technical constraint — "Skills" could move
earlier, "Experience" and "Achievements" could merge, etc. Reordering generic
sections is just a `position` update in the `sections` table (or drag order in
`/admin/sections` via the ↑/↓ controls). Projects are a separate table and always
render after all generic sections, before the footer — if you want a project
showcase to appear *before* Experience, that requires a code change (see
`docs/DEVELOPMENT.md`), not just a content edit.

## Content model → layout mapping

The `sections` table is deliberately generic so new sections don't need new code.
Four layouts cover everything used so far:

- **`text`** — one paragraph. Anything that's a statement rather than a list of
  distinct things.
- **`tags`** — a chip grid, each chip optionally carrying a small icon (via
  `src/lib/skillIcons.ts`). Used for Skills — a flat list of short names where a
  dense paragraph ("Python · React · ...") reads poorly but a grid of bordered
  chips scans instantly. This is the direct fix for "skills looked like a wall of
  text": same brutalist chip style as the hero's role tags, just applied to a
  longer list.
- **`cards`** — a responsive grid of boxes, each with a title, body, and optional
  tag (used here as a date/period). Used for Education, Experience, Achievements —
  anything that's "a list of distinct things with their own mini-headline."
- **`two-col`** — same rendering as `cards` today (the layout exists as a named
  option for a future two-column-specific treatment, e.g. a narrower grid for
  longer-form items); currently interchangeable with `cards`.

When adding a new section, the question is: one statement (`text`), a flat list of
short labels (`tags`), or a list of things each with their own description
(`cards`)?

## Project cards: two explicit, direct links

Each project can carry a **Website URL** (live demo / deployed app) and a
**Repository URL** (source) — rendered as two separate buttons, each opening
directly in a new tab (`target="_blank"`), rather than wrapping the whole card in
one link. This mirrors how a project with both a live deployment and open-source
code should actually be presented: the visitor picks which one they want, instead
of guessing what a single click on the card will do. A project with only one of
the two links just shows that one button; a project with neither shows none.

## What's intentionally *not* on the page

- **No photo grid / gallery** — projects get one image each, not a portfolio-style
  image wall. Keeps the page text-first and fast.
- **No separate "Philosophy" section** — product thinking comes through in the
  bio line and hero tagline instead; most student portfolios over-explain this.
- **No blog** — this is a portfolio, not a publishing platform. If that's wanted
  later, it's a new route (`/writing`), not a bolt-on to the homepage.
