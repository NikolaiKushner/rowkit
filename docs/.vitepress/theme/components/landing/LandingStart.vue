<script setup lang="ts">
import { withBase } from 'vitepress'
import { Button } from 'rowkit'
import CodeBlock from './CodeBlock.vue'
import SectionHeading from './SectionHeading.vue'
import { LINKS } from './links'

/** «Start in a minute»: the three steps of Installation, and the way into the guide. */
const STEPS = [
  { title: 'Install', code: 'npm i rowkit@beta' },
  { title: 'Add the styles', code: "@import 'tailwindcss';\n@import 'rowkit/styles';" },
  { title: 'Pick a look', code: '<html data-theme="modern">' },
]
</script>

<template>
  <section aria-labelledby="lp-start" class="bg-background px-5 py-16 md:px-6 md:py-28">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-12">
      <SectionHeading id="lp-start" label="Get started" title="Start in a minute" />
      <ol class="grid gap-4 md:grid-cols-3 md:gap-6">
        <li
          v-for="(step, i) in STEPS"
          :key="step.title"
          class="flex flex-col gap-3.5 bg-card p-6 modern:rounded-xl modern:border modern:border-border-subtle modern-dark:border-border win98:shadow-window"
        >
          <h3
            class="flex items-center gap-3 text-[18px] leading-[26px] font-semibold text-foreground win98:font-bold"
          >
            <span
              class="flex size-6 items-center justify-center text-[14px] leading-5 font-semibold modern:rounded-md modern:bg-(--lp-accent-soft) modern:text-(--lp-accent-on-soft) win98:bg-white win98:text-[#000080]"
              aria-hidden="true"
              >{{ i + 1 }}</span
            >
            {{ step.title }}
          </h3>
          <CodeBlock :code="step.code" :label="step.title" variant="inset" />
        </li>
      </ol>
      <div class="flex flex-col gap-3 md:flex-row md:justify-center">
        <Button as="a" :href="withBase('/introduction')" size="lg" class="lp-brand">
          Read the guide
        </Button>
        <Button as="a" :href="LINKS.storybook" variant="secondary" size="lg">Open Storybook</Button>
      </div>
    </div>
  </section>
</template>
