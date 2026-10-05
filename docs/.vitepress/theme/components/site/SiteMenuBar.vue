<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { DocumentIcon } from 'rowkit'
import SiteMenu from './SiteMenu.vue'
import { folder, folderMenu, fromTree, type MenuEntry } from './menu'
import { openFind } from './useFind'
import { useSiteNav } from './useSiteNav'

/**
 * The menu bar under the title bar: Guide · Components · Patterns · Storybook
 * · Decisions · Help, each a drop-down built from the docs tree. Hovered, an
 * item rises with a thin bevel; while its menu is open it sits sunken, and
 * moving across the bar with a menu open switches menus, as Windows 98 does.
 *
 * A WAI-ARIA menubar: ← → move along the bar (and between open menus), ↓
 * Enter and Space open a menu at its first item, Escape closes it.
 */
const { tree } = useSiteNav()
const route = useRoute()

interface BarItem {
  text: string
  href?: string
  entries?: MenuEntry[]
}

const bar = computed<BarItem[]>(() => {
  const menu = (text: string) => fromTree(folder(tree.value, text)?.children ?? [])
  const page = (text: string) => tree.value.find((node) => node.text === text && node.link)
  const roadmap = page('Roadmap')
  const contributing = page('Contributing')
  return [
    { text: 'Guide', entries: menu('Guide') },
    { text: 'Components', entries: folderMenu(folder(tree.value, 'Components'), 'All components') },
    { text: 'Patterns', entries: menu('Patterns') },
    { text: 'Storybook', href: 'https://storybook.rowkit.dev' },
    { text: 'Decisions', entries: menu('Decisions') },
    {
      text: 'Help',
      entries: [
        ...(roadmap
          ? [
              {
                kind: 'item',
                id: 'roadmap',
                text: 'Roadmap',
                icon: DocumentIcon,
                href: withBase(roadmap.link ?? '/'),
              } as const,
            ]
          : []),
        ...(contributing
          ? [
              {
                kind: 'item',
                id: 'contributing',
                text: 'Contributing',
                icon: DocumentIcon,
                href: withBase(contributing.link ?? '/'),
              } as const,
            ]
          : []),
        {
          kind: 'item',
          id: 'changelog',
          text: 'Changelog',
          href: 'https://github.com/NikolaiKushner/rowkit/releases',
        },
        {
          kind: 'item',
          id: 'github',
          text: 'GitHub',
          href: 'https://github.com/NikolaiKushner/rowkit',
        },
        { kind: 'separator', id: 'help-sep' },
        { kind: 'item', id: 'find', text: 'Find…', shortcut: 'Ctrl+K', action: openFind },
      ],
    },
  ]
})

const root = ref<HTMLElement>()
const open = ref<number>()
const menus = ref<{ focusFirst: () => void; focusPanel: () => void }[]>([])

function trigger(index: number): HTMLElement | null {
  return root.value?.querySelector<HTMLElement>(`[data-bar="${String(index)}"]`) ?? null
}

function openMenu(index: number, fromKeyboard: boolean): void {
  if (!bar.value[index]?.entries) {
    open.value = undefined
    trigger(index)?.focus()
    return
  }
  open.value = index
  void nextTick(() => {
    const menu = menus.value[0]
    if (fromKeyboard) menu?.focusFirst()
    else menu?.focusPanel()
  })
}

function close(focusTrigger = true): void {
  const was = open.value
  open.value = undefined
  if (focusTrigger && was !== undefined) trigger(was)?.focus()
}

function step(from: number, by: number, keepOpen: boolean): void {
  const next = (from + by + bar.value.length) % bar.value.length
  if (keepOpen) openMenu(next, true)
  else trigger(next)?.focus()
}

function onBarKeydown(event: KeyboardEvent, index: number): void {
  switch (event.key) {
    case 'ArrowRight':
      step(index, 1, open.value !== undefined)
      break
    case 'ArrowLeft':
      step(index, -1, open.value !== undefined)
      break
    case 'ArrowDown':
    case 'Enter':
    case ' ':
      if (!bar.value[index]?.entries) return
      openMenu(index, true)
      break
    case 'Escape':
      close()
      break
    default:
      return
  }
  event.preventDefault()
}

function onBarClick(index: number): void {
  if (open.value === index) close(false)
  else openMenu(index, false)
}

// With a menu open, pointing at another item opens that one instead.
function onBarHover(index: number): void {
  if (open.value !== undefined && open.value !== index) openMenu(index, false)
}

function onPointerDown(event: PointerEvent): void {
  if (!root.value?.contains(event.target as Node)) close(false)
}

watch(open, (value) => {
  if (value === undefined) document.removeEventListener('pointerdown', onPointerDown, true)
  else document.addEventListener('pointerdown', onPointerDown, true)
})

watch(
  () => route.path,
  () => close(false)
)

onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown, true))
</script>

<template>
  <nav ref="root" aria-label="Main" class="relative z-30 bg-card px-0.5 py-px">
    <ul role="menubar" aria-label="Main" class="m-0 flex list-none items-center p-0">
      <li v-for="(item, index) in bar" :key="item.text" role="none" class="relative">
        <a
          v-if="item.href"
          :data-bar="index"
          role="menuitem"
          :tabindex="index === 0 ? 0 : -1"
          :href="item.href"
          target="_blank"
          rel="noreferrer"
          class="rk-bar-item"
          @keydown="onBarKeydown($event, index)"
          @pointerenter="onBarHover(index)"
          >{{ item.text }}</a
        >
        <button
          v-else
          :id="`rk-menu-${String(index)}`"
          :data-bar="index"
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          :aria-expanded="open === index"
          :tabindex="index === 0 ? 0 : -1"
          class="rk-bar-item"
          :class="open === index && 'rk-bar-item-open'"
          @click="onBarClick(index)"
          @keydown="onBarKeydown($event, index)"
          @pointerenter="onBarHover(index)"
        >
          {{ item.text }}
        </button>
        <SiteMenu
          v-if="open === index && item.entries"
          ref="menus"
          :entries="item.entries"
          :labelledby="`rk-menu-${String(index)}`"
          class="absolute top-full left-0"
          @close="close"
          @prev="step(index, -1, true)"
          @next="step(index, 1, true)"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/*
 * A menu-bar item: flat; a thin raised bevel under the pointer, thin sunken
 * while its menu is open, navy when it has the keyboard.
 */
.rk-bar-item {
  display: flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border: 0;
  background: none;
  font-size: var(--text-ui);
  line-height: var(--text-ui--line-height);
  color: var(--color-foreground);
  text-decoration: none;
  outline: none;
  cursor: default;
}

.rk-bar-item:hover {
  box-shadow: var(--shadow-raised-thin);
}

.rk-bar-item-open,
.rk-bar-item-open:hover {
  box-shadow: var(--shadow-status);
}

.rk-bar-item:focus-visible:not(.rk-bar-item-open) {
  background: var(--color-surface-selected);
  color: var(--color-on-selected);
}
</style>
