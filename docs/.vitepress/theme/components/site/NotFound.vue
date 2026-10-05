<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { Button, Error32Icon, Window, WindowBody, WindowButton, WindowTitleBar } from 'rowkit'
import DesktopIcon from '../home/DesktopIcon.vue'
import { shortcuts } from '../home/shortcuts'
import SiteTaskbar from './SiteTaskbar.vue'
import { openFind } from './useFind'

/**
 * The 404 (Figma Site, template 7): the desktop, and over it Windows 98's
 * «Cannot find…» dialog, named for the path that was asked for. Go to Home is
 * the default button and has focus, as in a system dialog; ✕ goes home too.
 * Below 768px the shortcuts go and the dialog spans the screen, 8px in.
 */
const router = useRouter()

/*
 * The path as Explorer would write it: rowkit:\Components\Datatable. Read on
 * the client, where it is the address typed — the server renders 404.html.
 */
const path = ref('rowkit:\\')
const home = ref<{ $el: HTMLElement }>()

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
  home.value?.$el.focus()
})

const goHome = () => void router.go(withBase('/'))
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-desktop font-sans text-ui">
    <main class="relative flex min-h-0 flex-1 items-center justify-center px-2">
      <nav aria-label="Shortcuts" class="absolute top-4 left-4 flex flex-col gap-3 max-md:hidden">
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
        class="w-[440px] max-w-full"
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
              <h1 class="m-0 text-[13px] leading-4 font-bold break-words text-foreground">
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
    </main>

    <SiteTaskbar task="Error" />
  </div>
</template>
