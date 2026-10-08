<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, useRoute, useRouter, withBase, type DefaultTheme } from 'vitepress'
import {
  ArrowLeft32Icon,
  ArrowRight32Icon,
  ArrowUp32Icon,
  Button,
  ScrollArea,
  Search32Icon,
  SearchIcon,
  Separator,
  StatusBar,
  StatusBarSection,
  TriangleLeftIcon,
  TriangleRightIcon,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import FolderTree from './FolderTree.vue'
import { searchShortcut } from './menu'
import { openFind } from './useFind'
import PageHeader from './PageHeader.vue'
import PageOutline from './PageOutline.vue'
import SiteAddressBar from './SiteAddressBar.vue'
import SiteMenuBar from './SiteMenuBar.vue'
import SiteTaskbar from './SiteTaskbar.vue'
import SiteToolbarButton from './SiteToolbarButton.vue'
import { siteTheme } from './useSiteTheme'
import { canGoBack, canGoForward, normalize, recordVisit, stepOf, useSiteNav } from './useSiteNav'
import SiteWallpaper from './SiteWallpaper.vue'

/**
 * A docs page as a Windows 98 Explorer window, maximized above the taskbar:
 * menu bar, toolbar, address bar, the folder tree and the page, and a status
 * bar. Only the panes scroll — the window itself never does.
 */
const { page, theme, frontmatter } = useData<DefaultTheme.Config>()
const route = useRoute()
const router = useRouter()
const { tree, pages, current, up } = useSiteNav()

const title = computed(() => String(frontmatter.value.title ?? page.value.title ?? 'rowkit'))

// The search field's shortcut as this platform writes it; the server cannot know.
const shortcut = ref('⌘K')
onMounted(() => (shortcut.value = searchShortcut()))
const windowTitle = computed(() => `${title.value} — rowkit`)

const editLink = computed(() => {
  const pattern = theme.value.editLink?.pattern
  return typeof pattern === 'string'
    ? pattern.replace(/:path/g, page.value.relativePath)
    : undefined
})

const lastUpdated = computed(() => {
  const at = page.value.lastUpdated
  return at === undefined ? undefined : new Date(at).toISOString().slice(0, 10)
})

/*
 * The page scrolls inside its pane, so the router's own scrolling — which
 * moves the window — does nothing here. A new page starts at the top; a hash
 * scrolls its heading into view inside the pane.
 */
const contentArea = ref<{ viewport?: HTMLElement }>()

function scrollToHash(hash: string): void {
  const viewport = contentArea.value?.viewport
  if (!viewport) return
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  if (target) target.scrollIntoView({ block: 'start' })
  else viewport.scrollTop = 0
}

let popped = false
const onPopState = () => {
  popped = true
}
const onHashChange = () => scrollToHash(location.hash)

// The tree over the page on a phone, in the modern theme; it goes when a page opens.
const sidebarOpen = ref(false)

watch(
  () => route.path,
  (path) => {
    sidebarOpen.value = false
    const here = normalize(path)
    recordVisit(here, popped ? stepOf(here) : 'push')
    popped = false
    void nextTick(() => scrollToHash(location.hash))
  }
)

onMounted(() => {
  recordVisit(normalize(route.path), 'push')
  window.addEventListener('popstate', onPopState)
  window.addEventListener('hashchange', onHashChange)
  scrollToHash(location.hash)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState)
  window.removeEventListener('hashchange', onHashChange)
})

const toDesktop = () => void router.go(withBase('/'))
const goBack = () => history.back()
const goForward = () => history.forward()
</script>

