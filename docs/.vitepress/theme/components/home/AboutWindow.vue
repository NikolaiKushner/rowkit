<script setup lang="ts">
import { withBase } from 'vitepress'
import { Button, version, Window, WindowBody, WindowButton, WindowTitleBar } from 'rowkit'
import ThemeSwitch from '../site/ThemeSwitch.vue'

/**
 * The About window on the home page: the mark, what rowkit is, the version,
 * the two ways in — and, in the modern theme, the look switch along the
 * bottom (Figma SiteModern/Window/About). On the desktop and in the phone's
 * stack of windows alike.
 */
defineEmits<{ close: [] }>()
</script>

<template>
  <Window>
    <WindowTitleBar title="About rowkit">
      <template #icon>
        <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
      </template>
      <template #controls>
        <!-- Modern draws all three lights on every window; Windows 98, close alone. -->
        <WindowButton
          glyph="minimize"
          label="Minimize About rowkit"
          class="win98:hidden"
          @click="$emit('close')"
        />
        <WindowButton glyph="maximize" label="Maximize" disabled class="win98:hidden" />
        <WindowButton glyph="close" label="Close About rowkit" @click="$emit('close')" />
      </template>
    </WindowTitleBar>
    <WindowBody class="flex items-start gap-4 p-4 modern:p-5">
      <span
        class="shrink-0 modern:flex modern:h-16 modern:items-center modern:rounded-xl modern:bg-card modern:shadow-raised"
      >
        <img :src="withBase('/mark-48.svg')" alt="" width="48" height="48" class="block" />
      </span>
      <div class="flex flex-col gap-2">
        <img :src="withBase('/logo.svg')" alt="rowkit" width="160" height="32" />
        <p class="m-0 text-doc text-foreground">
          A professional Vue 3 toolkit — the components a product interface is built from.
        </p>
        <p class="m-0 text-muted-foreground modern:text-text-subtle">
          Version {{ version }} on npm · MIT licence
        </p>
        <div class="flex gap-1.5 modern:gap-2 modern:pt-1.5">
          <Button as="a" :href="withBase('/installation')">Get started</Button>
          <Button as="a" :href="withBase('/components/')" variant="secondary"> Components </Button>
        </div>
      </div>
    </WindowBody>
    <!-- The look switch again, where About says what the toolkit is. Modern only. -->
    <div
      class="flex items-center gap-3 border-t border-border bg-background px-5 pt-3 pb-3.5 win98:hidden"
    >
      <span class="font-strong text-foreground">Look</span>
      <ThemeSwitch />
    </div>
  </Window>
</template>
