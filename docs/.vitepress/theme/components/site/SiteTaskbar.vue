<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { Separator, version } from 'rowkit'
import SiteMenuBar from './SiteMenuBar.vue'
import StartMenu from './StartMenu.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import { siteTheme } from './useSiteTheme'

/**
 * The taskbar along the bottom of the screen: Start, the page on screen as
 * the one task, and the tray — the version (to the changelog), GitHub and a
 * clock. 34px, raised, the Win98 way round: light outer edge on top.
 *
 * Start opens the Start menu and stays pressed while it is open. Opened from
 * the keyboard, the menu starts on its first item; by the pointer, on none.
 */
defineProps<{
  /** The task's label: the page title. */
  task: string
  /**
   * The task is a button — on the desktop, where it brings back windows that
   * were closed. Elsewhere it only shows which page is open.
   */
  taskButton?: boolean
}>()

defineEmits<{ task: [] }>()

// The clock renders on the client only; the server's time would be wrong by
// the time anyone read it, and would not match on hydration.
const time = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function tick(): void {
  time.value = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 10_000)
})
onBeforeUnmount(() => clearInterval(timer))

const start = ref<HTMLButtonElement>()
const menu = ref<{ focusFirst: () => void; focusPanel: () => void }>()
const startOpen = ref(false)

function toggleStart(event: MouseEvent): void {
  startOpen.value = !startOpen.value
  if (!startOpen.value) return
  // A click from Enter or Space has no pointer position.
  const fromKeyboard = event.detail === 0
  void nextTick(() => (fromKeyboard ? menu.value?.focusFirst() : menu.value?.focusPanel()))
}

function closeStart(focusStart: boolean): void {
  startOpen.value = false
  if (focusStart) start.value?.focus()
}
</script>

<template>
  <!--
    In the modern theme the taskbar is the menu bar: at the top (`order-first`
    in the page's column), the Start button becomes the rowkit menu, the
    window's menus move up into it, and there is no task button.
  -->
  <footer
    class="rk-taskbar flex h-[34px] shrink-0 items-center gap-1 bg-card p-0.5 modern:order-first modern:z-40 modern:h-7 modern:gap-2 modern:px-2 modern:py-0"
  >
    <button
      ref="start"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="startOpen"
      class="flex h-[27px] shrink-0 items-center gap-1 pr-1.5 pl-0.5 font-bold text-ui text-foreground outline-none [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring modern:h-6 modern:rounded-sm modern:px-2 modern:pt-0 modern:font-strong modern:shadow-none modern:hover:bg-control-ghost-hover modern:focus-visible:focus-outer"
      :class="startOpen ? 'pt-px pl-[3px] shadow-pressed' : 'shadow-raised active:shadow-pressed'"
      @click="toggleStart"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
      <span class="px-px modern:hidden">Start</span>
      <span class="win98:hidden">rowkit</span>
    </button>
    <StartMenu v-if="startOpen" ref="menu" :anchor="start" @close="closeStart" />
    <Separator orientation="vertical" decorative class="h-[27px] self-center modern:hidden" />
    <SiteMenuBar v-if="siteTheme === 'modern'" class="bg-transparent p-0 win98:hidden" />
    <!--
      The one task: this page. Active, so pressed in over the dither. Two
      elements rather than <component :is="'button'">: the site registers
      rowkit's Button globally, and Vue would resolve the string to it.
    -->
    <button
      v-if="taskButton"
      type="button"
      class="flex h-[27px] w-40 min-w-0 shrink items-center gap-1 overflow-hidden bg-dither px-1 pt-px font-bold text-ui text-foreground shadow-pressed outline-none [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring modern:hidden"
      @click="$emit('task')"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" class="shrink-0" />
      <span class="truncate">{{ task }}</span>
    </button>
    <div
      v-else
      aria-hidden="true"
      class="flex h-[27px] w-40 min-w-0 shrink items-center gap-1 overflow-hidden bg-dither px-1 pt-px font-bold text-ui text-foreground shadow-pressed outline-none [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring modern:hidden"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" class="shrink-0" />
      <span class="truncate">{{ task }}</span>
    </div>
    <div class="flex-1" />
    <ThemeSwitch />
    <div
      class="flex h-[27px] shrink-0 items-center gap-1.5 px-1.5 text-ui text-foreground shadow-status modern:shadow-none"
    >
      <a
        href="https://github.com/NikolaiKushner/rowkit/releases"
        target="_blank"
        rel="noreferrer"
        class="text-foreground no-underline"
        >v{{ version }}</a
      >
      <a
        href="https://github.com/NikolaiKushner/rowkit"
        target="_blank"
        rel="noreferrer"
        class="text-foreground underline"
        >GitHub</a
      >
      <time class="min-w-[28px] tabular-nums">{{ time }}</time>
    </div>
  </footer>
</template>

<style scoped>
/* The taskbar's raised edge is the reverse of a button's: light outer line on top. */
.rk-taskbar {
  box-shadow:
    inset -1px -1px var(--color-bevel-dark),
    inset 1px 1px var(--color-bevel-light),
    inset -2px -2px var(--color-bevel-shadow),
    inset 2px 2px var(--color-bevel-highlight);
}
</style>
