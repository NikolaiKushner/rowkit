# Phase 5 — Documentation Site, in detail

**Deliverable:** VitePress site live on `rowkit.dev`, Storybook deployed and linked
**Estimated effort:** ~8h across 2–3 sessions
**Prerequisite:** Phase 4 complete. Critically: `docs/` already contains conventions, installation, tokens, and twelve component pages — written incrementally since Phase 1. This phase builds the _site_, not the _content_.

That prerequisite is the whole reason this phase is 8 hours instead of 25. If any component page is missing, that's Phase 2/3/4 debt — go pay it first, because writing twelve docs pages in one push produces twelve mediocre pages.

One framing thought before the task list: **for a library nobody has heard of, the docs site _is_ the product.** A client evaluating you on Upwork will spend 90 seconds on rowkit.dev and zero seconds reading source. The site is judged on three questions — what is this, why would I use it, how do I start — and everything below serves those three.

---

## Architecture decisions

### VitePress, default theme, customized — not a custom theme

> **Version skew, recorded.** VitePress 1.6.4 bundles its own **Vite 5**, while
> the library builds on Vite 8. Harmless at runtime — VitePress uses its copy —
> but the two sets of types cannot share a TypeScript project: pulling
> `docs/.vitepress/**/*.ts` into the root `tsconfig.json` fails on
> `http-proxy` server types. The folder has its own `tsconfig.json`, which the
> lint project service finds, and the root project leaves it out. Same shape as
> the Storybook 9-versus-Vite-8 finding in Phase 0b: check the heaviest
> dependency's peer range before writing a version into a spec.

