<script setup lang="ts">
import SectionHeading from './SectionHeading.vue'

/**
 * «Before you install»: what a team asks before it adds a dependency. The
 * default theme is here on purpose — the site opens in modern, rowkit
 * without an attribute is Windows 98, and that surprises people.
 *
 * An answer's `backticks` are code.
 */
const QUESTIONS = [
  {
    q: 'Is it ready for production?',
    a: 'It is in the 1.0 beta: every component is tested and documented, and an API can still change between betas — each change is in the changelog.',
  },
  {
    q: 'Does it work with Nuxt and SSR?',
    a: 'Yes. Add the Tailwind Vite plugin; overlays render after mount and nothing reads the window on the server.',
  },
  {
    q: 'Do I need Tailwind?',
    a: 'Yes, Tailwind CSS v4. rowkit ships its utilities as a source your Tailwind build compiles, so you get only the classes you use.',
  },
  {
    q: 'How big is it?',
    a: '39 kB brotli for everything. Import one component and you ship only that — a Button is 2.6 kB.',
  },
  {
    q: 'Which theme do I get by default?',
    a: 'Windows 98, with no attribute. Put `data-theme="modern"` on `<html>` for the modern look — light and dark — or define your own.',
  },
  {
    q: 'What is the licence?',
    a: 'MIT. Use it in commercial products; no attribution in the interface is needed.',
  },
]
</script>

<template>
  <section aria-labelledby="lp-faq" class="px-5 pb-16 md:px-6 md:pb-28">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-10">
      <SectionHeading id="lp-faq" label="Questions" title="Before you install" />
      <dl class="grid gap-x-12 md:grid-cols-2">
        <div
          v-for="item in QUESTIONS"
          :key="item.q"
          class="flex flex-col gap-2 border-t border-border py-6 win98:border-[#808080]"
        >
          <dt class="text-[16px] leading-6 font-semibold text-foreground win98:font-bold">
            {{ item.q }}
          </dt>
          <dd class="m-0 text-[16px] leading-[26px] text-muted-foreground">
            <template v-for="(part, i) in item.a.split('`')" :key="i">
              <code v-if="i % 2" class="font-mono text-foreground">{{ part }}</code>
              <template v-else>{{ part }}</template>
            </template>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
