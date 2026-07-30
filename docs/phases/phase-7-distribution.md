# Phase 7 — Distribution, in detail

**Deliverable:** the portfolio value of six months' work actually realized — at minimum one Upwork portfolio item and one LinkedIn post published; realistically a two-week launch sequence
**Estimated effort:** ~6h of production + a two-week posting cadence of ~30min/day
**Prerequisite:** Phase 6 complete, `0.1.0` live and smoke-tested, one day of buffer passed.

This phase exists as its own entry because in v1 of the plan it was a bullet point at the end of Phase 6 — and bullet points at the end of phases don't get done. An unpublicized package is a private repo with extra steps. Every hour of Phases 0–6 was building the asset; this phase is the asset doing its job: **evidence that you design systems, ship them, and explain them** — visible to the three audiences that matter: Upwork clients, LinkedIn's hiring-adjacent audience, and the Vue community.

One mindset note before the tactics: distribution is uncomfortable in a way the engineering wasn't. Posting feels like showing off; silence feels safe. The reframe that makes it tractable — you're not promoting yourself, you're **documenting decisions other engineers will find useful**. Every asset below is structured that way, which is also, not coincidentally, what performs.

---

## The asset inventory — produce once, reuse everywhere

Session one is production, not posting. Everything downstream draws from these six assets:

### A. The hero clip (exists — Phase 3)

The 30-second users-admin capture. Produce three cuts:

- **GIF, <3 MB** — already on the npm README
- **MP4, 1080p** — LinkedIn native video (uploads outperform GIF links there)
- **A 10-second cut** — just the typed-column autocomplete: typing `key: '` and seeing row fields suggested, then a typo failing compilation. This one moment is the whole pitch in one clip

### B. The case study (~2h to write, the anchor asset)

One page, written once, adapted per surface. Structure:

1. **Context** — 6+ years on one data-heavy SaaS frontend; the same table/filter/state problems rebuilt repeatedly; the gap in general-purpose kits
2. **Decisions** — the four with teeth: tokens as a separate package (the Polaris argument); the Tailwind v4 distribution problem and the `@source` answer; `keyof TRow` typed columns; the documented _no_ to virtualization, with the measured numbers
3. **Outcome** — 12 components, published with provenance, docs site, the numbers (bundle size vs budget, 10k-row render ms, a11y-clean)
4. **Links** — rowkit.dev, npm, repo

The decisions section is the case study. Anyone can list features; walking through trade-offs with reasons is the artifact that reads as senior.

### C. Screenshot set

Docs landing with the live table · a component page showing the props table + "when not to use" · the tokens page swatches · Storybook grid · the npm page with provenance badge. Light and dark. These feed every post and the Upwork gallery.

### D. Comparison paragraph (write once, keep handy)

The honest three-way vs Nuxt UI and shadcn-vue from the docs intro, condensed to four sentences. You will be asked "why not just use X" in every comment section; having the calm, factual answer pre-written keeps launch-day replies consistent and non-defensive.

### E. The `llms/AGENTS.md` angle (one paragraph)

"The package ships a generated AGENTS.md so coding agents get correct component APIs from `node_modules`" — a 2026-native detail almost nobody ships, and reliably the most-commented line in dev audiences.

### F. Numbers card

One small image or text block: bundle KB vs budget · 10k-row render ms · 12 components · 0 a11y violations · test count. Concrete numbers are the difference between a claim and a fact.

---

## Surface 1 — Upwork (highest direct-income leverage)

### The portfolio item

- **Title:** "rowkit — Vue 3 component library for data-dense SaaS interfaces (npm, 12 components)"
- **Media:** hero MP4 first, then 4–5 screenshots from set C
- **Description:** the case study, trimmed to ~200 words, ending with what it proves for a client: _"This is the standard I bring to production frontend work: typed APIs, documented decisions, accessibility as a gate, and shipping."_
- Link rowkit.dev prominently — the docs site is the portfolio piece the portfolio item points at

### Profile updates in the same sitting

- Overview: add one line — "Author of rowkit, an open-source Vue component library for data-heavy interfaces" with the link. Third-party-verifiable claims are worth ten adjectives
- Skills: confirm `Component Library`, `Design Systems`, `Vue.js`, `TypeScript` are present and ordered
- **Rate: this is the moment.** The $8/hr placeholder becomes $50–60/hr now — a published, documented library is precisely the evidence that supports it. A specialist profile with proof converts better at $55 than a generic one at $25

### Proposals (ongoing, not launch-day)

The library changes proposal mechanics: for any Vue/dashboard/design-system job, the second sentence is now "I maintain rowkit (link) — the DataTable there handles the exact pattern you're describing." A live link that proves competence in one click beats three paragraphs of assurance. Save it as a proposal snippet.

---

## Surface 2 — LinkedIn (the compounding channel)

Not one launch post — a **sequence**. One post per topic, spaced over ~2 weeks, each standalone. Ordered by expected performance:

