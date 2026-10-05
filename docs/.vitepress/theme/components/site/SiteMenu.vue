<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { TriangleRightIcon } from 'rowkit'
import { isExternal, type MenuEntry, type MenuItem } from './menu'

/**
 * A Windows 98 menu panel: the window bevel, items, etched separators, and
 * submenus that cascade to the right — after 400ms of hover, or at once on
 * click or →. A WAI-ARIA menu: ↑ ↓ Home End move, → opens a submenu, ← and
 * Escape close one, Enter and Space choose. Focus moves with the highlight, so
 * a screen reader reads the item the eye sees.
 *
 * `size="start"` draws the Start menu's 34px items with 32px icons; a
 * submenu is always the 20px kind. With `drill`, a submenu replaces the panel
 * instead of opening beside it — the Start menu on a phone.
 */
const props = withDefaults(
  defineProps<{
    entries: MenuEntry[]
    size?: 'menu' | 'start'
    /** Submenus drill in rather than cascade. */
    drill?: boolean
    /** Accessible name, from the control that opened the menu. */
    labelledby?: string
    label?: string
    /** Nested inside another menu: ← and Escape step back out. */
    nested?: boolean
  }>(),
  { size: 'menu', drill: false, nested: false, labelledby: undefined, label: undefined }
)

const emit = defineEmits<{
  /** Close every menu: an item was chosen, or Escape / Tab at the top. */
  close: [focusTrigger: boolean]
  /** ← or Escape inside a submenu: close it and return to its item. */
  back: []
  /** ← and → at the top of a menu-bar menu: move to the next menu. */
  prev: []
  next: []
  /** A folder was opened in drill mode. */
  drill: [entry: MenuItem]
}>()

const list = ref<HTMLElement>()
const active = ref(-1)
const openSub = ref<string>()
// Inside v-for, a template ref collects an array; at most one submenu is open.
const subMenu = ref<{ focusFirst: () => void }[]>([])
const subStyle = ref<Record<string, string>>({})

const items = computed(() =>
  props.entries.flatMap((entry, index) =>
    entry.kind === 'item' && entry.disabled !== true ? [index] : []
  )
)

function element(index: number): HTMLElement | null {
  return list.value?.querySelector<HTMLElement>(`[data-index="${String(index)}"]`) ?? null
}

function focusIndex(index: number): void {
  active.value = index
  element(index)?.focus({ preventScroll: true })
}

/** Focus the first item: a menu opened from the keyboard. */
function focusFirst(): void {
  const first = items.value[0]
  if (first !== undefined) focusIndex(first)
}

/** Focus the panel with nothing highlighted: a menu opened by the pointer. */
function focusPanel(): void {
  active.value = -1
  list.value?.focus({ preventScroll: true })
}

defineExpose({ focusFirst, focusPanel })

let hoverTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(hoverTimer))

function entryAt(index: number): MenuItem | undefined {
  const entry = props.entries[index]
  return entry?.kind === 'item' ? entry : undefined
}

/**
 * Opens a submenu, then keeps it on screen: above the taskbar if it would run
 * off the bottom, to the left if it would run off the right.
 */
function openSubmenu(entry: MenuItem, focus: boolean): void {
  openSub.value = entry.id
  subStyle.value = {}
  void nextTick(() => {
    const panel = list.value?.querySelector<HTMLElement>(':scope > li > [role="menu"]')
    if (panel) {
      const box = panel.getBoundingClientRect()
      const bottom = window.innerHeight - 28
      const style: Record<string, string> = {}
      if (box.bottom > bottom) style.top = `${String(-2 - Math.ceil(box.bottom - bottom))}px`
      if (box.right > window.innerWidth) {
        style.left = 'auto'
        style.right = '100%'
      }
      subStyle.value = style
    }
    if (focus) subMenu.value[0]?.focusFirst()
  })
}

function closeSubmenu(): void {
  openSub.value = undefined
}

function choose(index: number, fromKeyboard: boolean): void {
  const entry = entryAt(index)
  if (!entry || entry.disabled === true) return
  if (entry.children) {
    if (props.drill) emit('drill', entry)
    else openSubmenu(entry, fromKeyboard)
    return
  }
  entry.action?.()
  emit('close', false)
}

function onHover(index: number): void {
  const entry = entryAt(index)
  if (!entry) return
  focusIndex(index)
  clearTimeout(hoverTimer)
  if (props.drill) return
  // Windows 98 waits before opening or swapping a cascade, so a diagonal move
  // toward an open submenu does not close it on the way.
  hoverTimer = setTimeout(() => {
    if (entry.children) {
      if (openSub.value !== entry.id) openSubmenu(entry, false)
    } else closeSubmenu()
  }, 400)
}

function onBack(): void {
  const index = props.entries.findIndex((entry) => entry.id === openSub.value)
  closeSubmenu()
  if (index >= 0) focusIndex(index)
}

function move(step: number): void {
  const list = items.value
  if (list.length === 0) return
  const at = list.indexOf(active.value)
  const next =
    at === -1 ? (step > 0 ? 0 : list.length - 1) : (at + step + list.length) % list.length
  const target = list[next]
  if (target !== undefined) focusIndex(target)
}

/*
 * A submenu sits inside this list, so its keys bubble here — but it stops the
 * ones it handles, and the rest (Tab) mean the same thing at every level.
 */
