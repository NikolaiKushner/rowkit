import { computed } from 'vue'
import { useData, type DefaultTheme } from 'vitepress'

/** A group or a page of the sidebar tree. */
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

/** The site's navigation as a tree, read from the sidebar config (the Components page lists from it). */
export function useSiteNav() {
  const { theme } = useData<DefaultTheme.Config>()
  const tree = computed(() => {
    const sidebar = theme.value.sidebar
    return Array.isArray(sidebar) ? build(sidebar, [], '') : []
  })
  return { tree }
}

/** The folder of the tree with this text, or nothing. */
export function folder(tree: NavNode[], text: string): NavNode | undefined {
  return tree.find((node) => node.text === text)
}
