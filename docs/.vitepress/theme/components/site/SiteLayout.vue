<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useData } from 'vitepress'
import DesktopHome from '../home/DesktopHome.vue'
import ExplorerLayout from './ExplorerLayout.vue'
import FindWindow from './FindWindow.vue'
import NotFound from './NotFound.vue'
import { openFind } from './useFind'

/**
 * Which screen a page is: the home page is the desktop, a docs page is the
 * Explorer window, a missing page the «Cannot find…» dialog on the desktop.
 *
 * Find lives here, above both screens: Ctrl+K (⌘K) or / opens it anywhere.
 */
const { frontmatter, page } = useData()

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
  <NotFound v-if="page.isNotFound" />
  <DesktopHome v-else-if="frontmatter.layout === 'home'" />
  <ExplorerLayout v-else />
  <FindWindow />
</template>
