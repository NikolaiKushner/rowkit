<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { Content, useData, useRoute, useRouter, withBase, type DefaultTheme } from 'vitepress'
import {
  ArrowLeft32Icon,
  ArrowRight32Icon,
  ArrowUp32Icon,
  ScrollArea,
  Search32Icon,
  Separator,
  StatusBar,
  StatusBarSection,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import FolderTree from './FolderTree.vue'
import SiteAddressBar from './SiteAddressBar.vue'
import SiteMenuBar from './SiteMenuBar.vue'
import SiteTaskbar from './SiteTaskbar.vue'
import SiteToolbarButton from './SiteToolbarButton.vue'
import { canGoBack, canGoForward, normalize, recordVisit, stepOf, useSiteNav } from './useSiteNav'

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

watch(
  () => route.path,
  (path) => {
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

/*
 * Find opens VitePress's own local search until the Find window from the
 * design replaces it. Loaded on demand: the index is only fetched when used.
 */
const VPLocalSearchBox = defineAsyncComponent(
  () => import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue')
)
const searching = ref(false)
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-background">
    <Window class="min-h-0 flex-1">
      <WindowTitleBar :title="windowTitle">
        <template #icon>
          <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
        </template>
        <template #controls>
          <WindowButton glyph="minimize" label="Minimize to the desktop" @click="toDesktop" />
          <WindowButton glyph="maximize" label="Maximize" disabled />
          <WindowButton glyph="close" label="Close and go to the desktop" @click="toDesktop" />
        </template>
      </WindowTitleBar>

      <SiteMenuBar />
      <Separator decorative />

      <div
        role="toolbar"
        aria-label="Navigation"
        class="flex h-[55px] shrink-0 items-start gap-0.5 px-1 pt-px"
      >
        <SiteToolbarButton label="Back" :disabled="!canGoBack" @click="goBack">
          <ArrowLeft32Icon />
        </SiteToolbarButton>
        <SiteToolbarButton label="Forward" :disabled="!canGoForward" @click="goForward">
          <ArrowRight32Icon />
        </SiteToolbarButton>
        <SiteToolbarButton label="Up" @click="router.go(withBase(up))">
          <ArrowUp32Icon />
        </SiteToolbarButton>
        <Separator orientation="vertical" decorative class="mt-1 h-11 self-start" />
        <SiteToolbarButton label="Find" @click="searching = true">
          <Search32Icon />
        </SiteToolbarButton>
      </div>
      <Separator decorative />

      <SiteAddressBar :pages="pages" :current="current" />

      <WindowBody class="flex min-h-0 gap-1 p-0.5">
        <!-- Below 768px the tree gives way to the page; the address bar still lists every page. -->
        <ScrollArea class="w-[220px] shrink-0 bg-input p-0.5 shadow-sunken max-md:hidden">
          <FolderTree :tree="tree" :current="current" />
        </ScrollArea>
        <ScrollArea
          ref="contentArea"
          :label="title"
          class="min-w-0 flex-1 bg-input p-0.5 shadow-sunken"
        >
          <!--
            Text wraps at the pane's width whatever is inside: without
            `contain`, one wide demo would widen the page and every paragraph
            with it. A wide element overflows on its own instead.
          -->
          <main class="vp-doc px-6 py-6 contain-inline-size">
            <Content />
          </main>
        </ScrollArea>
      </WindowBody>

      <StatusBar>
        <StatusBarSection>
          <a
            v-if="editLink"
            :href="editLink"
            target="_blank"
            rel="noreferrer"
            class="text-foreground no-underline"
          >
            {{ theme.editLink?.text ?? 'Edit this page' }}
          </a>
        </StatusBarSection>
        <StatusBarSection v-if="lastUpdated" class="w-[130px]">
          Last updated: {{ lastUpdated }}
        </StatusBarSection>
        <StatusBarSection>MIT</StatusBarSection>
      </StatusBar>
    </Window>
    <SiteTaskbar :task="windowTitle" />
    <VPLocalSearchBox v-if="searching" @close="searching = false" />
  </div>
</template>
