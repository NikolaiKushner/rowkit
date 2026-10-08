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
import {
  componentsMenu,
  folder,
  folderMenu,
  fromTree,
  schemeMenu,
  searchShortcut,
  type MenuEntry,
  type MenuItem,
} from './menu'
import { openFind } from './useFind'
import { useSiteNav } from './useSiteNav'
import { setSiteTheme, siteTheme } from './useSiteTheme'

/**
 * The Start menu: the rowkit strip down the left, 34px items with 32px icons,
 * cascades to the right. On a phone, where a cascade has nowhere to go, a
 * folder replaces the menu with its contents under a «◂ Folder» row that goes
 * back — and it is the site's main navigation there.
 *
 * In the modern theme it is the rowkit menu under the brand in the menu bar
 * (Figma SiteModern/Menu/rowkit): a drop-down like the others, its own items.
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
      children: folderMenu(folder(tree.value, 'Components'), 'All components'),
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

const modernEntries = computed<MenuEntry[]>(() => {
  const sub = (text: string) => fromTree(folder(tree.value, text)?.children ?? [])
  const decisions = folder(tree.value, 'Decisions')?.children[0]?.link
  const external = (id: string, text: string, href: string): MenuEntry => ({
    kind: 'item',
    id,
    text,
    href,
    shortcut: '↗',
  })
  return [
    { kind: 'item', id: 'about', text: 'About rowkit', href: withBase('/') },
    { kind: 'separator', id: 'sep-1' },
    { kind: 'item', id: 'guide', text: 'Guide', href: withBase('/introduction') },
    {
      kind: 'item',
      id: 'components',
      text: 'Components',
      children: componentsMenu(folder(tree.value, 'Components')),
    },
    { kind: 'item', id: 'patterns', text: 'Patterns', children: sub('Patterns') },
    {
      kind: 'item',
      id: 'foundations',
      text: 'Foundations',
      children: sub('Foundations · Tokens'),
    },
    { kind: 'item', id: 'decisions', text: 'Decisions', href: withBase(decisions ?? '/') },
    { kind: 'separator', id: 'sep-2' },
    { kind: 'item', id: 'find', text: 'Search…', shortcut: searchShortcut(), action: openFind },
    external('storybook', 'Storybook', 'https://storybook.rowkit.dev'),
    external('github', 'GitHub', 'https://github.com/NikolaiKushner/rowkit'),
    { kind: 'separator', id: 'sep-3' },
    {
      kind: 'item',
      id: 'theme',
      text: 'Theme',
      children: [
        ...(['win98', 'modern'] as const).map((theme): MenuEntry => ({
          kind: 'item',
          id: `theme-${theme}`,
          text: theme === 'win98' ? 'Windows 98' : 'Modern',
          checked: siteTheme.value === theme,
          action: () => setSiteTheme(theme),
        })),
        { kind: 'separator', id: 'theme-sep' },
        ...schemeMenu(),
      ],
    },
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
  if (last?.children) return toLarge(last.children)
  return siteTheme.value === 'modern' ? modernEntries.value : entries.value
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
  <div
    ref="root"
    class="fixed bottom-[34px] left-0.5 z-50 flex bg-card p-0.5 shadow-window modern:top-7 modern:bottom-auto modern:left-2 modern:bg-transparent modern:p-0 modern:shadow-none modern:max-md:top-9 modern:max-md:right-2 modern:max-md:left-auto"
  >
    <!--
      The strip: the title-bar gradient upright, the wordmark reading upward,
      4px in and 6px up. Turned about its top-left corner so every pixel stays
      on the grid — about its centre it would land on half pixels.
    -->
    <div
      v-if="!narrow"
      aria-hidden="true"
      class="relative w-[22px] shrink-0 overflow-hidden bg-linear-to-b from-titlebar-to to-titlebar-from modern:hidden"
    >
      <img
        :src="withBase('/wordmark-light.svg')"
        alt=""
        width="51"
        height="14"
        class="absolute bottom-[-8px] left-1 max-w-none origin-top-left -rotate-90"
      />
    </div>
    <!-- On a phone in the modern theme the glass is this column's, so the back row sits on it too. -->
    <div
      class="flex flex-col modern:max-md:rounded-[10px] modern:max-md:bg-popover modern:max-md:p-[5px] modern:max-md:shadow-[0_10px_30px_rgb(0_0_0/0.15),0_0_0_1px_rgb(0_0_0/0.1)] modern:max-md:[backdrop-filter:var(--rk-popover-backdrop)]"
      :class="narrow && 'w-[256px]'"
    >
      <button
        v-if="narrow && trail.length > 0"
        type="button"
        class="flex h-[34px] w-full items-center gap-2 border-0 bg-transparent py-px pr-1.5 pl-1 text-left text-ui text-foreground outline-none focus-visible:bg-surface-selected focus-visible:text-on-selected modern:mb-1 modern:h-6 modern:gap-1 modern:rounded-[5px] modern:pl-1.5 modern:font-strong"
        @click="drillOut"
      >
        <Folder32Icon v-if="siteTheme !== 'modern'" class="shrink-0" />
        ◂ {{ trail[trail.length - 1]?.text }}
      </button>
      <SiteMenu
        ref="menu"
        :entries="shown"
        :size="siteTheme === 'modern' ? 'menu' : 'start'"
        :drill="narrow"
        :label="siteTheme === 'modern' ? 'rowkit' : 'Start'"
        class="win98:!bg-transparent win98:!p-0 win98:!shadow-none modern:w-[240px] modern:max-md:!w-full modern:max-md:!bg-transparent modern:max-md:!p-0 modern:max-md:!shadow-none modern:max-md:![backdrop-filter:none]"
        :class="narrow && '[&_[role=menuitem]]:!w-full'"
        @close="onClose"
        @drill="drillIn"
        @prev="narrow && trail.length > 0 && drillOut()"
      />
    </div>
  </div>
</template>
