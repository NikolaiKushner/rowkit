# rowkit

A Vue 3 + TypeScript component library focused on data-dense SaaS interfaces — tables, filters, and the states around them.

Repository: `github.com/NikolaiKushner/rowkit`
Package: `rowkit` on npm
Docs: `rowkit.dev`

Read `NEXT.md` before proposing work. The backlog is polish, proof, process,
and new surface when it earns its place — no fixed component count.

**Visual direction:** restraint, structure without severity, no excess. Neutral chrome; warm-espresso primary (`oklch(0.31 0.038 48)`), not a chromatic shout. Consumers rebrand via tokens — defaults must not fight them. Geist stays.

Read `docs/conventions.md` before designing a component API. Prop naming, state ownership, event and slot shapes, and the recurring accessibility patterns are decided there, once, for every component.

---

## Stack

- **Reka UI** — accessible primitives. NEVER hand-roll focus management, ARIA wiring, or keyboard handling when a Reka primitive exists.
- **Tailwind CSS v4** — configured via the `@theme` block in CSS. There is no `tailwind.config.js`.
- **Vitest** + **Storybook 10** (`@storybook/addon-vitest`, `@storybook/addon-a11y` as a gate, not a panel). Storybook 10, not 9: `@storybook/vue3-vite@9` peers on Vite 7 and this repo is on Vite 8.

---

## Hard rules

These are not preferences. Violating them means the work gets redone.

1. **No hardcoded design values.** Every color, spacing value, radius, shadow, and z-index references a token. If a token doesn't exist for what you need, propose adding one — don't inline a value.
2. **Build on Reka UI primitives** wherever one exists for the component's behavior.
3. **Variants live in `ComponentName.variants.ts`**, defined with `cva`. Never inline long class strings in the template.
4. **Every prop has a JSDoc comment.** These feed both the docs site and `AGENTS.md`.
5. **`vue` is external.** Never bundle the framework into the library output.
6. **Every public API change requires a changeset.**
7. **No `any`.** TypeScript strict is on for a reason. If typing is genuinely hard, ask rather than escaping the type system.
8. **Components accept `class` and forward it** via `tailwind-merge`, so consumers can override styling without fighting specificity.

---

## Component file structure

Every component follows this shape, no exceptions:

```
components/ComponentName/
  ComponentName.vue
  ComponentName.variants.ts
  ComponentName.stories.ts
  ComponentName.test.ts
  index.ts
```

---

## Definition of done for a component

A component is not finished until all eight are true:

1. Renders all variants correctly in light and dark mode
2. Full keyboard support, and that support is documented
3. `addon-a11y` passes with zero violations
4. All props typed and JSDoc'd
5. Stories cover every variant and every state
6. Interaction test for the primary behavior
7. Docs page written, including a **"when not to use"** section
8. **Visual QA:** `pnpm visual:check <Component>` (Storybook must be running), then **Read the PNGs** and fix anything that looks wrong in light or dark. Green tests are not enough.

---

## How to work with me on this

- **One concern per session.** Don't start a second polish cluster before the first is done.
- **API before implementation.** When I give you a prop interface, build to it exactly. If you think the API is wrong, say so before writing code rather than silently changing it.
- **Ask before adding dependencies.** Every dependency is a maintenance cost and a bundle-size cost.
- **Don't scaffold ahead.** No placeholder files for components we haven't started. Empty stubs rot.
- **When reviewing, list problems without fixing them** unless I ask. I want to decide what matters.
- **Look at the pixels.** After UI changes, screenshot and inspect. Do not claim "looks fine" from code alone.

---

## Design decisions already made

Don't re-litigate these:

- **npm package, not copy-paste distribution.** shadcn-vue's model is deliberate and good, but rowkit ships as a versioned package.
- **Reka UI, not shadcn-vue as a dependency.** shadcn-vue is a reference implementation to learn from, not something rowkit installs.
- **No fixed component count.** Add components when they earn a place on a data-dense surface; do not invent for breadth.
- **MIT license.**
- **Tokens as a separate package**, so they can be consumed without importing components.
