# What's next

The twelve components for v1 are built, documented, and marked Stable. This file
is the working backlog — polish, proof, and process — not a list of new
components.

**Do not propose a thirteenth component.** Scope stays twelve unless this file
explicitly says otherwise. Ideas that used to live under "Considered, not
planned" stay out: date pickers, charts, command palette, form validation layer,
virtualised lists beyond DataTable, Figma kit, React port.

---

## Now

Ordered. Finish (or deliberately drop) an item before inventing the next.

### 1. Visual QA loop for agents

Agents must not ship UI changes on green unit tests alone. After any change that
touches variants, tokens, layout, or dark mode:

1. Run `pnpm visual:check` (or the scoped form for one component).
2. **Open the PNGs** with the Read tool and inspect them — light and dark.
3. Fix what looks wrong before claiming done.

The silent failure mode here is familiar: a class with no utility, a token in
the wrong namespace, a focus ring clipped by overflow. Screenshots catch what
`expect(true)` cannot.

### 2. Cross-component consistency pass

Walk every Stable component against the same checklist:

- [ ] Focus ring visible and not clipped (Input, Select, Dialog, Pagination)
- [ ] `sm | md | lg` heights and type scale align across Field / Input / Select /
      Button / FilterBar
- [ ] Dark mode: borders, muted text, subtle badges, overlays, scrim
- [ ] Disabled / loading / empty / error states look intentional, not washed-out
- [ ] Density in a real table page (FilterBar + DataTable + Pagination + Empty)

Record findings as issues or inline TODOs here; fix one cluster at a time.

### 3. Real-world API pressure

v1.0 is not a checklist — it is survival in a few real apps. Prefer:

- Using rowkit in one internal or side project and filing concrete friction
- Hardening docs patterns (`data-table-page`, forms, loading) from that friction
- Locking APIs (`🔒`) only after the above, never before

### 4. Docs and agent surface

- Keep `pnpm docs:props` / `pnpm docs:agents` honest after every prop/JSDoc change
- Trim stale "roadmap" language from README and docs as it ages
- "When not to use" sections: keep them sharp; cut fluff

---

## Later (not promised)

Nothing here starts until the items above have real weight:

- Popover — the honest answer to "can a tooltip contain a link"
- DataTable virtualisation — only with a real workload, see decision 004
- Custom docs theme — legitimate, lowest-information work available

---

## Non-goals (still)

- Not a general-purpose UI library (use Nuxt UI / shadcn-vue for breadth)
- Not a CSS framework (Tailwind stays a peer)
- Not opinionated about data fetching