<template>
  <div class="rk-desktop relative isolate flex h-dvh flex-col overflow-hidden bg-background">
    <SiteWallpaper />
    <Window
      class="min-h-0 flex-1 modern:m-3 modern:isolate modern:max-md:m-0 modern:max-md:rounded-none modern:max-md:shadow-none"
    >
      <!--
        The modern window has no title bar of its own: Finder draws the caption
        buttons in its toolbar. The title bar stays, out of sight, as the
        window's name.
      -->
      <WindowTitleBar :title="windowTitle" class="modern:sr-only">
        <template #icon>
          <img :src="withBase('/mark-win98-16.png')" alt="" width="16" height="16" />
        </template>
        <template v-if="siteTheme !== 'modern'" #controls>
          <WindowButton glyph="minimize" label="Minimize to the desktop" @click="toDesktop" />
          <WindowButton glyph="maximize" label="Maximize" disabled />
          <WindowButton glyph="close" label="Close and go to the desktop" @click="toDesktop" />
        </template>
      </WindowTitleBar>

      <!-- On a phone the Start menu is the navigation, as Figma's 390px templates draw it. -->
      <!-- In the modern theme the menus live in the menu bar at the top of the screen. -->
      <SiteMenuBar v-if="siteTheme !== 'modern'" class="max-md:hidden modern:hidden" />
      <Separator decorative class="max-md:hidden modern:hidden" />

      <div
        role="toolbar"
        aria-label="Navigation"
        class="flex h-[58px] shrink-0 items-start gap-0.5 px-1 pt-px modern:hidden"
      >
        <SiteToolbarButton label="Back" :disabled="!canGoBack" @click="goBack">
          <ArrowLeft32Icon />
        </SiteToolbarButton>
        <SiteToolbarButton
          label="Forward"
          :disabled="!canGoForward"
          class="max-md:hidden"
          @click="goForward"
        >
          <ArrowRight32Icon />
        </SiteToolbarButton>
        <SiteToolbarButton label="Up" class="max-md:hidden" @click="router.go(withBase(up))">
          <ArrowUp32Icon />
        </SiteToolbarButton>
        <Separator orientation="vertical" decorative class="mt-1 h-[47px] self-start" />
        <SiteToolbarButton label="Find" @click="openFind">
          <Search32Icon />
        </SiteToolbarButton>
      </div>
      <Separator decorative class="modern:hidden" />

      <SiteAddressBar :pages="pages" :current="current" class="modern:hidden" />

      <!--
        The modern toolbar, as a Finder window draws it (Figma SiteModern/Window/Finder):
        the caption buttons, history, where you are, and search, in one 52px row.
      -->
      <div
        class="group/titlebar flex h-[52px] shrink-0 items-center gap-2 bg-titlebar-from pr-3 pl-[18px] shadow-titlebar max-md:h-12 max-md:px-1.5 win98:hidden"
      >
        <span
          class="flex shrink-0 items-center gap-caption-gap pr-3.5 max-md:hidden [&>[data-glyph=close]]:order-(--rk-close-order)"
        >
          <WindowButton glyph="minimize" label="Minimize to the desktop" @click="toDesktop" />
          <WindowButton glyph="maximize" label="Maximize" disabled />
          <WindowButton glyph="close" label="Close and go to the desktop" @click="toDesktop" />
        </span>
        <div
          role="toolbar"
          aria-label="Navigation"
          class="flex min-w-0 flex-1 items-center gap-2 max-md:gap-0.5"
        >
          <!-- On a phone (Figma Component page, 390) the tree slides over the page from here. -->
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Contents"
            :aria-expanded="sidebarOpen"
            aria-controls="rk-sidebar"
            class="md:hidden"
            @click="sidebarOpen = !sidebarOpen"
          >
            <span
              aria-hidden="true"
              class="block size-4 bg-current [mask-size:contain]"
              :style="{ maskImage: `url(${withBase('/icons/modern/sidebar.svg')})` }"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Back"
            :disabled="!canGoBack"
            @click="goBack"
          >
            <TriangleLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Forward"
            :disabled="!canGoForward"
            class="max-md:hidden"
            @click="goForward"
          >
            <TriangleRightIcon />
          </Button>
          <span
            class="min-w-0 truncate text-heading font-strong text-foreground max-md:flex-1 max-md:text-center"
            >{{ title }}</span
          >
          <span class="flex-1 max-md:hidden" />
          <!-- Figma SiteModern/SearchField: a field to look at, a button underneath — it opens search. -->
          <button
            type="button"
            aria-keyshortcuts="Meta+K Control+K"
            class="flex h-7 w-[200px] shrink-0 items-center gap-1.5 rounded-[7px] bg-input pr-1.5 pl-2 text-left text-ui text-text-subtle shadow-[inset_0_1px_1px_rgb(0_0_0/0.04),inset_0_0_0_1px_#86868b] outline-none focus-visible:focus-outer max-md:size-7 max-md:justify-center max-md:bg-transparent max-md:p-0 max-md:text-foreground max-md:shadow-none max-md:hover:bg-control-ghost-hover"
            @click="openFind"
          >
            <SearchIcon class="size-3.5 shrink-0" />
            <span class="flex-1 max-md:sr-only">Search</span>
            <kbd
              class="rounded-[4px] bg-control-latched px-[5px] py-px font-sans text-ui text-muted-foreground max-md:hidden"
              >{{ shortcut }}</kbd
            >
          </button>
        </div>
      </div>

      <WindowBody class="relative flex min-h-0 gap-1 p-0.5 modern:gap-0 modern:p-0">
        <!--
          Below 768px the tree gives way to the page; the address bar still
          lists every page. In the modern theme the Contents button slides it
          back over the page.
        -->
        <ScrollArea
          id="rk-sidebar"
          class="w-[260px] shrink-0 bg-input p-0.5 shadow-sunken max-md:hidden modern:w-[240px] modern:bg-muted modern:px-2 modern:pt-3 modern:pb-2 modern:shadow-[inset_-1px_0_0_var(--color-border)]"
          :class="
            sidebarOpen &&
            'modern:max-md:absolute modern:max-md:inset-y-0 modern:max-md:left-0 modern:max-md:z-20 modern:max-md:block modern:max-md:w-[280px] modern:max-md:shadow-[0_10px_30px_rgb(0_0_0/0.25)]!'
          "
          @keydown.esc="sidebarOpen = false"
        >
          <FolderTree :tree="tree" :current="current" />
        </ScrollArea>
        <ScrollArea
          ref="contentArea"
          :label="title"
          class="min-w-0 flex-1 bg-input p-0.5 shadow-sunken modern:p-0 modern:shadow-none"
        >
          <!--
            Text wraps at the pane's width whatever is inside: without
            `contain`, one wide demo would widen the page and every paragraph
            with it. A wide element overflows on its own instead.

            The header spans the page; under it, the text and «On this page»,
            868px and 200px with 32px between at full width, as in Figma.
            Narrower, «On this page» is a drop-down under the header, and on
            a phone the page sits 12px in, as the 390px templates draw it.
          -->
          <div
            class="max-w-[1100px] px-3 pt-3 pb-6 contain-inline-size md:p-6 modern:p-5 modern:md:px-10 modern:md:pt-7 modern:md:pb-10"
          >
            <PageHeader :title="title" :current="current" />
            <PageOutline as="select" :scroller="contentArea?.viewport" class="mt-4 xl:hidden" />
            <div class="grid xl:mt-6 grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_200px]">
              <main class="vp-doc rk-page min-w-0">
                <Content />
              </main>
              <aside class="sticky top-0 self-start max-xl:hidden">
                <PageOutline :scroller="contentArea?.viewport" />
              </aside>
            </div>
          </div>
        </ScrollArea>
      </WindowBody>

      <!-- Modern (Figma Finder footer): the edit link in the link colour, the rest in grey. -->
      <StatusBar class="modern:h-[26px] modern:px-4 modern:max-md:hidden">
        <StatusBarSection>
          <a
            v-if="editLink"
            :href="editLink"
            target="_blank"
            rel="noreferrer"
            class="text-foreground no-underline modern:text-link"
          >
            {{ theme.editLink?.text ?? 'Edit this page' }}
          </a>
        </StatusBarSection>
        <StatusBarSection
          v-if="lastUpdated"
          class="w-[170px] max-md:hidden modern:w-auto modern:text-text-subtle"
        >
          Last updated: {{ lastUpdated }}<span class="win98:hidden">&nbsp;· MIT</span>
        </StatusBarSection>
        <StatusBarSection :class="lastUpdated ? 'modern:hidden' : 'modern:text-text-subtle'"
          >MIT</StatusBarSection
        >
      </StatusBar>
    </Window>
    <SiteTaskbar :task="windowTitle" />
  </div>
</template>
