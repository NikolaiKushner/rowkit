<script setup lang="ts">
/**
 * Extends VitePress's default layout so the home page can replace the stock
 * hero with rowkit's branded composition, while every other page stays default.
 */
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomePage from './HomePage.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template v-if="frontmatter.layout === 'home'" #home-hero-before>
      <HomePage />
    </template>
  </Layout>
</template>
