<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue'
import { useRoute, withBase } from 'vitepress'
import {
  Book32Icon,
  Code32Icon,
  Computer32Icon,
  Document32Icon,
  DocumentIcon,
  Folder32Icon,
  FolderIcon,
  Info32Icon,
  Search32Icon,
} from 'rowkit'
import SiteMenu from './SiteMenu.vue'
import { folder, fromTree, type MenuEntry, type MenuItem } from './menu'
import { openFind } from './useFind'
import { useSiteNav } from './useSiteNav'

/**
 * The Start menu: the rowkit strip down the left, 34px items with 32px icons,
 * cascades to the right. On a phone, where a cascade has nowhere to go, a
 * folder replaces the menu with its contents under a «◂ Folder» row that goes
 * back — and it is the site's main navigation there.
 */
const props = defineProps<{
  /** The element that opened the menu; a click on it is not «outside». */
  anchor: HTMLElement | undefined
}>()

const emit = defineEmits<{ close: [focusStart: boolean] }>()

const { tree } = useSiteNav()
const route = useRoute()

const root = ref<HTMLElement>()
const menu = ref<{ focusFirst: () => void; focusPanel: () => void }>()

const entries = computed<MenuEntry[]>(() => {
  const sub = (text: string) => fromTree(folder(tree.value, text)?.children ?? [])
  const decisions = folder(tree.value, 'Decisions')?.children[0]?.link
  return [
    { kind: 'item', id: 'guide', text: 'Guide', icon: Book32Icon, children: sub('Guide') },
    {
      kind: 'item',
      id: 'components',
      text: 'Components',
      icon: Folder32Icon,
      children: sub('Components'),
    },
    {
      kind: 'item',
      id: 'patterns',
      text: 'Patterns',
      icon: Folder32Icon,
      children: sub('Patterns'),
    },
    {
      kind: 'item',
      id: 'tokens',
      text: 'Tokens',
      icon: Computer32Icon,
      href: withBase('/foundations/tokens'),
    },
    {
      kind: 'item',
      id: 'decisions',
      text: 'Decisions',
      icon: Document32Icon,
      href: withBase(decisions ?? '/'),
    },
    { kind: 'separator', id: 'sep-1' },
    {
      kind: 'item',
      id: 'storybook',
      text: 'Storybook',
      icon: Computer32Icon,
      href: 'https://storybook.rowkit.dev',
    },
    {
      kind: 'item',
      id: 'github',
      text: 'GitHub',
      icon: Code32Icon,
      href: 'https://github.com/NikolaiKushner/rowkit',
    },
    { kind: 'separator', id: 'sep-2' },
    { kind: 'item', id: 'find', text: 'Find…', icon: Search32Icon, action: openFind },
    { kind: 'item', id: 'help', text: 'Help', icon: Info32Icon, href: withBase('/introduction') },
  ]
})

/*
 * Drilling, below 768px. `trail` is the folders opened so far; the panel shows
 * the last one's contents. Their 16px icons become the 32px ones, so every row
 * of the phone menu is a 34px Start item.
 */
const narrow = ref(false)
const trail = ref<MenuItem[]>([])

const large = new Map<Component, Component>([
  [FolderIcon, Folder32Icon],
  [DocumentIcon, Document32Icon],
])

function toLarge(list: MenuEntry[]): MenuEntry[] {
  return list.map((entry) =>
    entry.kind === 'item' && entry.icon
      ? { ...entry, icon: large.get(entry.icon) ?? entry.icon }
      : entry
  )
}

const shown = computed(() => {
  const last = trail.value[trail.value.length - 1]
  return last?.children ? toLarge(last.children) : entries.value
})

function drillIn(entry: MenuItem): void {
  trail.value = [...trail.value, entry]
  void nextTick(() => menu.value?.focusFirst())
}

/** Escape steps back out of a folder before it closes the menu. */
function onClose(focusStart: boolean): void {
  if (focusStart && narrow.value && trail.value.length > 0) drillOut()
  else emit('close', focusStart)
}

function drillOut(): void {
  trail.value = trail.value.slice(0, -1)
  void nextTick(() => menu.value?.focusFirst())
}

let query: MediaQueryList | undefined
const onWidth = () => (narrow.value = query?.matches ?? false)

function onPointerDown(event: PointerEvent): void {
  const target = event.target as Node
  if (root.value?.contains(target) || props.anchor?.contains(target)) return
  emit('close', false)
}

onMounted(() => {
  query = window.matchMedia('(max-width: 767px)')
  onWidth()
  query.addEventListener('change', onWidth)
  document.addEventListener('pointerdown', onPointerDown, true)
})

onBeforeUnmount(() => {
  query?.removeEventListener('change', onWidth)
  document.removeEventListener('pointerdown', onPointerDown, true)
})

watch(
  () => route.path,
  () => emit('close', false)
)

defineExpose({
  focusFirst: () => menu.value?.focusFirst(),
  focusPanel: () => menu.value?.focusPanel(),
})
</script>

<template>
  <div ref="root" class="fixed bottom-7 left-0.5 z-50 flex bg-card p-0.5 shadow-window">
    <!--
      The strip: the title-bar gradient upright, the wordmark reading upward,
      4px in and 6px up. Turned about its top-left corner so every pixel stays
      on the grid — about its centre it would land on half pixels.
    -->
    <div
      v-if="!narrow"
      aria-hidden="true"
      class="relative w-[22px] shrink-0 overflow-hidden bg-linear-to-b from-titlebar-to to-titlebar-from"
    >
      <img
        :src="withBase('/wordmark-light.svg')"
        alt=""
        width="51"
        height="14"
        class="absolute bottom-[-8px] left-1 max-w-none origin-top-left -rotate-90"
      />
    </div>
    <div class="flex flex-col" :class="narrow && 'w-[256px]'">
      <button
        v-if="narrow && trail.length > 0"
        type="button"
        class="flex h-[34px] w-full items-center gap-2 border-0 bg-transparent py-px pr-1.5 pl-1 text-left text-ui text-foreground outline-none focus-visible:bg-surface-selected focus-visible:text-on-selected"
        @click="drillOut"
      >
        <Folder32Icon class="shrink-0" />
        ◂ {{ trail[trail.length - 1]?.text }}
      </button>
      <SiteMenu
        ref="menu"
        :entries="shown"
        size="start"
        :drill="narrow"
        label="Start"
        class="!bg-transparent !p-0 !shadow-none"
        :class="narrow && '[&_[role=menuitem]]:!w-full'"
        @close="onClose"
        @drill="drillIn"
        @prev="narrow && trail.length > 0 && drillOut()"
      />
    </div>
  </div>
</template>
