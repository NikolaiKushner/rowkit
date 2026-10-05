<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from '../HomePage.vue'
import ExplorerLayout from './ExplorerLayout.vue'

/**
 * Which screen a page is. A docs page is the Explorer window. The home page
 * and the 404 keep the default layout until their own screens — the desktop
 * and the error dialog — are built.
 */
const { Layout } = DefaultTheme
const { frontmatter, page } = useData()
</script>

<template>
  <ExplorerLayout v-if="frontmatter.layout !== 'home' && !page.isNotFound" />
  <Layout v-else>
    <template v-if="frontmatter.layout === 'home'" #home-hero-before>
      <HomePage />
    </template>
  </Layout>
</template>
