<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  SearchIcon,
  StatusBar,
  StatusBarSection,
} from 'rowkit'
import { find, indexReady, loadIndex } from './useFindIndex'
import { finding } from './useFind'
import { useSiteNav } from './useSiteNav'

/**
 * Find, as Windows 98's «Find: Files and Folders»: a «Look for» field, Find
 * Now and New Search, the results as a list view — Name · In folder · Type —
 * and the keys in the status bar. Pages and folders match by name; sections
 * by their text, from the index VitePress builds.
 *
 * The field is a combobox over the results: ↑ ↓ move the highlight without
 * leaving the field, Enter opens, Escape closes. The dialog keeps focus in.
 */
const { tree } = useSiteNav()
const router = useRouter()

const query = ref('')
const searched = ref('')
const active = ref(0)
const field = ref<HTMLElement>()
const list = ref<HTMLElement | null>()

// Results follow the typing; Find Now runs the search at once. They are
// worked out again once the index has loaded, for a query typed before it did.
const results = computed(() => {
  void indexReady.value
  return find(searched.value, tree.value)
})

let typing: ReturnType<typeof setTimeout> | undefined
watch(query, (value) => {
  clearTimeout(typing)
  typing = setTimeout(() => (searched.value = value), 120)
})

/*
 * With a scroll bar beside the rows, the header stops 16px short of the right
 * edge, as a Windows 98 list view's does, so its columns stay over theirs.
 */
const scrolling = ref(false)

watch(results, () => {
  active.value = 0
  void nextTick(() => {
    const el = list.value
    scrolling.value = el ? el.scrollHeight > el.clientHeight : false
  })
})

watch(finding, (open) => {
  if (!open) return
  void loadIndex()
  void nextTick(() => field.value?.querySelector('input')?.select())
})

function findNow(): void {
  clearTimeout(typing)
  searched.value = query.value
}

function newSearch(): void {
  query.value = ''
  searched.value = ''
  field.value?.querySelector('input')?.focus()
}

function open(index: number): void {
  const result = results.value[index]
  if (!result) return
  finding.value = false
  void router.go(result.href)
}

function scrollIntoView(): void {
  void nextTick(() =>
    list.value
      ?.querySelector(`[data-index="${String(active.value)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  )
}

function onKeydown(event: KeyboardEvent): void {
  const count = results.value.length
  switch (event.key) {
    case 'ArrowDown':
      if (count) active.value = (active.value + 1) % count
      scrollIntoView()
      break
    case 'ArrowUp':
      if (count) active.value = (active.value - 1 + count) % count
      scrollIntoView()
      break
    case 'Enter':
      // Enter opens the highlighted result once there are results for this
      // text; before then, it is Find Now.
      if (searched.value === query.value && count) open(active.value)
      else findNow()
      break
    default:
      return
  }
  event.preventDefault()
}

const optionId = (index: number) => `rk-find-option-${String(index)}`
</script>

<template>
  <Dialog v-model:open="finding">
    <DialogContent
      close-label="Close Find"
      class="top-40 w-[calc(100vw-1rem)] max-w-[560px] translate-y-0 max-md:top-[120px]"
    >
      <DialogHeader>
        <DialogTitle>Find: rowkit docs</DialogTitle>
      </DialogHeader>

      <div class="flex items-start gap-3 p-3">
        <div ref="field" class="flex min-w-0 flex-1 flex-col gap-1">
          <label for="rk-find-query" class="text-ui text-foreground">Look for:</label>
          <Input
            id="rk-find-query"
            v-model="query"
            type="text"
            size="lg"
            class="w-full"
            role="combobox"
            autocomplete="off"
            aria-autocomplete="list"
            aria-controls="rk-find-results"
            :aria-expanded="results.length > 0"
            :aria-activedescendant="results.length ? optionId(active) : undefined"
            @keydown="onKeydown"
          >
            <!--
              A text field with the magnifier rather than a search field: a
              search field spends the first Escape on clearing itself, and
              here Escape closes Find, as the status bar says.
            -->
            <template #leading><SearchIcon /></template>
          </Input>
        </div>
        <div class="flex flex-col gap-1.5 pt-[21px]">
          <Button class="w-full" @click="findNow">Find Now</Button>
          <Button variant="secondary" class="w-full" @click="newSearch">New Search</Button>
        </div>
      </div>

      <!-- The results: a list view in a sunken white well, 160px tall. -->
      <div class="flex h-40 min-h-0 flex-col bg-input p-0.5 shadow-sunken">
        <div aria-hidden="true" class="flex shrink-0" :class="scrolling && 'pr-4'">
          <span class="rk-find-head min-w-0 flex-1">Name</span>
          <span class="rk-find-head w-40 max-md:w-28">In folder</span>
          <span class="rk-find-head w-[90px]">Type</span>
        </div>
        <ul
          v-if="results.length"
          id="rk-find-results"
          ref="list"
          role="listbox"
          aria-label="Results"
          class="scrollbar-themed m-0 min-h-0 flex-1 list-none overflow-y-auto p-0"
        >
          <li
            v-for="(result, index) in results"
            :id="optionId(index)"
            :key="result.id"
            :data-index="index"
            role="option"
            :aria-selected="index === active"
            class="flex h-[27px] cursor-default items-center text-ui"
            :class="index === active ? 'bg-surface-selected text-on-selected' : 'text-foreground'"
            @click="open(index)"
            @pointermove="active = index"
          >
            <span class="min-w-0 flex-1 truncate px-1.5">{{ result.name }}</span>
            <span class="w-40 truncate px-1.5 max-md:w-28">{{ result.folder }}</span>
            <span class="w-[90px] truncate px-1.5">{{ result.type }}</span>
          </li>
        </ul>
        <div v-else-if="searched.trim()" class="flex flex-1 items-center justify-center">
          <EmptyState
            reason="no-results"
            size="sm"
            :level="3"
            :title="`No results for «${searched.trim()}»`"
            description="Check the spelling or type fewer letters."
          />
        </div>
      </div>

      <StatusBar class="pt-0.5">
        <!--
          The count stays narrow and the keys take the rest, as Figma draws it.
          `!`: the status bar stretches its first section with a selector on
          the parent, which outranks a class on the section.
        -->
        <StatusBarSection class="w-auto flex-none!" aria-live="polite">
          {{ searched.trim() ? `${String(results.length)} results` : 'Ready' }}
        </StatusBarSection>
        <StatusBarSection class="flex-1">↑ ↓ move · Enter opens · Esc closes</StatusBarSection>
      </StatusBar>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* A list-view column header: the raised button face, 27px. */
.rk-find-head {
  display: flex;
  align-items: center;
  height: 27px;
  padding: 0 4px;
  background: var(--color-card);
  box-shadow: var(--shadow-raised);
  font-size: var(--text-ui);
  line-height: var(--text-ui--line-height);
  color: var(--color-foreground);
}
</style>
