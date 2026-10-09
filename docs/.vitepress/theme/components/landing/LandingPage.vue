<script setup lang="ts">
import LandingCode from './LandingCode.vue'
import LandingComponents from './LandingComponents.vue'
import LandingFaq from './LandingFaq.vue'
import LandingFooter from './LandingFooter.vue'
import LandingHero from './LandingHero.vue'
import LandingStart from './LandingStart.vue'
import LandingThemes from './LandingThemes.vue'
import LandingWhy from './LandingWhy.vue'

/**
 * rowkit.dev's landing page (Figma Site v2, Landing — 1440 and 390, in
 * Windows 98, modern light and modern dark): one page, drawn by whichever
 * rowkit theme the site is in. The theme's tokens do the work; the site's own
 * values — the brand on the modern page, the code colours — are in
 * `landing.css`.
 *
 * Isolated, so rowkit's z-index scale (a table's sticky header at 100) stays
 * under VitePress's nav bar.
 */
</script>

<template>
  <div class="lp isolate bg-(--lp-page) font-sans text-foreground">
    <LandingHero />
    <LandingThemes />
    <LandingComponents />
    <LandingWhy />
    <LandingCode />
    <LandingFaq />
    <LandingStart />
    <LandingFooter />
  </div>
</template>
