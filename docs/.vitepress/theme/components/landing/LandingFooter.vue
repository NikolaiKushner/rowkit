<script setup lang="ts">
import { withBase } from 'vitepress'
import { LINKS } from './links'

/**
 * The landing page's footer (Figma SiteV2/Footer): in ink with the light
 * logo in the modern theme, in silver under a bevel in Windows 98.
 */
const COLUMNS = [
  {
    title: 'Docs',
    links: [
      { text: 'Introduction', href: withBase('/introduction') },
      { text: 'Installation', href: withBase('/installation') },
      { text: 'Themes', href: withBase('/foundations/themes') },
      { text: 'Components', href: withBase('/components/') },
    ],
  },
  {
    title: 'Project',
    links: [
      { text: 'Roadmap', href: withBase('/roadmap') },
      { text: 'Decisions', href: withBase('/decisions/001-typescript-pin') },
      { text: 'Contributing', href: withBase('/contributing') },
      { text: 'Changelog', href: LINKS.changelog },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { text: 'GitHub', href: LINKS.github },
      { text: 'npm', href: LINKS.npm },
      { text: 'Storybook', href: LINKS.storybook },
    ],
  },
]
</script>

<template>
  <footer
    class="bg-[#111114] px-5 py-12 text-[#fafaf8] md:px-16 win98:bg-background win98:text-foreground win98:shadow-[inset_0_1px_#808080,inset_0_2px_#fff]"
  >
    <div class="mx-auto flex max-w-[1312px] flex-col gap-10 md:flex-row md:justify-between">
      <div class="flex max-w-[300px] flex-col gap-3">
        <img
          :src="withBase('/logo-light.svg')"
          alt="rowkit"
          width="115"
          height="22"
          class="win98:hidden"
        />
        <img
          :src="withBase('/logo.svg')"
          alt="rowkit"
          width="115"
          height="22"
          class="modern:hidden"
        />
        <p class="text-[14px] leading-5 text-[#fafaf8]/65 win98:text-foreground">
          A professional Vue 3 toolkit — the components a product interface is built from.
        </p>
        <p class="text-[14px] leading-5 text-[#fafaf8]/65 win98:text-foreground">
          MIT licence · Built with rowkit
        </p>
      </div>
      <nav aria-label="Site" class="grid grid-cols-3 gap-8 md:gap-12">
        <div v-for="column in COLUMNS" :key="column.title" class="flex flex-col gap-2.5">
          <h2 class="text-[14px] leading-5 font-semibold win98:font-bold">{{ column.title }}</h2>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in column.links" :key="link.text">
              <a
                :href="link.href"
                class="text-[14px] leading-5 text-[#fafaf8]/65 hover:text-[#fafaf8] hover:underline win98:text-foreground"
                >{{ link.text }}</a
              >
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </footer>
</template>
