# rowkit — After 0.1: The Road to 1.0 and Beyond

**Status:** planning document, not a commitment. Everything here is sequenced by evidence — features graduate from this file into ROADMAP.md only when real usage demands them.
**Companion to:** ROADMAP.md (the v1 scope contract) and the phase files (how v0.1 was built).

The premise of this document: **0.1.0 is where the project starts learning.** Phases 0–7 were built on informed guesses about what consumers need; everything after is built on what they actually report. The discipline that got the library shipped — fixed scope, documented decisions, definitions of done — doesn't relax now; it just gets a new input: users.

---

## Part 1 — The path to 1.0

### What 1.0 means, precisely

Not "more features." 1.0 is a **stability promise**: every component moves 🟢 Stable → 🔒 Locked, and from that point breaking changes require a major version. The version number is a contract with consumers, so the criteria are consumer-facing:

- [ ] Every v1 component has survived ≥3 months of real external usage without an API-breaking issue surfacing
- [ ] At least a handful of real consumers exist beyond your own projects (issues, Discussions activity, or dependents on npm — any signal of use in anger)
- [ ] All known API papercuts collected in 0.x are either fixed or explicitly rejected with reasons in Discussions
- [ ] Zero open bugs labeled `api-design`
- [ ] Docs installation paths re-verified against the current Vue/Nuxt/Tailwind minor versions
- [ ] A written deprecation policy exists (see Part 4)

Realistic timeline: **1.0 lands 4–8 months after 0.1**, driven by usage accumulating, not by calendar. Rushing 1.0 with zero external users makes the stability promise meaningless — there's nobody to promise it to.

### The 0.x series — what minors are for

Expected shape, adjust to what feedback actually says:

**0.2 — the papercut release (~1 month after launch).** Nothing new; everything sharpened. Launch feedback always surfaces the same class of thing: a prop that should have a default, an event payload missing a field, a docs page that confused three people the same way. Batch them, ship them fast — a responsive 0.2 within weeks is the strongest "this is maintained" signal available.

**0.3 — production dogfooding round.** The strategic one: adopt rowkit (or its patterns) in a real product UI, and port back everything that production usage exposes. Expect it to surface density/sizing needs (`size="sm"` on table rows, compact pagination) that portfolio usage never would.

**0.4+ — the earned features.** Whichever of Part 2's candidates has accumulated actual demand.

### Versioning discipline in 0.x

- Breaking changes are _allowed_ in 0.x minors — that's what 0.x means — but each one still gets a changeset explaining the migration in two sentences
- Batch breaking changes into as few minors as possible; a consumer updating 0.2→0.5 should read one migration section per minor, not per patch
- The moment 1.0 ships, this loosens permanently. Which is exactly why every "should this API be different?" doubt gets resolved _before_ 1.0, not deferred past it

---

## Part 2 — Feature candidates, with graduation criteria

Everything currently in ROADMAP's "Considered, not planned," expanded with what evidence would promote each — so future decisions are pre-structured instead of re-argued from scratch.

### Near-orbit (plausible for 0.x–1.x)

**`Popover`** — the strongest candidate, because Phase 4 already carved its shape: Tooltip's string-only constraint deliberately pushed interactive floating content here. _Graduates when:_ the tooltip "when not to use" docs section demonstrably routes people to a component that doesn't exist yet — i.e., the first two or three "how do I put a button in a tooltip" issues arrive. Build on Reka's popover primitive; the Phase 4 checklist applies wholesale.

**DataTable `virtual` prop** — the documented no that was designed to be reversible. _Graduates when:_ a real consumer presents a use case where pagination genuinely can't serve (live-streaming rows, unpaginatable domain constraint) — not when someone just asks "does it virtualize?" The docs answer for askers is written; the feature is for the constraint. Implementation note from Phase 3 stands: it ships as additive (`virtual?: boolean`), semantic-table trade-offs documented, the 10k-row benchmark story becomes its regression test.

**Row expansion on DataTable** — the most-requested table feature across every table library's issue tracker; expect it. _Graduates when:_ requested with concrete use cases twice. Design constraint decided now: expansion content is a slot, expansion state is controlled (`v-model:expanded` with row ids) — consistent with every other state decision in the library.

**`Tabs`** — arguably belongs in a data-dense kit (dashboard sections). Reka primitive exists, cost is low. _Graduates when:_ production dogfooding wants it, which it likely will.

**Compact density mode** — a `density: 'comfortable' | 'compact'` axis on the data components rather than per-component size props. _Graduates when:_ dogfooding confirms the need. Design it as a token-level switch (spacing tokens swap) rather than per-component logic — that's the token architecture earning its keep again.

### Outer orbit (1.x era, evidence permitting)

**`DatePicker` / date-range** — the most-requested and most expensive component in any kit; a correct one is a project the size of Phase 3. _Graduates only when:_ demand is sustained AND a quarter can be dedicated. Honest alternative to keep documented meanwhile: a pattern page wiring a headless date library into `Field`.

