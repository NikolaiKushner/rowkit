<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DesktopHome from '../home/DesktopHome.vue'
import ExplorerLayout from './ExplorerLayout.vue'
import { finding, openFind } from './useFind'

/**
 * Which screen a page is: the home page is the desktop, a docs page is the
 * Explorer window. The 404 keeps the default layout until its error dialog
 * is built.
 *
 * Find lives here, above both screens: Ctrl+K (⌘K) or / opens it anywhere.
 * Until the Find window from the design is built it is VitePress's own local
 * search, loaded only when first opened.
 */
const { Layout } = DefaultTheme
const { frontmatter, page } = useData()

const VPLocalSearchBox = defineAsyncComponent(
  () => import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue')
)

function onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null
  const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
  if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
    event.preventDefault()
    openFind()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Layout v-if="page.isNotFound" />
  <DesktopHome v-else-if="frontmatter.layout === 'home'" />
  <ExplorerLayout v-else />
  <VPLocalSearchBox v-if="finding" @close="finding = false" />
</template>
