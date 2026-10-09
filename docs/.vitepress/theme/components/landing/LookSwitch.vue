<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { Button, ButtonGroup } from 'rowkit'
import { readSiteTheme, setSiteTheme, siteTheme, type SiteTheme } from '../site/useSiteTheme'

/**
 * «See the whole site in Windows 98 | Modern», over the live table: the first
 * thing on the page worth pressing. It switches the theme of the whole site —
 * this page and the examples in the docs — and is remembered. Beside it, in
 * the modern theme, the light/dark switch VitePress keeps in its nav bar.
 *
 * rowkit's own toggle buttons: pressed buttons in a group, drawn by whichever
 * theme they switch to.
 */
const looks: { value: SiteTheme; label: string }[] = [
  { value: 'win98', label: 'Windows 98' },
  { value: 'modern', label: 'Modern' },
]

const { isDark } = useData()

onMounted(readSiteTheme)
</script>

<template>
  <div class="flex items-center gap-3 max-md:flex-col max-md:items-start max-md:gap-2">
    <span id="lp-look-label" class="text-[14px] leading-5 text-muted-foreground">
      See the whole site in
    </span>
    <div class="flex items-center gap-1.5">
      <ButtonGroup aria-labelledby="lp-look-label">
        <Button
          v-for="look in looks"
          :key="look.value"
          variant="secondary"
          size="lg"
          :pressed="siteTheme === look.value"
          class="aria-pressed:font-strong"
          @click="setSiteTheme(look.value)"
        >
          {{ look.label }}
        </Button>
      </ButtonGroup>
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label="Dark mode"
        :pressed="isDark"
        class="win98:hidden"
        @click="isDark = !isDark"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.5" />
          <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
        </svg>
      </Button>
    </div>
  </div>
</template>
