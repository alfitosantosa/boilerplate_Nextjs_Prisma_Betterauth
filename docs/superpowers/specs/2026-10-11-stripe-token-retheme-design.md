# Stripe-track token retheme — Design

Date: 2026-10-11
Status: approved (user selected "Adopt the Stripe track" and "build phase 1 now")
Scope owner: the user answered three gating questions — design source = **Stripe track**;
product knowledge = in-app contextual help **+** full module tours **+** guided empty
states; page consistency = shared shell applied everywhere. That is four subsystems, so
this document covers **phase 1 only** (the token retheme). Phases 2–5 get their own
specs, in the order recorded in §9.

## 1. Problem

`DESIGN.md` is the design system's stated source of truth (referenced by name from
`app/globals.css`), but the file and the code have drifted apart:

1. **The file holds two incompatible systems.** Its first 227 lines are a
   RevisionDojo token block (white canvas, `#0284c5` blue, Inter). Lines 228–680 are
   a Stripe-inspired system (`#533AFD` purple, `sohne-var`). They specify different
   primaries, different type stacks, and different radii.
2. **The code cites sections that no longer exist.** `app/globals.css` comments point
   at "DESIGN.md's 'Accessible Clarity'", "the four-ink table in DESIGN.md §1", and
   "DESIGN.md's rounded scale". The current file has no "Accessible Clarity" and no
   four-ink table; §1 is "Visual Theme & Atmosphere".
3. **The contrast audit is blind to 45% of its own constraint surface.** `readBlock()`
   in `scripts/color-audit.mjs` collects only values matching `#rrggbb`, so every
   `oklch(...)` token is dropped and its pairings print `SKIP`. The script reports
   "174 pairings checked, all within target" while **140 more are skipped**. Any token
   written as `oklch` is effectively unaudited.

The user's decision — adopt the Stripe track — fixes (1) and (2). Converting the
brand-bearing tokens to hex fixes (3) as a side effect, because a token the audit can
read is a token the audit enforces.

## 2. Verified facts this design rests on

- **The blast radius is one file.** The app is already fully tokenized: `bg-primary`
  appears 45×/24 files, `text-primary` 46×/23, `bg-destructive` 148×/57, etc. — every
  occurrence resolves through a CSS variable. No `.tsx` needs to change for a hue swap.
- **`#533AFD` clears WCAG AA in both directions.** 6.19:1 for white text on the fill,
  6.19:1 for the ink on white. It is safe as both `bg-primary` and `text-primary`.
- **`sohne-var` is unobtainable.** Stripe's brand face is proprietary; it is not on
  Google Fonts and cannot be self-hosted. DESIGN.md §3 already states a fallback chain
  beginning `-apple-system`.
- **DESIGN.md's Stripe section has no dark palette.** It specifies only light surfaces
  (`#FFFFFF`, `#F8FAFD`, `#F6F9FC`). The app ships a complete `.dark` block, wired
  through `next-themes@0.4.6`, so dropping dark mode would delete a live feature.
- **`--primary` carries two roles.** It is both the `bg-primary` fill and the
  `text-primary` ink, and they have opposite contrast needs on a dark canvas.
- **The audit's dark exception already documents this.** `ACCEPTED` matches
  `dark: primary on *` with the reason "dark mode unwired; pine fill must carry light
  text (...), so `text-primary` gives up its text ratio there". The retheme makes that
  exception live instead of dead (it currently never fires, since the pairing is
  skipped).
- **DESIGN.md §2's spec block contradicts its own prose.** The frontmatter mini-block
  says `surface: "#000000"`; §2/§4 specify a white canvas with white cards.
- **DESIGN.md's `rounded` and `elevation` blocks already match the code verbatim**
  (sm 4 / DEFAULT 8 / md 12 / lg 16 / xl 24; three elevation steps). Nothing to change.
- **`--tertiary` is a status ink, not a brand ink.** It renders the `sakit` (sick)
  attendance chip — `bg-tertiary-chip text-tertiary-strong` — so it must stay
  distinguishable from the other status families. As a violet it becomes a twin of the
  new purple primary.

## 3. Goals

