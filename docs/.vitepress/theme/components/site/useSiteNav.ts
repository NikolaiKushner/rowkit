import { computed, ref } from 'vue'
import { useData, useRoute, withBase, type DefaultTheme } from 'vitepress'

/** A folder or a page of the Explorer window's tree. */
export interface NavNode {
  /** Stable id: the link for a page, the folder path for a folder. */
  id: string
  text: string
  link?: string
  children: NavNode[]
  /** The folders above this node, outermost first. */
  path: NavNode[]
}

/** `/components/data-table.html`, `/components/data-table/` → `/components/data-table`. */
export function normalize(link: string): string {
  const clean = link.replace(/[?#].*$/, '').replace(/(\.html|\/)$/, '')
  return clean === '' ? '/' : clean
}

function build(items: DefaultTheme.SidebarItem[], path: NavNode[], prefix: string): NavNode[] {
  return items.map((item) => {
    const text = item.text ?? ''
    const id = item.link !== undefined ? normalize(item.link) : `${prefix}/${text}`
    const node: NavNode = { id, text, children: [], path }
    if (item.link !== undefined) node.link = item.link
    node.children = build(item.items ?? [], [...path, node], id)
    return node
  })
}

function flatten(nodes: NavNode[]): NavNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)])
}

/**
 * The site's navigation, read from the sidebar config: the tree, the page on
 * screen and where it sits in the tree.
 */
export function useSiteNav() {
  const { theme, page } = useData<DefaultTheme.Config>()
  const route = useRoute()

  const tree = computed(() => {
    const sidebar = theme.value.sidebar
    return Array.isArray(sidebar) ? build(sidebar, [], '') : []
  })

  const pages = computed(() => flatten(tree.value).filter((node) => node.link !== undefined))

  const current = computed(() => {
    const here = normalize(route.path)
    return pages.value.find((node) => withBase(normalize(node.link ?? '')) === here)
  })

  /** `rowkit:\Components\Data\DataTable`, as the Explorer address bar shows it. */
  const address = computed(() => {
    const node = current.value
    if (!node) return `rowkit:\\${page.value.title}`
    return ['rowkit:', ...node.path.map((folder) => folder.text), node.text].join('\\')
  })

  /**
   * Up: the nearest folder above. A folder with a page of its own — the
   * Components overview — opens it; one without opens its first page that is
   * not this one. Above the top folder is the desktop.
   */
  const up = computed(() => {
    const node = current.value
    if (!node) return '/'
    for (const folder of [...node.path].reverse()) {
      if (folder.link !== undefined) return folder.link
      const first = flatten(folder.children).find((child) => child.link !== undefined)
      if (first && first.id !== node.id) return first.link ?? '/'
    }
    return '/'
  })

  return { tree, pages, current, address, up }
}

/*
 * Back and Forward. The browser keeps the real history, but cannot say whether
 * there is anything to go back to, so the buttons would always look enabled.
 * This tracks the pages visited in this tab, which is what Explorer's buttons
 * reflect, and leaves the actual moving to the browser.
 */
const visited = ref<string[]>([])
const position = ref(-1)

/** Records a navigation. Called after every route change. */
export function recordVisit(path: string, kind: 'push' | 'back' | 'forward'): void {
  if (kind === 'back') position.value = Math.max(0, position.value - 1)
  else if (kind === 'forward')
    position.value = Math.min(visited.value.length - 1, position.value + 1)
  else {
    visited.value = [...visited.value.slice(0, position.value + 1), path]
    position.value = visited.value.length - 1
  }
}

export const canGoBack = computed(() => position.value > 0)
export const canGoForward = computed(() => position.value < visited.value.length - 1)

/** Whether `path` is the page one step back or forward, for popstate. */
export function stepOf(path: string): 'back' | 'forward' | 'push' {
  if (visited.value[position.value - 1] === path) return 'back'
  if (visited.value[position.value + 1] === path) return 'forward'
  return 'push'
}
