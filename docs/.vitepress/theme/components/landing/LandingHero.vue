<script setup lang="ts">
import { withBase } from 'vitepress'
import { Button } from 'rowkit'
import InstallCommand from './InstallCommand.vue'
import LandingDemo from './LandingDemo.vue'
import LookSwitch from './LookSwitch.vue'
import { SOURCE } from './links'

/**
 * The first screen: what rowkit is, how to install it, and the live table
 * with the switch that redraws the whole site in the other theme.
 */
</script>

<template>
  <section aria-labelledby="lp-title" class="px-5 pt-10 pb-16 md:px-6 md:pt-24 md:pb-28">
    <div
      class="mx-auto flex max-w-[820px] flex-col items-start gap-6 md:items-center md:text-center"
    >
      <p
        class="flex items-center gap-2 px-2.5 py-[5px] text-[14px] leading-5 font-semibold modern:rounded-full modern:bg-(--lp-accent-soft) modern:text-(--lp-accent-on-soft) win98:bg-white win98:text-[#000080]"
      >
        <span class="size-2 rounded-full bg-[#d63a1f]" aria-hidden="true" />
        1.0 beta · Vue 3 · TypeScript
      </p>
      <h1
        id="lp-title"
        class="text-[36px] leading-[1.12] font-semibold tracking-[-0.02em] text-foreground md:text-[52px] md:leading-[1.1] win98:font-bold"
      >
        Vue 3 components for <span class="lp-headline-accent">product interfaces</span>
      </h1>
      <p
        class="max-w-[680px] text-[17px] leading-[26px] text-muted-foreground md:text-[20px] md:leading-[30px]"
      >
        A professional toolkit — typed, accessible, themeable. Tables, filters, forms and overlays
        that agree with each other. Windows 98 and modern in the box; your own look in one call.
      </p>
      <div class="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
        <InstallCommand class="md:w-[300px]" />
        <Button as="a" :href="withBase('/installation')" size="lg" class="lp-brand">
          Get started
        </Button>
        <Button as="a" :href="withBase('/components/')" variant="secondary" size="lg">
          Browse components
        </Button>
      </div>
      <p class="text-[14px] leading-5 text-muted-foreground">
        Vue 3.5+ <span aria-hidden="true">&nbsp;·&nbsp;</span> Tailwind CSS v4
        <span aria-hidden="true">&nbsp;·&nbsp;</span> TypeScript
        <span aria-hidden="true">&nbsp;·&nbsp;</span> MIT
      </p>
    </div>

    <div class="mx-auto mt-10 flex max-w-[860px] flex-col gap-4 md:items-center">
      <LookSwitch />
      <LandingDemo class="w-full" />
      <p class="text-[14px] leading-5 text-muted-foreground">
        Live — sort, select and filter this table.
        <a
          :href="SOURCE.demo"
          class="ml-2 font-semibold text-(--lp-link) hover:underline win98:underline"
          >View source →</a
        >
      </p>
    </div>
  </section>
</template>
