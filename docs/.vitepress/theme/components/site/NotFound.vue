<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import {
  Button,
  Error32Icon,
  WarningIcon,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import DesktopIcon from '../home/DesktopIcon.vue'
import { shortcuts } from '../home/shortcuts'
import SiteDock from './SiteDock.vue'
import SiteTaskbar from './SiteTaskbar.vue'
import SiteWallpaper from './SiteWallpaper.vue'
import { openFind } from './useFind'

/**
 * The 404 (Figma Site, template 7): the desktop, and over it Windows 98's
 * «Cannot find…» dialog, named for the path that was asked for. Go to Home is
 * the default button and has focus, as in a system dialog; ✕ goes home too.
 * Below 768px the shortcuts go and the dialog spans the screen, 8px in.
 *
 * Modern (Figma SiteModern/Alert/NotFound): an alert card on the wallpaper —
 * the app icon with a warning badge, «Page not found», the address that was
 * asked for, and the two ways on, one under the other — and the Dock.
 */
const router = useRouter()

/*
 * The path as Explorer would write it: rowkit:\Components\Datatable. Read on
 * the client, where it is the address typed — the server renders 404.html.
 */
const path = ref('rowkit:\\')
// The same address as a browser shows it, for the modern alert.
const address = ref('')
const home = ref<{ $el: HTMLElement }>()
const homeModern = ref<{ $el: HTMLElement }>()

onMounted(() => {
  const base = withBase('/')
  const rest = decodeURIComponent(window.location.pathname)
    .slice(window.location.pathname.startsWith(base) ? base.length : 1)
    .replace(/(\.html|\/)$/, '')
  path.value = `rowkit:\\${rest
    .split('/')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('\\')}`
  address.value = `${window.location.host}${decodeURIComponent(window.location.pathname)}`
  // Whichever drawing is on screen: the other is hidden by its theme.
  ;[home.value?.$el, homeModern.value?.$el].find((el) => el?.offsetParent)?.focus()
})

const goHome = () => void router.go(withBase('/'))
</script>

<template>
  <div
    class="rk-desktop relative isolate flex h-dvh flex-col overflow-hidden bg-desktop font-sans text-ui"
  >
    <SiteWallpaper />
    <main class="relative flex min-h-0 flex-1 items-center justify-center px-2">
      <nav
        aria-label="Shortcuts"
        class="absolute top-4 left-4 flex flex-col gap-3 max-md:hidden modern:hidden"
      >
        <DesktopIcon
          v-for="item in shortcuts.slice(0, 5)"
          :key="item.label"
          :label="item.label"
          :href="item.href"
        >
          <component :is="item.icon" />
        </DesktopIcon>
      </nav>

      <Window
        role="alertdialog"
        aria-describedby="rk-not-found-message"
        class="w-[440px] max-w-full modern:hidden"
      >
        <WindowTitleBar :title="path">
          <template #controls>
            <WindowButton glyph="close" label="Close and go to the home page" @click="goHome" />
          </template>
        </WindowTitleBar>
        <WindowBody class="flex flex-col gap-3 p-3">
          <div class="flex items-start gap-3">
            <Error32Icon class="shrink-0" />
            <div id="rk-not-found-message" class="flex min-w-0 flex-1 flex-col gap-1.5">
              <h1 class="m-0 text-heading font-bold break-words text-foreground">
                Cannot find '{{ path }}'.
              </h1>
              <p class="m-0 text-ui text-foreground">
                Make sure the path is spelled correctly. The page may have moved — try Find, or go
                to the home page.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-1.5">
            <Button ref="home" as="a" :href="withBase('/')" class="max-md:min-w-[88px] max-md:px-4">
              Go to Home
            </Button>
            <Button variant="secondary" class="max-md:min-w-[88px] max-md:px-4" @click="openFind">
              Find…
            </Button>
          </div>
        </WindowBody>
      </Window>

      <!-- Lifted over the Dock: centred in what it leaves, as the design places it. -->
      <section
        role="alertdialog"
        aria-labelledby="rk-not-found-title-modern"
        aria-describedby="rk-not-found-message-modern"
        class="flex w-[280px] max-w-full flex-col items-center gap-2.5 rounded-xl md:mb-[62px] bg-card px-5 pt-6 pb-5 text-center shadow-window win98:hidden"
      >
        <span class="relative mb-3.5 size-16">
          <span
            class="absolute inset-0 flex items-center justify-center rounded-xl bg-card shadow-raised"
          >
            <img :src="withBase('/mark-48.svg')" alt="" width="48" height="48" class="block" />
          </span>
          <span
            class="absolute top-10 left-[43px] flex size-7 items-center justify-center rounded-full bg-card [&_svg]:size-[26px]"
          >
            <WarningIcon />
          </span>
        </span>
        <h1 id="rk-not-found-title-modern" class="m-0 text-heading font-strong text-foreground">
          Page not found
        </h1>
        <p id="rk-not-found-message-modern" class="m-0 text-ui break-words text-muted-foreground">
          {{ address || 'This page' }} doesn’t exist. It may have moved or been renamed.
        </p>
        <div class="flex w-full flex-col gap-2 pt-2">
          <Button ref="homeModern" as="a" :href="withBase('/')" class="w-full">Go to Home</Button>
          <Button variant="secondary" class="w-full" @click="openFind">Search the docs…</Button>
        </div>
      </section>

      <SiteDock
        class="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 max-md:hidden win98:hidden"
      />
    </main>

    <SiteTaskbar task="Error" />
  </div>
</template>
