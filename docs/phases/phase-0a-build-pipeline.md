# Phase 0a — Build Pipeline

**Status:** ✅ complete
**Deliverable:** a monorepo where a `.vue` component builds to typed ESM, and the packed artifact installs and typechecks in a fresh project
**Effort:** ~8h

This phase produced nothing visible and determined whether the project survives. Every later phase assumes the pipeline verified here; none of them re-checks it.

---

## Scope

- pnpm workspace monorepo: `packages/tokens`, `packages/ui`, `playground/`
- Vite library mode for both packages, `vite-plugin-dts` for declarations
- TypeScript strict mode; per-package `tsconfig.lib.json` for builds
- ESLint + Prettier; Vitest
- `playground/` — a Nuxt app consuming `rowkit` via `workspace:*`
- Git hygiene: `.gitignore` covering `dist/`, `node_modules/`, `*.tsbuildinfo`, `.claude/settings.local.json`

## Verification protocol (what "the pipeline works" meant)

A throwaway `Hello.vue` (typed props with JSDoc, importing `@rowkit/tokens`) was run through the full chain, then deleted:

1. `.vue` → `.d.ts` emits typed props with JSDoc comments preserved
2. `vue` stays external — output contains a bare `import { computed } from "vue"`, framework not bundled
3. The packed tarball (`npm pack`) installs into a fresh project; `import { Hello } from 'rowkit'` typechecks
4. Types are load-bearing, not decorative: passing a wrong prop type fails compilation

`packages/*/src/index.ts` holds only a `version` export with a test asserting it matches `package.json` — real content for the build to chew on, no scaffolding ahead.

## Decisions made here (recorded in CLAUDE.md; do not re-litigate)

- **TypeScript pinned to 6.0.3, not 7.** `typescript-eslint@8` declares `typescript: >=4.8.4 <6.1.0`; TS 7 would mean dropping type-aware linting. Revisit when typescript-eslint ships TS 7 support — check quarterly.
- **No `tsc` project references between packages.** A referenced project may not disable emit (TS6310) and `paths`-to-source is illegal under `composite` (TS6307). Each package typechecks standalone; `ui` resolves `@rowkit/tokens` through the pnpm symlink to its built `dist` — the same shape consumers get. **Consequence: tokens must build before ui.** `pnpm build` orders this via the workspace dependency; CI builds tokens before typechecking.
- **`vue-tsc -b` is a typecheck gate, not an emitter.** Both `tsconfig.lib.json` are `noEmit`; `vite-plugin-dts` flips emit on for declarations only. Type errors therefore fail the build without double emit.
- **`declarationMap` off.** `cleanVueFileName` renames `Hello.vue.d.ts` → `Hello.d.ts` without rewriting `sourceMappingURL`, leaving a dangling reference — and maps were useless anyway since `files: ["dist"]` ships no source.
- **ESM-only output** (`formats: ['es']`). Standard for a Vue 3 library in 2026; CJS added only if a real consumer presents a real need.
- **`vue/multi-word-component-names` disabled for `packages/ui/src`.** The rule prevents app components clashing with HTML elements; `Button`/`Badge`/`Dialog` are deliberate library names.

## Tooling added at the end of the phase (chore/tooling PR)

- **Pre-commit hook** (husky + lint-staged): `eslint --fix` then `prettier --write` on staged `.ts`/`.vue`; Prettier alone on `.js/.json/.yaml/.yml/.css/.md` with `--ignore-unknown`. Verified against a real staged file: auto-fix re-stages the fixed version; an unfixable violation (`const bad: any = 1`) blocks the commit and reverts cleanly. Typecheck deliberately NOT in the hook — it can't run per-file; CI covers it.
- **CI** (`.github/workflows/ci.yml`): full gate on PR and push to main — lint → format:check → typecheck → test → build, build last as the slowest. `concurrency` with cancel-in-progress; `permissions: contents: read`. Node pinned via `.nvmrc` (Node 24) so CI and local shells share one source of truth; pnpm's version comes from the `packageManager` field.
- **Branch protection on `main`:** required status checks, up-to-date branches. No required reviews (solo maintainer).

## Definition of Done — met

- [x] Throwaway component builds, emits correct `.d.ts`, imports with working types in the playground
- [x] Packed tarball installs and typechecks in a fresh project
- [x] Pre-commit hook verified against real staged files (both fix and block paths)
- [x] CI green on the scaffolding PR; branch protection enabled after first run

## Lesson recorded

The phase went to plan with one process error worth remembering: an early commit landed on `main` directly before the branch workflow was established. Not rewritten — history stays honest — but everything after Phase 0a goes through PRs.