function onKeydown(event: KeyboardEvent): void {
  const entry = entryAt(active.value)
  switch (event.key) {
    case 'ArrowDown':
      move(1)
      break
    case 'ArrowUp':
      move(-1)
      break
    case 'Home':
      focusIndex(items.value[0] ?? -1)
      break
    case 'End':
      focusIndex(items.value[items.value.length - 1] ?? -1)
      break
    case 'ArrowRight':
      if (entry?.children) choose(active.value, true)
      else if (!props.nested) emit('next')
      break
    case 'ArrowLeft':
      if (props.nested) emit('back')
      else emit('prev')
      break
    case 'Enter':
    case ' ':
      if (!entry) break
      if (entry.href) {
        /*
         * A link opens on Enter by the browser's own default action, which
         * fires its click — and the click closes the menus. Closing here
         * instead would unmount the link in the microtask that runs before
         * that default action, and nothing would open. Space is not a link
         * key, so it clicks by hand. Either way the menus above must not see
         * the key: a parent would take it as «open my submenu».
         */
        event.stopPropagation()
        if (event.key === ' ') {
          event.preventDefault()
          element(active.value)?.click()
        }
        return
      }
      choose(active.value, true)
      break
    case 'Escape':
      if (props.nested) emit('back')
      else emit('close', true)
      break
    case 'Tab':
      emit('close', false)
      return
    default:
      return
  }
  event.preventDefault()
  event.stopPropagation()
}

const itemClass = computed(() =>
  props.size === 'start'
    ? 'h-[34px] gap-2 pl-1 pr-1.5 py-px w-[200px]'
    : 'h-5 w-full gap-1.5 pl-0.5 pr-1 min-w-[196px]'
)
</script>

<template>
  <ul
    ref="list"
    role="menu"
    tabindex="-1"
    :aria-labelledby="labelledby"
    :aria-label="label"
    class="m-0 flex list-none flex-col bg-card p-0.5 shadow-window outline-none"
    @keydown="onKeydown"
  >
    <template v-for="(entry, index) in entries" :key="entry.id">
      <li
        v-if="entry.kind === 'separator'"
        role="separator"
        class="h-0.5 shadow-[inset_0_1px_var(--color-bevel-shadow),inset_0_-1px_var(--color-bevel-highlight)]"
      />
      <li v-else role="none" class="relative" @pointerenter="onHover(index)">
        <!--
          A link or a native button, written out: the site registers rowkit's
          Button globally, so <component :is="'button'"> would resolve to it.
        -->
        <a
          v-if="entry.href && !entry.disabled"
          :href="entry.href"
          :target="isExternal(entry.href) ? '_blank' : undefined"
          :rel="isExternal(entry.href) ? 'noreferrer' : undefined"
          :data-index="index"
          role="menuitem"
          tabindex="-1"
          :aria-haspopup="entry.children ? 'menu' : undefined"
          :aria-expanded="entry.children && !drill ? openSub === entry.id : undefined"
          :aria-disabled="entry.disabled ? 'true' : undefined"
          class="flex cursor-default items-center border-0 text-left text-ui text-foreground no-underline outline-none"
          :class="[
            itemClass,
            (active === index || openSub === entry.id) && !entry.disabled
              ? 'bg-surface-selected text-on-selected'
              : 'bg-transparent',
            entry.disabled ? 'text-text-disabled text-shadow-disabled' : '',
          ]"
          @click="emit('close', false)"
        >
          <span
            class="relative flex shrink-0 items-center justify-center"
            :class="size === 'start' ? 'size-8' : 'size-4'"
          >
            <component :is="entry.icon" v-if="entry.icon" />
          </span>
          <span class="min-w-0 flex-1 truncate">{{ entry.text }}</span>
          <span v-if="entry.shortcut" class="shrink-0">{{ entry.shortcut }}</span>
          <TriangleRightIcon v-if="entry.children" class="shrink-0" />
        </a>
        <button
          v-else
          type="button"
          :data-index="index"
          role="menuitem"
          tabindex="-1"
          :aria-haspopup="entry.children ? 'menu' : undefined"
          :aria-expanded="entry.children && !drill ? openSub === entry.id : undefined"
          :aria-disabled="entry.disabled ? 'true' : undefined"
          class="flex cursor-default items-center border-0 text-left text-ui text-foreground no-underline outline-none"
          :class="[
            itemClass,
            (active === index || openSub === entry.id) && !entry.disabled
              ? 'bg-surface-selected text-on-selected'
              : 'bg-transparent',
            entry.disabled ? 'text-text-disabled text-shadow-disabled' : '',
          ]"
          @click="choose(index, false)"
        >
          <span
            class="relative flex shrink-0 items-center justify-center"
            :class="size === 'start' ? 'size-8' : 'size-4'"
          >
            <component :is="entry.icon" v-if="entry.icon" />
          </span>
          <span class="min-w-0 flex-1 truncate">{{ entry.text }}</span>
          <span v-if="entry.shortcut" class="shrink-0">{{ entry.shortcut }}</span>
          <TriangleRightIcon v-if="entry.children" class="shrink-0" />
        </button>
        <SiteMenu
          v-if="entry.children && openSub === entry.id && !drill"
          ref="subMenu"
          :entries="entry.children"
          :label="entry.text"
          nested
          class="absolute top-[-3px] left-full z-10"
          :style="subStyle"
          @close="(focus) => emit('close', focus)"
          @back="onBack"
        />
      </li>
    </template>
  </ul>
</template>
