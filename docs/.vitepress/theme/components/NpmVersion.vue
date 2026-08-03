<script setup lang="ts">
import { version } from 'rowkit'

/**
 * The published version, read from the package rather than typed into prose.
 *
 * Both places this appears make a claim about npm — "vX is on npm" — and a
 * literal in markdown starts lying the moment a release lands. It already did:
 * the site said `v0.1.0` for a day after `0.1.1` was published, and nothing
 * anywhere flagged it, because prose has no build step that can disagree with
 * it.
 *
 * `version` is derived from `package.json` at build time, so this renders
 * whatever the docs were built against. `docs:build` builds the packages first
 * for exactly that reason — reading it from a stale `dist` would reintroduce
 * the drift with extra steps.
 */
</script>

<template>
  <span class="rk-version">v{{ version }}</span>
</template>
