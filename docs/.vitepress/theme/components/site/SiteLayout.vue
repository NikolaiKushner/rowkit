<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DesktopHome from '../home/DesktopHome.vue'
import ExplorerLayout from './ExplorerLayout.vue'

/**
 * Which screen a page is: the home page is the desktop, a docs page is the
 * Explorer window. The 404 keeps the default layout until its error dialog
 * is built.
 */
const { Layout } = DefaultTheme
const { frontmatter, page } = useData()
</script>

<template>
  <Layout v-if="page.isNotFound" />
  <DesktopHome v-else-if="frontmatter.layout === 'home'" />
  <ExplorerLayout v-else />
</template>