The temptation is a bespoke design (you're a frontend engineer building a design system; of course you want the docs to look designed). Resist it in v1:

- The default theme ships search, sidebar, prev/next, mobile nav, dark mode, and a11y for free — rebuilding those is a week of work that produces a worse version
- Brand customization goes through CSS variables in `.vitepress/theme/custom.css`, mapped to **rowkit's own tokens**. The site literally consuming `@rowkit/tokens` for its brand colors is a better story than a custom theme: the docs are dogfooding
- A custom theme is a legitimate v2 project. In v1 it's the highest-effort, lowest-information part of the site

### Live components in the docs: yes, scoped

VitePress renders Vue in markdown, so rowkit components can run live on their own pages. Do it — a component library with static screenshots reads as abandoned — but scope it:

- Register rowkit globally once in `.vitepress/theme/index.ts` (`enhanceApp` → install from the workspace)
- Each component page gets **one live demo block** at the top: the component in its default state plus 2–3 variants, wrapped in a shared `<DemoBox>` container (bordered, padded, dark-mode-aware — build it once, ~30 lines)
- Interactive playgrounds with editable props are **out of scope** — that's what the linked Storybook is for. Duplicating Storybook inside VitePress is the classic docs-site scope explosion

**SSR trap, and a second one that was not predicted.** The predicted trap is
real — the Toast demo will need `<ClientOnly>`. The unpredicted one cost more:
Vite inlines an `@import` but does **not** run Tailwind, so the site loaded the
token custom properties, generated no utilities at all, and rendered every demo
unstyled with nothing in the console. `@tailwindcss/vite` in the VitePress
`vite.plugins` is the fix, exactly as in `.storybook/main.ts`. A second silent
one: registering components by testing for `render` skips every
`<script setup>` SFC, which exposes `setup`/`ssrRender` instead — every export
is PascalCase, so that is the check that works.

**Original note:** VitePress builds pages through SSR, so the Phase 4 lessons apply directly — the Toast demo needs `<ClientOnly>`, and anything reading `window` at setup will break the _docs build_, not just a runtime. Budget twenty minutes for this; it's the predictable snag of the phase. If a demo fights SSR for longer than that, ship it as a static snippet with a "open in Storybook" link and move on.

### One domain, two artifacts

- `rowkit.dev` → VitePress
- Storybook → deployed separately (Vercel second project or Chromatic's hosted Storybook), linked prominently from the docs nav as "Storybook"
- Don't try to embed Storybook in VitePress via iframes — it's fragile, slow, and both tools are better standalone

---

## Site structure

```
rowkit.dev
├── /                     Landing
├── /guide/
│   ├── introduction      What + why (the positioning page)
│   ├── installation      Vue setup · Nuxt setup · styling architecture
│   └── conventions       API conventions (exists since Phase 0b)
├── /foundations/
│   ├── tokens            Full token reference with live swatches
│   ├── dark-mode         How theming works, how to override
│   └── accessibility     The library's a11y posture, per-component summary
├── /components/          Twelve pages (exist; get demo blocks this phase)
├── /patterns/
│   ├── data-table-page   FilterBar + DataTable + Pagination + EmptyState wired
│   ├── forms             Field + Input + Select + validation wiring
│   └── loading-states    Skeleton strategy, flash avoidance, aria-busy
├── /contributing         Stages, PR process, changesets
└── /roadmap              Honest list, including "Considered, not planned"
```

### The landing page — one hour, highest leverage

Structure, top to bottom:

1. **One sentence:** "Vue 3 components for data-dense interfaces — tables, filters, and the states around them." (The README line; consistency is the point)
2. **One live demo:** a compact DataTable with sorting and selection working, right there on the landing. This is the single highest-value element on the entire site — it answers "what is this" in five seconds and proves the thing is real
3. Three feature bullets max: typed columns (`keyof TRow` autocomplete), built on Reka UI (a11y), token-first theming
4. Install command + link to guide
5. Honest status badge: "v0.x — API stabilizing toward v1.0"

What's _not_ on it: feature grids with icons, testimonials (you have none; leaving space for them looks worse than omitting), animated hero gradients. Restraint reads as confidence.

### The introduction page — the positioning argument

This page does the work your Upwork profile does, for the library. Contents:

- The problem: general-purpose kits handle the easy 80% and leave you the hard part — the fast sortable table, the coherent filter/empty/loading composition
- What rowkit is: twelve components for that hard part
- **What rowkit is not** — pull the Non-goals section from ROADMAP.md up into the docs. "If you need forty components, use Nuxt UI or shadcn-vue" is the most trust-building sentence on the site: it proves the scope is a decision, not a limitation
- Comparison framing, one short table: rowkit vs Nuxt UI vs shadcn-vue on _distribution model, scope, data focus_. Factual, no disparagement — the goal is helping someone route themselves correctly, and most readers routed away today come back for the table component later

### The installation page — the make-or-break page

This is where the Phase 1 styling-architecture spike pays off in full. Requirements:

- **Two complete, copy-paste-verified paths:** Vue + Vite, and Nuxt. Each ends with "you should now see a styled button" and a screenshot of exactly that
- The Tailwind v4 setup explained _with the why_: consumer's CSS does `@import "tailwindcss"` + rowkit's CSS, and one sentence on why the library doesn't bundle Tailwind itself (double-generation). Consumers who understand the why don't file the issue
- The Nuxt section carries the Phase 4 artifacts: SSR-width plugin, `<ClientOnly>` for Toaster
- A **Troubleshooting** block at the bottom seeded with the three predictable failures: "components render unstyled" (missed the CSS import / `@source` not resolving), "hydration mismatch" (missing plugin), "tooltip on disabled button" (the pattern). You know these are the failures because the phases already hit them — write them down while they're fresh
- **Verification protocol:** before this page ships, run both paths from scratch in fresh projects outside the monorepo, following only the page's text. Every install-doc drift starts with "I'll just update the docs from memory"

### Foundations: the tokens page

Exists since Phase 1; this phase upgrades it to a live reference:

- Color scales as swatch grids rendered _from the tokens object_ — `import { tokens } from '@rowkit/tokens'` and `v-for` the swatches. Not hand-maintained HTML: the page can't drift from the package because the package renders it
- Spacing/radii/shadows visualized the same way
- A dark-mode toggle demo on the page showing semantic tokens flipping while primitives hold
- Copy-on-click for token names — trivial to add, disproportionately appreciated

### Patterns — the section that sells seniority

Three pages, each the same shape: the finished result live at the top, then the complete code, then 3–5 short notes on _why_ it's wired that way (why page resets on filter change, why the empty state switches to `no-results`, why the skeleton delays 150ms).

The data-table-page pattern is the playground users-admin page from Phase 3, ported. It's already built; the docs page is extraction plus commentary.

This section is deliberately where composition knowledge lives — component pages say what each piece does, patterns say how they go together. Most libraries skip this, which is exactly why including it distinguishes the library. And these pages double as LinkedIn material almost verbatim.

### Component pages — the upgrade pass

Each of the twelve existing pages gets, in one sweep:

- The live `<DemoBox>` block at top
- A props table **generated from source, not hand-written** — small build script parsing the exported prop types/JSDoc into markdown (or `vue-component-meta` if it cooperates within an hour; script otherwise). Hand-written props tables are stale by the second release, and the JSDoc-on-every-prop rule from Phase 0 was building exactly this payoff
- Verify the "when not to use" section survived — it's the most-read section on every page
- Prev/next links follow the sidebar order

### AGENTS.md — the 2026 distribution detail

Generated, not written: a script walks the exported components and emits every component's props/events/slots with their JSDoc as plain structured text. Ships **in the npm package** (so `node_modules/rowkit/AGENTS.md` is on disk for any coding agent) and renders as a docs page.

Wire the generation into the build so it regenerates on release. This is a genuinely differentiating feature this year — AI-assisted consumers get correct usage on the first try — and it's also the closing paragraph of your launch post.

---

## Deployment

- **Vercel, two projects** from the monorepo: `docs/` (VitePress) and Storybook (`storybook build` output). Both build on push to `main`
- `rowkit.dev` → docs project; `storybook.rowkit.dev` as the Storybook domain (subdomains are free with the domain you own)
- VitePress on Vercel is zero-config (`docs:build`, output `docs/.vitepress/dist`); the only monorepo wrinkle is setting the project root — five minutes
- Add a `robots.txt` and let VitePress emit the sitemap (`sitemap: { hostname: 'https://rowkit.dev' }`) — the docs ranking for "vue data table typed columns" queries is a real acquisition channel, and it costs one config line
- PR preview deployments come free with Vercel — every docs PR gets a preview URL, which is exactly how docs changes should be reviewed

The dead-link problem from earlier (rowkit.dev pointing nowhere since the profile went up) resolves itself the moment the first deploy lands. Do the deploy in session 5.1, even with half the polish missing — a live minimal site beats a perfect unshipped one, and every subsequent session then improves production.

---

## Session plan

| Session | Scope                                                                                                                                                      | Exit                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 5.1     | VitePress scaffold, theme-to-tokens wiring, nav/sidebar, deploy pipeline, landing page with live DataTable                                                 | **rowkit.dev is live**    |
| 5.2     | Installation page + fresh-project verification of both paths; introduction; DemoBox; component-page upgrade pass; props-table generation                   | All twelve pages upgraded |
| 5.3     | Patterns section (3 pages); tokens live reference; AGENTS.md generation; a11y page; contributing/roadmap; Storybook deploy + link; SSR sweep of every demo | Phase done                |

Session 5.1 ends with a deployed site. That ordering is deliberate — see above.

---

## Phase Definition of Done

- [ ] `rowkit.dev` live, HTTPS, custom domain — **needs the Vercel project and DNS; everything up to the deploy is ready**
- [x] Landing page with a working live DataTable demo — sorting and selection verified interactive in a browser, zero hydration warnings
- [ ] Installation verified by executing both paths in fresh projects outside the monorepo
- [ ] All twelve component pages: live demo, generated props table, "when not to use" intact
- [ ] Three pattern pages live
- [ ] Tokens page renders from the tokens package, not hand-maintained
- [ ] AGENTS.md generated from source, shipped in the package, rendered in docs
- [ ] Storybook deployed on its subdomain, linked from docs nav
- [ ] Docs build clean — zero SSR errors, zero dead internal links (`vitepress build` fails on dead links by default; leave that on)
- [ ] Site works on mobile (VitePress default handles this; verify the demo blocks don't overflow)
- [ ] Dark mode toggle works and rowkit demos follow it

---

## Failure modes to watch

**Custom-theme temptation.** The strongest pull of the phase, and the lowest-value work in it. CSS variables on the default theme, ship, revisit in v2.

**Writing docs from memory.** Every installation page that rots started as "I know how it works, I'll just write it." The fresh-project verification is non-negotiable and takes 30 minutes.

**Demo maximalism.** One demo block per component page. The urge to show every prop combination live belongs in Storybook, which is deployed and linked precisely so the docs don't have to do its job.

**Treating the landing page as an afterthought.** It's the highest-traffic page by an order of magnitude. One hour, the structure above, done — but actually spend the hour.

**Polishing past the point of shipping.** The phase ends when the DoD is met, not when the site is "done" — docs are never done. Phase 6 is waiting, and it's short.