**Post 1 — the launch.** Personal-arc framing, not feature-list framing: _"Six years building data-heavy SaaS frontends. I kept rebuilding the same table. So I built the library I kept wishing existed — and shipped it."_ Hero MP4 native, three decisions in one line each, links in the first comment (LinkedIn throttles external links in post bodies). End with a genuine question — "what's the component _you_ keep rebuilding?" — which is both real curiosity and comment fuel.

**Post 2 — the Tailwind v4 distribution problem.** The best pure-engineering story you have: "Tailwind only generates classes it can see — and it can't see your npm package. Here's the distribution architecture that solves it." Niche, precise, exactly what engineers reshare. This one can also become a dev.to/Hashnode long-form with the same content (canonical link to it from the LinkedIn post).

**Post 3 — the typed columns clip.** The 10-second autocomplete cut, almost no text: "Column keys that fail compilation when you typo them. `keyof TRow` doing honest work." Short video posts with one sharp idea travel.

**Post 4 — "the feature I refused to build."** The virtualization decision: the a11y trade-offs, the measured numbers, why _documented restraint_ beats a checkbox. Contrarian-but-substantiated is the highest-engagement register on engineering LinkedIn — and this one doubles as a portfolio of judgment, which is what senior rates are paid for.

**Post 5 — AGENTS.md and AI-readable libraries.** The 2026 angle; ties back to your earlier `gh`+agents post, building the through-line that your feed has a theme.

Cadence notes: post mid-week mornings (your audience is European tech); reply to every comment in the first two hours; repost nothing — each post stands alone.

---

## Surface 3 — Vue community (the credibility channel)

Ordered by effort-to-value:

1. **r/vuejs "Show" post** — title states what it is and the one differentiator ("typed column defs via `keyof TRow`"); body is honest about v0.1 scope and links docs first. Reddit rewards modesty + substance and punishes marketing tone; the comparison paragraph (asset D) will be needed in the comments within the hour
2. **Vue newsletter submissions** — Vue.js Feed / Weekly Vue News / Michael Thiessen's roundup all take submissions; one paragraph + link each, ten minutes total, outsized reach if picked up
3. **awesome-vue PR** — the standing directory traffic source; follow the repo's contribution format exactly
4. **Show HN — optional, expectations calibrated.** A Vue component library rarely fronts HN; post it (Tuesday–Thursday morning US time, title format "Show HN: Rowkit – Vue 3 components for data-dense interfaces"), engage if it moves, shrug if it doesn't. The lottery ticket costs five minutes
5. **VueConf/meetup CFPs — the sleeper.** "Design tokens, typed tables, and the Tailwind v4 packaging problem: lessons from shipping a component library" is a genuinely good talk proposal, and one accepted talk outweighs every post above for credibility. File under ongoing, not launch-week

---

## Handling what comes back

Launch produces inbound; the posture is decided in advance:

- **Bug reports** — the good kind of problem. Triage within a day using the templates; a fast first `0.1.x` fix release is itself a marketing event ("maintained" is a feature)
- **Feature requests** — the ROADMAP's "Considered, not planned" section now earns its keep: link it kindly, don't relitigate. Requests genuinely outside it go to Discussions
- **"Why not just use X"** — asset D, warmly. Never defensive; the person asking is routing themselves, and routing them honestly builds more trust than winning the exchange
- **Silence** — the most likely outcome for any single post, and fine. Distribution compounds across the sequence and across months; the library's discoverability (npm keywords, docs SEO, awesome-vue) works while you sleep. The metric for this phase is _assets published_, not reactions received

---

## Session plan

| Session                       | Scope                                                                                                             | Exit                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| 7.1 (~3h)                     | Asset production: case study, clips cut, screenshots, comparison paragraph, numbers card                          | All six assets exist |
| 7.2 (~3h)                     | Upwork item + profile + rate; LinkedIn post 1 drafted and published; Reddit + newsletters + awesome-vue submitted | Launch is live       |
| ongoing (~30min/day, 2 weeks) | Posts 2–5 on cadence; replies; inbound triage                                                                     | Sequence complete    |

---

## Phase Definition of Done

- [ ] All six assets produced and filed where reusable
- [ ] Upwork portfolio item live; profile updated; **rate raised**
- [ ] LinkedIn post 1 published; posts 2–5 drafted and scheduled
- [ ] r/vuejs posted; ≥2 newsletters submitted; awesome-vue PR open
- [ ] Proposal snippet saved
- [ ] Inbound triage posture in place (templates live, Discussions on — from Phase 6)

---

## Failure modes to watch

**Producing forever, publishing never.** The case study wants a fifth revision; post 1 wants a better hook. Two sessions of production, then publish. Done-and-visible beats polished-and-drafted by an order of magnitude here.

**One post, then silence.** The launch post is the _worst-performing_ post of the sequence in most launches — the engineering-decision posts are the ones that travel. Quitting after post 1 abandons the assets that work.

**Marketing voice.** The moment a draft says "excited to announce" or "game-changing," rewrite it as a decision explained. The register that built the library — reasons, trade-offs, numbers — is the register that sells it.

**Not raising the rate.** The entire point of a proof asset is that it changes what the evidence supports. Leaving $8/hr standing after shipping this is the plan defeating itself.