**`Combobox` (multi-select, tags)** — natural Select extension, real Reka support. _Graduates when:_ FilterBar consumers ask for multi-value filters, which is the likely vector.

**`Command` palette** — fashionable, fits dashboards, but scope-heavy (scoring, virtualized results, portal focus). Genuinely 1.x+.

**`Toast.promise()`** — the Sonner-style `toast.promise(fetch())` sugar, explicitly cut in Phase 4. Cheap, additive, popular. _Graduates when:_ two people ask.

### Permanently out (re-affirmed, with the reasons on file)

- **Charts** — a different discipline with excellent dedicated libraries; a kit that does charts badly poisons trust in the parts it does well
- **Form validation engine** — rowkit provides field _states_; owning validation couples it to one philosophy and against the rest. The pattern page (VeeValidate/Zod wiring) is the permanent answer
- **Rich text editor** — no
- **React port** — doubles every cost forever and halves the identity. rowkit is a Vue library; that focus _is_ the positioning
- **Filter engine in FilterBar** — the Phase 3 scope line, permanent

---

## Part 3 — The ecosystem track (non-component growth)

Often higher-leverage than new components, and mostly one-session projects:

**`@rowkit/nuxt` module** — graduate the `./nuxt` subpath into a proper Nuxt module: auto-imported components, the SSR-width plugin injected automatically, CSS wired. Removes three manual steps from the highest-friction install path. _Strong candidate for the first post-launch minor_ — it's small and directly converts Nuxt evaluators into users.

**Starter template** — `npx giget` a dashboard starter: Nuxt + rowkit + the users-admin pattern pre-built. One repo, low maintenance, and it becomes the answer to "how do I start" _and_ a portfolio artifact of its own.

**Figma tokens export** — a script emitting the token package as Figma variables JSON. Bridges to designers, demos the tokens-as-data architecture, and is an excellent LinkedIn post ("one source of truth, code to Figma"). Low cost because the tokens are already structured data.

**ESLint plugin (`eslint-plugin-rowkit`)** — rules like "no raw hex near rowkit components" or "prefer semantic token." Ambitious; only if the library grows real adoption. Parked here so the idea isn't lost.

**Theme presets** — 2–3 alternative token sets (a warm neutral, a high-contrast) shipped as CSS files. Cheap once tokens are the only styling source — which is a test of that architecture as much as a feature.

---

## Part 4 — Maintenance posture (the unglamorous contract)

A published library is a standing commitment. Defining the posture now prevents both burnout and neglect:

**The sustainable baseline: ~2 hours/week.** Triage new issues within 2–3 days (a reply, not necessarily a fix); merge dependabot patches weekly; release accumulated changesets monthly-ish whether or not anything feels "big enough." Small regular releases outperform rare large ones on every axis: consumer trust, changelog readability, your own re-entry cost after a break.

**Dependency policy:**

- Patch/minor deps: dependabot + green CI = merge without ceremony
- **Reka UI minors: read the changelog first** — it's the foundation; a behavior change there is a rowkit behavior change
- Vue/Tailwind/Storybook majors: a scheduled session each, never a drive-by. Storybook majors specifically are the known time sink (flagged in v2's risks) — pin, batch, upgrade between feature pushes
- TypeScript: unpin from 6.0.3 when `typescript-eslint` supports 7 (the standing note from Phase 0) — check quarterly

**Deprecation policy (write before 1.0, it's a 1.0 criterion):** deprecated APIs warn (JSDoc `@deprecated` + console warning in dev) for one minor before removal in a major; every deprecation ships with its replacement already available; migration notes in the changelog entry itself, not a separate wiki.

**Bus-factor honesty:** CONTRIBUTING.md is written; if a genuine recurring contributor ever appears, the generous move — triage rights early — is also the strategic one. Solo-maintainer libraries stall when the maintainer's season changes; yours will change too (Bali winters, work pushes). A library that survives your absence is worth more on your CV than one that doesn't.

**The permission to pause:** a pinned "maintenance mode this month, back in N weeks" Discussion post costs nothing and preserves all trust. Silence is what kills projects, not pauses.

---

## Part 5 — Review cadence

This document gets re-read, briefly, on a schedule — not when anxiety strikes:

- **Monthly (15 min):** triage anything new into the orbits; check whether any graduation criterion has been met; note it in the doc
- **Quarterly (1 h):** re-assess the 1.0 checklist honestly; prune candidates that stopped making sense; check the TypeScript unpin; decide the next minor's theme
- **At 1.0:** rewrite Part 1 for the 1.x→2.0 horizon; archive the graduated items with links to their releases — that changelog-of-decisions becomes case-study material of its own

And one standing question for every review, imported from the very start of this project: **is the library still serving the person building it?** rowkit exists to compound — portfolio, rate, the freelance transition. If a quarter ever arrives where it's pure obligation and zero compounding, the right move is documented maintenance mode, not guilt. The asset keeps its value while parked; you don't.