- `app/globals.css` describes the Stripe track: purple `#533AFD` primary, Deep Navy
  `#0A2540` text, `#E5EDF5` borders, white/off-white surfaces.
- Every pairing the UI actually renders clears WCAG AA **and is enforced** — the
  `SKIP` count falls because the brand tokens become hex.
- Dark mode stays a first-class theme and reads as the same brand.

## 4. Non-goals

- No font change. `sohne-var` cannot ship; Inter stays for this phase (§6).
- No radius, elevation, spacing, or layout change — those already match DESIGN.md.
- No `.tsx` edits, no component work. The page-shell sweep, guidance layer, tours, and
  empty states are phases 2–5.
- No new dependency.

## 5. Token mapping

Light (`:root`). "—" means unchanged from the current file.

| Token | New value | Source |
|---|---|---|
| `--background`, `--card`, `--popover` | `#FFFFFF` | §2 white canvas |
| `--foreground`, `--card-foreground`, `--popover-foreground` | `#0A2540` | §2 Deep Navy (15.5:1 on white) |
| `--primary` | `#533AFD` | §2 Brand Purple |
| `--primary-foreground` | `#FFFFFF` | §4 primary button |
| `--primary-hover` / `--primary-active` | `#4328D9` / `#3620B0` | §4 hover/active |
| `--secondary`, `--muted`, `--accent`, `--background` tint | `#F6F9FC` | §2 Light Blue-Gray |
| `--secondary-foreground`, `--accent-foreground` | `#0A2540` | §2 |
| `--muted-foreground` | `#425466` | §2 Steel Blue (supporting text; 7.8:1) |
| `--border`, `--input` | `#E5EDF5` | §2 Border Gray |
| `--ring` | `#533AFD` | §4 focus ring |
| `--brand-tint` / `--brand-accent` | `#F6F9FC` / `#533AFD` | derived |
| `--interactive` / `-fill` | `#533AFD` | §2 links |
| `--interactive-border` / `-surface` | `#DCD5FE` / `#F4F1FF` | derived tint |
| `--navy` / `--navy-foreground` | `#0A2540` / `#FFFFFF` | §1 navy authority |
| `--navy-accent` | `#B4A7FE` | §2 accent on navy (6.6:1) |
| `--navy-muted` | `#94A3B8` | derived |
| `--sidebar` / `--sidebar-foreground` | `#F8FAFD` / `#0A2540` | §2 Off-White |
| `--sidebar-primary`, `--sidebar-active` (+ light foregrounds) | `#533AFD` + `#FFFFFF` | §4 nav active |
| `--sidebar-accent` / `-foreground` | `#F1EEFF` / `#0A2540` | derived hover |
| `--sidebar-border` / `--sidebar-ring` | `#E5EDF5` / `#533AFD` | §2 / §4 |
| `--tertiary` family | neutral slate: `#3C4F69` ink over `#E5EDF5` chip | §6 deviation — kills the purple twin |
| `--destructive`, `--success`, `--warning`, `--caution`, `--info` families | unchanged | already AA-verified; §6 deviation |
| `--margin` | unchanged | DESIGN.md is silent; it is a structural register rule |
| `--chart-8` | `#0d9488` | was `#9333ea`, a purple twin |

Dark (`.dark`). DESIGN.md specifies no dark palette, so the existing neutral surfaces,
borders, and status families stay **verbatim**; only the brand-bearing tokens move:

| Token | New value | Why |
|---|---|---|
| `--primary` / `-hover` / `-active` | `#533AFD` / `#4328D9` / `#3620B0` | same fill as light |
| `--primary-foreground` | `#FAFAFA` | light label on the purple fill (§4); this is what makes the `ACCEPTED` dark exception live |
| `--ring` | `#533AFD` | 4.14:1 on the dark canvas, clears the 3:1 ring floor |
| `--interactive` / `-fill` | `#B4A7FE` | a link must be legible on a dark canvas, where `#533AFD` is only 3.2:1 |
| `--interactive-border` / `-surface` | `#4C3FA8` / `#1B1145` | derived |
| `--sidebar-active`, `--sidebar-primary`, `--sidebar-ring` (+ light foregrounds) | `#533AFD` + `#FAFAFA` | brand nav |
| `--tertiary` family | neutral slate (`#94A3B8` ink, `#475569` solid, `#1E293B` surface, `#334155` chip, `#E2E8F0` strong) | mirror of the light deviation |
| `--chart-8` | `#2dd4bf` | purple twin |

