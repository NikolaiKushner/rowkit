<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { DocumentIcon, FolderIcon, FolderOpenIcon, TriangleRightIcon } from 'rowkit'
import type { NavNode } from './useSiteNav'

/**
 * The Explorer window's left pane: the docs as a folder tree. Folders on the
 * way to the current page open by themselves; the rest open on demand.
 *
 * A WAI-ARIA tree with one tab stop: ↑ ↓ move, → opens a folder or steps into
 * it, ← closes it or steps out, Enter opens the page, Home and End jump.
 */
const props = defineProps<{
  tree: NavNode[]
  current: NavNode | undefined
}>()

const router = useRouter()
const open = ref(new Set<string>())

// Every folder on the path to the page opens when the page changes, without
// closing folders the reader opened themselves.
watch(
  () => props.current,
  (node) => {
    if (!node) return
    open.value = new Set([...open.value, ...node.path.map((folder) => folder.id)])
  },
  { immediate: true }
)

interface Row {
  node: NavNode
  depth: number
  folder: boolean
  expanded: boolean
}

const rows = computed(() => {
  const out: Row[] = []
  const walk = (nodes: NavNode[], depth: number) => {
    for (const node of nodes) {
      const folder = node.children.length > 0
      const expanded = folder && open.value.has(node.id)
      out.push({ node, depth, folder, expanded })
      if (expanded) walk(node.children, depth + 1)
    }
  }
  walk(props.tree, 0)
  return out
})

/** The row holding the tab stop: the current page, or the first row. */
const focused = ref<string>()
const tabStop = computed(() => {
  const ids = rows.value.map((row) => row.node.id)
  if (focused.value !== undefined && ids.includes(focused.value)) return focused.value
  return props.current?.id ?? ids[0]
})

const list = ref<HTMLElement>()

function focusRow(id: string): void {
  focused.value = id
  void nextTick(() =>
    list.value?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus()
  )
}

function toggle(row: Row, value = !row.expanded): void {
  const next = new Set(open.value)
  if (value) next.add(row.node.id)
  else next.delete(row.node.id)
  open.value = next
}

function activate(row: Row): void {
  if (row.folder) toggle(row)
  else if (row.node.link !== undefined) void router.go(withBase(row.node.link))
}

function onKeydown(event: KeyboardEvent, index: number): void {
  const row = rows.value[index]
  if (!row) return
  const move = (to: number) => {
    const target = rows.value[Math.max(0, Math.min(rows.value.length - 1, to))]
    if (target) focusRow(target.node.id)
  }
  switch (event.key) {
    case 'ArrowDown':
      move(index + 1)
      break
    case 'ArrowUp':
      move(index - 1)
      break
    case 'Home':
      move(0)
      break
    case 'End':
      move(rows.value.length - 1)
      break
    case 'ArrowRight':
      if (row.folder && !row.expanded) toggle(row, true)
      else if (row.folder) move(index + 1)
      break
    case 'ArrowLeft': {
      if (row.folder && row.expanded) {
        toggle(row, false)
        break
      }
      const parent = row.node.path[row.node.path.length - 1]
      if (parent) focusRow(parent.id)
      break
    }
    case 'Enter':
    case ' ':
      activate(row)
      break
    default:
      return
  }
  event.preventDefault()
}
</script>

<template>
  <ul
    ref="list"
    role="tree"
    aria-label="Contents"
    class="m-0 list-none px-0.5 py-1 modern:flex modern:flex-col modern:gap-px modern:p-0"
  >
    <li
      v-for="(row, index) in rows"
      :key="row.node.id"
      role="treeitem"
      :data-id="row.node.id"
      :aria-level="row.depth + 1"
      :aria-expanded="row.folder ? row.expanded : undefined"
      :aria-current="row.node.id === current?.id ? 'page' : undefined"
      :tabindex="row.node.id === tabStop ? 0 : -1"
      class="group flex h-[22px] cursor-default items-center gap-1 pl-[calc(2px+var(--depth)*16px)] outline-none modern:h-6 modern:gap-1.5 modern:rounded-[5px] modern:pr-2 modern:pl-[calc(6px+var(--depth)*16px)] modern:focus-visible:focus-outer modern:focus-visible:[outline-offset:calc(var(--rk-focus-outer-width)*-1)] modern:aria-[current=page]:bg-surface-selected modern:aria-[current=page]:text-on-selected modern:aria-[current=page]:[--rk-icon-tone-folder:currentColor]"
      :style="{ '--depth': row.depth }"
      @keydown="onKeydown($event, index)"
      @focus="focused = row.node.id"
    >
      <!-- The [+]/[−] box: 9px, white, a 1px grey frame. A page has none. -->
      <span
        class="relative size-[9px] shrink-0 modern:hidden"
        :class="row.folder && 'border border-border bg-input'"
        @click="row.folder && toggle(row)"
      >
        <template v-if="row.folder">
          <span class="absolute top-[3px] left-px h-px w-[5px] bg-foreground" />
          <span
            v-if="!row.expanded"
            class="absolute top-px left-[3px] h-[5px] w-px bg-foreground"
          />
        </template>
      </span>
      <!-- The modern sidebar's disclosure triangle, in place of the [+]/[−] box: 9px wide on a folder, 12 on a page. -->
      <span
        class="flex h-3 shrink-0 items-center justify-center text-text-subtle group-aria-[current=page]:text-on-selected win98:hidden [&_svg]:size-[9px]"
        :class="row.folder ? 'w-[9px]' : 'w-3'"
        @click="row.folder && toggle(row)"
      >
        <TriangleRightIcon
          v-if="row.folder"
          class="transition-transform duration-(--rk-duration-control)"
          :class="row.expanded && 'rotate-90'"
        />
      </span>
      <FolderOpenIcon v-if="row.folder && row.expanded" class="shrink-0" />
      <FolderIcon v-else-if="row.folder" class="shrink-0" />
      <DocumentIcon v-else class="shrink-0" />
      <a
        v-if="row.node.link !== undefined"
        :href="withBase(row.node.link)"
        tabindex="-1"
        class="rk-tree-label"
        :class="row.node.id === current?.id && 'rk-tree-label-selected'"
        >{{ row.node.text }}</a
      >
      <span v-else class="rk-tree-label" @click="toggle(row)">{{ row.node.text }}</span>
    </li>
  </ul>
</template>

<style scoped>
/*
 * The label box: 1px of padding so the navy selection and the dotted focus
 * rectangle sit just around the text, as an Explorer tree draws them.
 */
.rk-tree-label {
  padding: 0 1px;
  font-size: var(--text-ui);
  line-height: var(--text-ui--line-height);
  color: var(--color-foreground);
  text-decoration: none;
  white-space: nowrap;
}

.rk-tree-label-selected {
  background: var(--color-surface-selected);
  color: var(--color-on-selected);
}

li:focus-visible > .rk-tree-label {
  outline: 1px dotted var(--color-ring);
}
</style>
