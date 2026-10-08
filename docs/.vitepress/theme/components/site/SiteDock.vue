<script setup lang="ts">
import { computed, type Component } from 'vue'
import { withBase } from 'vitepress'
import {
  Book32Icon,
  Code32Icon,
  Computer32Icon,
  Document32Icon,
  Folder32Icon,
  Trash32Icon,
} from 'rowkit'

/**
 * The modern theme's Dock (Figma SiteModern/Dock): glass along the bottom of
 * the desktop, a white tile per place, a dot under what is open, and the
 * Trash past a divider. The Windows 98 desktop keeps its shortcuts instead.
 *
 * rowkit and Live demo are the home page's own windows. There they are
 * buttons that bring the window back, with the dot while it is open; on any
 * other page they lead to the home page.
 */
const props = defineProps<{
  /** Which home-page windows are open. Omitted away from the home page. */
  running?: { about: boolean; demo: boolean }
  /** The phone's Dock (Figma Home, 390): rowkit, Guide, Components, Live demo, Trash. */
  compact?: boolean
}>()

const emit = defineEmits<{ open: [window: 'about' | 'demo'] }>()

interface Tile {
  label: string
  icon?: Component
  href?: string
  window?: 'about' | 'demo'
}

const tiles: Tile[] = [
  { label: 'rowkit', window: 'about' },
  { label: 'Guide', href: withBase('/introduction'), icon: Book32Icon },
  { label: 'Components', href: withBase('/components/'), icon: Folder32Icon },
  { label: 'Patterns', href: withBase('/patterns/data-table-page'), icon: Folder32Icon },
  { label: 'Live demo', window: 'demo', icon: Computer32Icon },
  { label: 'Storybook', href: 'https://storybook.rowkit.dev', icon: Code32Icon },
  { label: 'Decisions', href: withBase('/decisions/001-typescript-pin'), icon: Document32Icon },
]

const trash: Tile = {
  label: 'Old versions',
  href: 'https://github.com/NikolaiKushner/rowkit/releases',
  icon: Trash32Icon,
}

const PHONE = ['rowkit', 'Guide', 'Components', 'Live demo']
const shown = computed(() => [
  ...(props.compact ? tiles.filter((tile) => PHONE.includes(tile.label)) : tiles),
  trash,
])

const isRunning = (tile: Tile) => (tile.window ? !!props.running?.[tile.window] : false)
const isExternal = (tile: Tile) => !!tile.href && /^https?:/.test(tile.href)
</script>

<template>
  <nav
    aria-label="Dock"
    class="flex items-start gap-2 rounded-[18px] bg-popover px-2 pt-1.5 pb-[3px] shadow-[0_10px_30px_rgb(0_0_0/0.15),0_0_0_1px_rgb(0_0_0/0.1)] [backdrop-filter:var(--rk-popover-backdrop)]"
  >
    <template v-for="tile in shown" :key="tile.label">
      <span v-if="tile === trash" aria-hidden="true" class="h-12 w-px bg-border" />
      <!--
        Two elements rather than <component :is="'button'">: the site registers
        rowkit's Button globally, and Vue would resolve the string to it.
      -->
      <button
        v-if="tile.window && running"
        type="button"
        :title="tile.label"
        :aria-label="tile.label"
        class="group flex w-12 flex-col items-center gap-[3px] rounded-xl text-foreground no-underline outline-none focus-visible:focus-outer"
        @click="emit('open', tile.window)"
      >
        <span
          class="flex h-12 items-center justify-center rounded-xl bg-card shadow-raised transition-transform group-hover:-translate-y-1 motion-reduce:transition-none [&_svg]:size-[30px]"
        >
          <img
            v-if="!tile.icon"
            :src="withBase('/mark.svg')"
            alt=""
            width="32"
            height="32"
            class="size-8"
          />
          <component :is="tile.icon" v-else />
        </span>
        <span
          aria-hidden="true"
          class="size-1 rounded-full bg-foreground"
          :class="isRunning(tile) ? 'opacity-100' : 'opacity-0'"
        />
      </button>
      <a
        v-else
        :href="tile.href ?? withBase('/')"
        :target="isExternal(tile) ? '_blank' : undefined"
        :rel="isExternal(tile) ? 'noreferrer' : undefined"
        :title="tile.label"
        :aria-label="tile.label"
        class="group flex w-12 flex-col items-center gap-[3px] rounded-xl text-foreground no-underline outline-none focus-visible:focus-outer"
      >
        <span
          class="flex h-12 items-center justify-center rounded-xl bg-card shadow-raised transition-transform group-hover:-translate-y-1 motion-reduce:transition-none [&_svg]:size-[30px]"
        >
          <img
            v-if="!tile.icon"
            :src="withBase('/mark.svg')"
            alt=""
            width="32"
            height="32"
            class="size-8"
          />
          <component :is="tile.icon" v-else />
        </span>
        <span
          aria-hidden="true"
          class="size-1 rounded-full bg-foreground"
          :class="isRunning(tile) ? 'opacity-100' : 'opacity-0'"
        />
      </a>
    </template>
  </nav>
</template>