## 6. Deviations from DESIGN.md, with reason

1. **`#15BE53` is not adopted as `--success`.** DESIGN.md §2 offers Success Green
   `#15BE53`, but it carries only **2.5:1** on white and 2.5:1 under white text — it
   fails AA in both the ink role and the fill-with-label role. Meanwhile §7 mandates
   WCAG AA and "never place light gray text on light backgrounds". The existing
   `#047857` family keeps DESIGN.md's hue one step deeper. This is the same
   resolution the file's own header comment already documents for `#0284c5` and
   `#b8860b` ("the same hue is taken one step deeper and DESIGN.md's exact tone keeps
   the non-text role").
2. **Inter stays; `sohne-var` is not attempted.** The font is proprietary and
   unobtainable. DESIGN.md §3 supplies its own fallback chain, and the RevisionDojo
   block in the same file names Inter explicitly — so Inter is sanctioned by the
   document, not smuggled in. A family swap also re-flows metrics on all 83 pages,
   which would hide retheme regressions inside layout breakage. Geist is the candidate
   for a later phase (§10).
3. **Radii and elevation are unchanged.** DESIGN.md's machine-readable `rounded` and
   `elevation` blocks already match `globals.css` verbatim, and they are the blocks the
   code comments cite as authoritative. Stripe §5's prose ("4px buttons") is the older,
   less specific statement and is not adopted.
4. **The white canvas wins over the frontmatter `surface: "#000000"`.** §2 and §4
   both specify white surfaces; a single frontmatter line disagreeing with the prose is
   treated as the outlier.
5. **Dark mode is derived, not deleted.** DESIGN.md does not describe one and the app
   has a working one; deleting a feature to satisfy a silence is not a retheme.

## 7. Files

- `app/globals.css` — the `:root` and `.dark` token blocks, and the header comment that
  describes the palette. The only file with logic in it.
- `scripts/color-audit.mjs` — no change expected, but pairing coverage is expected to
  grow on its own as tokens become hex. If a newly-live pairing legitimately needs an
  exception, it is added to `ACCEPTED` with a reason, never silently skipped.

## 8. Risks

- **`--primary`'s double role in dark mode.** Shadcn's default dark convention is
  `--primary` = near-white fill. Following that convention here would put white text on
  a white fill. The token stays a mid-purple fill with a light label, and `text-primary`
  on the dark canvas is the one accepted sub-AA pairing (§5, already documented in
  `ACCEPTED`). This is deliberate; the alternative breaks every `bg-primary` button.
- **`--tertiary` changes hue.** Users may have learned violet = *sakit*. The alternative
  is a violet chip sitting next to a violet CTA, which is worse. The chip keeps its
  position in the status map; only its hue moves.
- **Dark mode now carries two purples** (`#533AFD` fill, `#B4A7FE` link) where light
  mode carries one. This is forced by contrast, not taste.
- **Font metrics do not move**, so any layout breakage visible after this change is
  pre-existing and separable.

## 9. Verification

1. `bun scripts/color-audit.mjs` — green, with the `SKIP` count materially lower than
   the 140 baseline (proof the enforcement actually widened).
2. `bunx tsc --noEmit` — clean.
3. Dev server booted; the compiled CSS carries the new hues (grep the served stylesheet
   for `#533afd`), and the landing page plus a dashboard route are walked in **both**
   light and dark for a visual check.

Then phases 2–5, in order: page shell sweep (83 pages) → guidance layer → guided empty
states → tour expansion. Each gets its own spec and plan.

## 10. Open decisions

- **Geist as the display face.** The design-taste skill bans Inter for technical UI and
  prefers Geist/Outfit/Satoshi; DESIGN.md cannot supply `sohne-var`. Deferred to avoid
  mixing a metric reflow with a palette change. One `next/font/google` import when
  wanted.
- **`--margin`.** The register-sheet red rule has no DESIGN.md equivalent. It could
  adopt a Stripe-tinted tone, or stay as-is. Currently as-is.
