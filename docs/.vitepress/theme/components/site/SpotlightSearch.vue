<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import {
  CloseGlyphIcon,
  Dialog,
  DialogContent,
  DialogTitle,
  DocumentIcon,
  FolderIcon,
  Search32Icon,
  SearchIcon,
} from 'rowkit'
import { find, indexReady, loadIndex, recent, type FindResult } from './useFindIndex'
import { finding } from './useFind'
import { recentPaths, useSiteNav } from './useSiteNav'

/**
 * Search in the modern theme, as Spotlight draws it (Figma SiteModern/
 * Spotlight): one large field at the top, the results grouped by section
 * under it, the keys in a strip along the bottom. Empty, it lists the pages
 * opened recently. The same search as Windows 98's Find window: pages and
 * folders by name, then sections of pages by their text.
 *
 * The field is a combobox over the results: ↑ ↓ move the highlight without
 * leaving it, Return opens, Escape closes. A dialog underneath, so focus
 * stays in and goes back where it was; without its title bar or the dimmed
 * page, which Spotlight does not have.
 */
const { tree } = useSiteNav()
const router = useRouter()

const query = ref('')
const searched = ref('')
const active = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()

let typing: ReturnType<typeof setTimeout> | undefined
watch(query, (value) => {
  clearTimeout(typing)
  typing = setTimeout(() => (searched.value = value), 80)
})

const results = computed<FindResult[]>(() => {
  void indexReady.value
  const term = searched.value.trim()
  if (!term) return recent(recentPaths.value, tree.value)
  // Three groups of three at most, as the design lists them: the best of each
  // section, not a long scroll.
  const perGroup = new Map<string, number>()
  return find(term, tree.value).filter((result) => {
    const seen = perGroup.get(result.group)
    if (seen === undefined && perGroup.size === 3) return false
    perGroup.set(result.group, (seen ?? 0) + 1)
    return (seen ?? 0) < 3
  })
})

/** Results in groups, in the order the groups first appear. */
const groups = computed(() => {
  const byName = new Map<string, { name: string; rows: { result: FindResult; index: number }[] }>()
  results.value.forEach((result, index) => {
    const group = byName.get(result.group) ?? { name: result.group, rows: [] }
    group.rows.push({ result, index })
    byName.set(result.group, group)
  })
  return [...byName.values()]
})

// Results highlight their first row, for Return; the recent pages wait for an arrow.
watch(results, () => (active.value = searched.value.trim() ? 0 : -1), { immediate: true })

watch(finding, (open) => {
  if (!open) return
  void loadIndex()
  void nextTick(() => input.value?.select())
})

/** «Components › Data», «Components · 5 pages», «Section · Components › DataTable». */
function subtitle(result: FindResult): string {
  const trail = result.trail.join(' › ')
  if (result.pages !== undefined) {
    const pages = `${String(result.pages)} ${result.pages === 1 ? 'page' : 'pages'}`
    return trail ? `${trail} · ${pages}` : pages
  }
  if (result.type === 'Section') return trail ? `Section · ${trail}` : 'Section'
  return trail || 'rowkit docs'
}

function open(index: number): void {
  const result = results.value[index]
  if (!result) return
  finding.value = false
  // The next search starts empty, on the pages opened recently.
  query.value = ''
  searched.value = ''
  void router.go(result.href)
}

function clear(): void {
  query.value = ''
  searched.value = ''
  input.value?.focus()
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
      if (count) active.value = active.value <= 0 ? count - 1 : active.value - 1
      scrollIntoView()
      break
    case 'Enter':
      // Return before the last keystrokes are searched searches them first.
      clearTimeout(typing)
      if (searched.value !== query.value) searched.value = query.value
      void nextTick(() => open(active.value))
      break
    default:
      return
  }
  event.preventDefault()
}

const optionId = (index: number) => `rk-spotlight-option-${String(index)}`
const status = computed(() => {
  if (!searched.value.trim()) return ''
  const count = results.value.length
  return count ? `${String(count)} ${count === 1 ? 'result' : 'results'}` : 'No results'
})
</script>

