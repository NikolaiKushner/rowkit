<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import { Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

/**
 * «On this page»: the page's sections in a sunken white list, the one in view
 * highlighted navy, as a list box's selected row. Built from the h2s once the
 * page renders; follows the pane as it scrolls.
 *
 * On a narrow screen, where there is no room beside the text, it is a
 * drop-down list above it instead — «On this page: Example» — and choosing a
 * section scrolls to it.
 */
const props = withDefaults(
  defineProps<{
    /** The element that scrolls the page. */
    scroller: HTMLElement | undefined
    as?: 'list' | 'select'
  }>(),
  { as: 'list' }
)

interface Section {
  id: string
  text: string
}

const sections = ref<Section[]>([])
const active = ref<string>()

function collect(): void {
  const headings = document.querySelectorAll<HTMLElement>('.rk-page h2[id]')
  sections.value = Array.from(headings, (heading) => ({
    id: heading.id,
    // The heading's text without VitePress's «#» anchor.
    text: (heading.firstChild?.textContent ?? heading.textContent ?? '').trim(),
  }))
  track()
}

/** The section in view: the last heading at or above the top quarter of the pane. */
function track(): void {
  const pane = props.scroller
  if (!pane) return
  const line = pane.getBoundingClientRect().top + pane.clientHeight / 4
  let current = sections.value[0]?.id
  for (const section of sections.value) {
    const heading = document.getElementById(section.id)
    if (heading && heading.getBoundingClientRect().top <= line) current = section.id
  }
  active.value = current
}

const chosen = computed({
  get: () => active.value,
  set: (id) => {
    if (id === undefined) return
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
    history.replaceState(history.state, '', `#${id}`)
  },
})

onContentUpdated(collect)

// Client only: the headings exist in the DOM, not in the server render.
onMounted(() => {
  props.scroller?.addEventListener('scroll', track, { passive: true })
  collect()
})

watch(
  () => props.scroller,
  (pane, previous) => {
    previous?.removeEventListener('scroll', track)
    pane?.addEventListener('scroll', track, { passive: true })
    collect()
  }
)

onBeforeUnmount(() => props.scroller?.removeEventListener('scroll', track))
</script>

<template>
  <Select v-if="as === 'select' && sections.length > 0" v-model="chosen" class="w-full">
    <SelectTrigger placeholder="On this page" size="lg" class="w-full" />
    <SelectContent>
      <SelectItem
        v-for="section in sections"
        :key="section.id"
        :value="section.id"
        :label="`On this page: ${section.text}`"
      >
        {{ section.text }}
      </SelectItem>
    </SelectContent>
  </Select>
  <nav
    v-else-if="sections.length > 0"
    aria-labelledby="rk-outline-title"
    class="flex flex-col gap-1.5"
  >
    <p id="rk-outline-title" class="m-0 font-bold text-ui text-foreground">On this page</p>
    <ul class="m-0 list-none bg-input p-0.5 shadow-sunken">
      <li v-for="section in sections" :key="section.id">
        <a
          :href="`#${section.id}`"
          :aria-current="section.id === active ? 'location' : undefined"
          class="flex min-h-[22px] items-center py-px pr-1 pl-[16px] text-ui text-foreground no-underline outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring aria-[current]:bg-surface-selected aria-[current]:text-on-selected"
          >{{ section.text }}</a
        >
      </li>
    </ul>
  </nav>
</template>
