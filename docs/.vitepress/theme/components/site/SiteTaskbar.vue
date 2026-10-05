<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { Separator, version } from 'rowkit'

/**
 * The taskbar along the bottom of the screen: Start, the page on screen as
 * the one task, and the tray — the version (to the changelog), GitHub and a
 * clock. 28px, raised, the Win98 way round: light outer edge on top.
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
</script>

<template>
  <footer class="rk-taskbar flex h-7 shrink-0 items-center gap-1 bg-card p-0.5">
    <a
      :href="withBase('/')"
      class="flex h-[22px] shrink-0 items-center gap-1 pr-1.5 pl-0.5 font-bold text-ui text-foreground no-underline shadow-raised outline-none active:shadow-pressed [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
      <span class="px-px">Start</span>
    </a>
    <Separator orientation="vertical" decorative class="h-[22px] self-center" />
    <!--
      The one task: this page. Active, so pressed in over the dither. Two
      elements rather than <component :is="'button'">: the site registers
      rowkit's Button globally, and Vue would resolve the string to it.
    -->
    <button
      v-if="taskButton"
      type="button"
      class="flex h-[22px] w-40 min-w-0 shrink items-center gap-1 overflow-hidden bg-dither px-1 pt-px font-bold text-ui text-foreground shadow-pressed outline-none [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring"
      @click="$emit('task')"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" class="shrink-0" />
      <span class="truncate">{{ task }}</span>
    </button>
    <div
      v-else
      aria-hidden="true"
      class="flex h-[22px] w-40 min-w-0 shrink items-center gap-1 overflow-hidden bg-dither px-1 pt-px font-bold text-ui text-foreground shadow-pressed outline-none [&:focus-visible>span]:outline-1 [&:focus-visible>span]:outline-dotted [&:focus-visible>span]:outline-ring"
    >
      <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" class="shrink-0" />
      <span class="truncate">{{ task }}</span>
    </div>
    <div class="flex-1" />
    <div
      class="flex h-[22px] shrink-0 items-center gap-1.5 px-1.5 text-ui text-foreground shadow-status"
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
