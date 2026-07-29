# rowkit

A Vue 3 + TypeScript component library focused on data-dense SaaS interfaces — tables, filters, and the states around them.

Repository: `github.com/NikolaiKushner/rowkit`
Package: `rowkit` on npm
Docs: `rowkit.dev`

Read `ROADMAP.md` before proposing new components. The scope is fixed at twelve components for v1.0.

Read `docs/conventions.md` before designing a component API. Prop naming, state ownership, event and slot shapes, and the recurring accessibility patterns are decided there, once, for every component.

---

## Stack

- **Vue 3.5+** — Composition API, `<script setup>`, TypeScript strict mode
- **Reka UI** — accessible primitives. NEVER hand-roll focus management, ARIA wiring, or keyboard handling when a Reka primitive exists.
- **Tailwind CSS v4** — configured via the `@theme` block in CSS. There is no `tailwind.config.js`.
- **cva** (class-variance-authority) + **tailwind-merge** for variant management
- **Vite library mode** + **vite-plugin-dts** for declaration files
- **Vitest** + **Storybook 9** (`@storybook/addon-vitest`, `@storybook/addon-a11y`)
- **VitePress** for documentation
- **pnpm workspaces** — monorepo with `packages/tokens` and `packages/ui`

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

## Repository structure

```
rowkit/
├── packages/
│   ├── tokens/                    # @rowkit/tokens — standalone
│   │   └── src/
│   │       ├── color.ts
│   │       ├── spacing.ts
│   │       ├── typography.ts
│   │       └── index.ts
│   └── ui/                        # rowkit — the component library
│       ├── src/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── utils/cn.ts
│       │   ├── styles/index.css   # Tailwind v4 @theme block
│       │   └── index.ts           # public barrel export
│       ├── vite.config.ts
│       └── package.json
├── docs/                          # VitePress site
├── playground/                    # Nuxt app for manual testing
├── .storybook/
└── .changeset/
```

### Component file structure

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

A component is not finished until all seven are true:

1. Renders all variants correctly in light and dark mode
2. Full keyboard support, and that support is documented
3. `addon-a11y` passes with zero violations
4. All props typed and JSDoc'd
5. Stories cover every variant and every state
6. Interaction test for the primary behavior
7. Docs page written, including a **"when not to use"** section

---

## Commands

```bash
pnpm dev          # playground app
pnpm storybook    # component workshop
pnpm test         # vitest (unit + component)
pnpm test:a11y    # accessibility checks
pnpm build        # vue-tsc -b && vite build
pnpm docs:dev     # VitePress dev server
pnpm lint         # eslint
pnpm typecheck    # vue-tsc --noEmit
```

---

## How to work with me on this

- **One component per session.** Don't start a second component before the first meets the definition of done.
- **API before implementation.** When I give you a prop interface, build to it exactly. If you think the API is wrong, say so before writing code rather than silently changing it.
- **Ask before adding dependencies.** Every dependency is a maintenance cost and a bundle-size cost.
- **Don't scaffold ahead.** No placeholder files for components we haven't started. Empty stubs rot.
- **When reviewing, list problems without fixing them** unless I ask. I want to decide what matters.

---

## Design decisions already made

Don't re-litigate these:

- **npm package, not copy-paste distribution.** shadcn-vue's model is deliberate and good, but rowkit ships as a versioned package.
- **Reka UI, not shadcn-vue as a dependency.** shadcn-vue is a reference implementation to learn from, not something rowkit installs.
- **Twelve components.** See `ROADMAP.md`.
- **MIT license.**
- **Tokens as a separate package**, so they can be consumed without importing components.
