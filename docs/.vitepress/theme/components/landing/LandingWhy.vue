<script setup lang="ts">
import SectionHeading from './SectionHeading.vue'
import SiteIcon, { type SiteIconName } from './SiteIcon.vue'

/**
 * «Built like a professional tool»: what rowkit does that a team would
 * otherwise write and test itself, and the numbers behind it.
 *
 * The numbers are the repository's: the test count from `pnpm test`, the
 * sizes from `pnpm size` (brotli), the component count from the docs.
 */
const FEATURES: { icon: SiteIconName; title: string; text: string }[] = [
  {
    icon: 'typed',
    title: 'Typed',
    text: 'Generics carry your row type from DataTable into its slots, sort and selection. Strict TypeScript, no any.',
  },
  {
    icon: 'accessible',
    title: 'Accessible',
    text: 'WAI-ARIA patterns, full keyboard support, and an accessibility check on every story in CI — in both themes.',
  },
  {
    icon: 'behaviour',
    title: 'Its own behaviour',
    text: 'Focus scope, dismissable layers, positioning and scroll lock written for rowkit, with no behaviour library underneath.',
  },
  {
    icon: 'tokens',
    title: 'Tokens all the way down',
    text: '313 design tokens, each described. Change a few for your brand or define a whole theme of your own.',
  },
  {
    icon: 'ssr',
    title: 'SSR and Nuxt',
    text: 'Overlays teleport after mount; nothing reads the window on the server. Works in Nuxt with the Vite plugin.',
  },
  {
    icon: 'agents',
    title: 'Ready for coding agents',
    text: 'AGENTS.md ships in the package — every prop, event and slot, generated from the source you installed.',
  },
]

const STATS = [
  { value: '21', text: 'components, more on the way' },
  { value: '1,494', text: 'tests: unit, component and in a real browser' },
  { value: '39 kB', text: 'the whole library, brotli; a Button alone 2.6 kB' },
  { value: '2 + yours', text: 'themes in the box, and any you define' },
]
</script>

<template>
  <section aria-labelledby="lp-why" class="bg-card px-5 py-16 md:px-6 md:py-28">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-12">
      <SectionHeading id="lp-why" label="Why rowkit" title="Built like a professional tool">
        The parts you would otherwise write and test yourself — done once, with the tests to prove
        it.
      </SectionHeading>

      <ul class="grid gap-4 md:grid-cols-2 md:gap-9 lg:grid-cols-3">
        <li
          v-for="feature in FEATURES"
          :key="feature.title"
          class="flex flex-col gap-3 p-6 modern:rounded-xl modern:border modern:border-border-subtle modern-dark:border-border win98:shadow-window"
        >
          <SiteIcon :name="feature.icon" />
          <h3 class="mt-1 text-[18px] leading-[26px] font-semibold text-foreground win98:font-bold">
            {{ feature.title }}
          </h3>
          <p class="text-[15px] leading-6 text-muted-foreground">{{ feature.text }}</p>
        </li>
      </ul>

      <dl
        class="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 lg:grid-cols-4 win98:border-[#808080]"
      >
        <div
          v-for="stat in STATS"
          :key="stat.value"
          class="flex flex-col-reverse justify-end gap-1.5"
        >
          <dt class="max-w-[220px] text-[14px] leading-5 text-muted-foreground">{{ stat.text }}</dt>
          <dd
            class="m-0 text-[28px] leading-9 font-semibold text-foreground md:text-[32px] md:leading-10 win98:font-bold"
          >
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
