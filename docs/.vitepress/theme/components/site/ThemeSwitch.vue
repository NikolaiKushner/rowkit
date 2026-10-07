<script setup lang="ts">
import { Button } from 'rowkit'
import { setSiteScheme, setSiteTheme, siteScheme, siteTheme, type SiteScheme } from './useSiteTheme'

/**
 * The site's theme switch: Windows 98 or modern, and for the modern theme its
 * colour scheme. Sits in the Windows 98 taskbar tray and in the modern menu
 * bar — the same control, drawn by whichever theme is on.
 */
const NEXT: Record<SiteScheme, SiteScheme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<SiteScheme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }
</script>

<template>
  <div role="group" aria-label="Theme" class="flex shrink-0 items-center gap-0.5">
    <Button
      size="xs"
      variant="ghost"
      :pressed="siteTheme === 'win98'"
      class="min-w-0"
      @click="setSiteTheme('win98')"
      >Windows 98</Button
    >
    <Button
      size="xs"
      variant="ghost"
      :pressed="siteTheme === 'modern'"
      class="min-w-0"
      @click="setSiteTheme('modern')"
      >Modern</Button
    >
    <Button
      v-if="siteTheme === 'modern'"
      size="xs"
      variant="ghost"
      class="min-w-0"
      :aria-label="`Colour scheme: ${LABEL[siteScheme]}. Change`"
      @click="setSiteScheme(NEXT[siteScheme])"
      >{{ LABEL[siteScheme] }}</Button
    >
  </div>
</template>