<template>
  <Dialog v-model:open="finding">
    <DialogContent
      close-label="Close search"
      data-spotlight
      class="top-[150px] w-[680px] max-w-[calc(100vw-1rem)] translate-y-0 overflow-hidden rounded-xl bg-card p-0 shadow-[0_10px_30px_rgb(0_0_0/0.15),0_0_0_1px_rgb(0_0_0/0.1)] [backdrop-filter:var(--rk-popover-backdrop)] max-md:top-[72px] [&>[data-slot=dialog-title-bar]]:hidden"
    >
      <DialogTitle class="sr-only">Search rowkit docs</DialogTitle>

      <div class="flex h-14 shrink-0 items-center gap-3 px-[18px]">
        <SearchIcon class="size-[22px] shrink-0 text-muted-foreground" />
        <!--
          A text field rather than a search field: a search field spends the
          first Escape on clearing itself, and here Escape closes, as the
          strip along the bottom says. The ✕ clears instead.
        -->
        <input
          ref="input"
          v-model="query"
          type="text"
          role="combobox"
          aria-label="Search rowkit docs"
          placeholder="Search rowkit"
          autocomplete="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-controls="rk-spotlight-results"
          :aria-expanded="results.length > 0"
          :aria-activedescendant="active >= 0 && results.length ? optionId(active) : undefined"
          class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[22px] leading-7 text-foreground caret-control-primary outline-none placeholder:text-text-subtle"
          @keydown="onKeydown"
        />
        <button
          v-if="query"
          type="button"
          aria-label="Clear search"
          class="flex size-5 shrink-0 items-center justify-center rounded-full text-text-subtle outline-none hover:bg-control-ghost-hover focus-visible:focus-outer [&_svg]:size-3"
          @click="clear"
        >
          <CloseGlyphIcon />
        </button>
      </div>

      <template v-if="results.length || searched.trim()">
        <div class="h-px shrink-0 bg-border" />
        <div
          v-if="results.length"
          id="rk-spotlight-results"
          ref="list"
          role="listbox"
          aria-label="Results"
          class="scrollbar-themed flex max-h-[min(60vh,420px)] flex-col gap-1.5 overflow-y-auto px-2 pt-1.5 pb-2"
        >
          <div
            v-for="group in groups"
            :key="group.name"
            role="group"
            :aria-labelledby="`rk-spotlight-group-${group.name}`"
            class="flex flex-col gap-0.5"
          >
            <div
              :id="`rk-spotlight-group-${group.name}`"
              class="pt-1.5 pb-1 pl-2 font-strong text-ui text-text-subtle"
            >
              {{ group.name }}
            </div>
            <div
              v-for="{ result, index } in group.rows"
              :id="optionId(index)"
              :key="result.id"
              :data-index="index"
              role="option"
              :aria-selected="index === active"
              class="group flex h-10 cursor-default items-center gap-2.5 rounded-[7px] pr-3 pl-2 text-ui aria-selected:bg-surface-selected aria-selected:text-on-selected aria-selected:[--rk-icon-tone-folder:currentColor]"
              @click="open(index)"
              @pointermove="active = index"
            >
              <span
                class="flex size-[26px] shrink-0 items-center justify-center rounded-[5px] bg-control-latched text-muted-foreground group-aria-selected:bg-transparent group-aria-selected:text-on-selected group-aria-selected:shadow-[inset_0_0_0_1px_currentColor]"
              >
                <FolderIcon v-if="result.pages !== undefined" />
                <DocumentIcon v-else />
              </span>
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="truncate font-strong">{{ result.name }}</span>
                <span class="truncate text-text-subtle group-aria-selected:text-on-selected">{{
                  subtitle(result)
                }}</span>
              </span>
              <span v-if="index === active" aria-hidden="true" class="shrink-0">Return</span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center gap-2 px-2 py-[34px] text-center">
          <Search32Icon class="text-text-subtle" />
          <p class="m-0 text-heading font-strong text-foreground">
            No results for “{{ searched.trim() }}”
          </p>
          <p class="m-0 text-ui text-text-subtle">
            Try a component name, a prop, or a token such as --color-link.
          </p>
        </div>
      </template>

      <p class="sr-only" aria-live="polite">{{ status }}</p>

      <div
        aria-hidden="true"
        class="flex h-[34px] shrink-0 items-center gap-4 bg-control-ghost-hover/6 px-[18px] text-ui text-text-subtle"
      >
        <span>↑ ↓ to move</span>
        <span>Return to open</span>
        <span class="max-md:hidden">Esc to close</span>
        <span class="flex-1" />
        <span class="max-md:hidden">rowkit docs</span>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style>
/* Spotlight floats over the page as it is: no dimming behind it. */
:root:has([data-spotlight][data-state='open']) [data-slot='dialog-overlay'] {
  background: transparent;
}
</style>
