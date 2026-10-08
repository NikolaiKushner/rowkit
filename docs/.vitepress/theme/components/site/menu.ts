import type { Component } from 'vue'
import { withBase } from 'vitepress'
import { DocumentIcon, FolderIcon } from 'rowkit'
import type { NavNode } from './useSiteNav'
import { setSiteScheme, siteScheme, type SiteScheme } from './useSiteTheme'

/** One entry of a drop-down or Start menu. */
export type MenuEntry =
  | {
      kind: 'item'
      id: string
      text: string
      /** A page to open. External links open in a new tab. */
      href?: string
      /** What the item does instead of opening a page. */
      action?: () => void
      /** A submenu: the item opens it rather than doing anything itself. */
      children?: MenuEntry[]
      /** The icon in the gutter: 16px in a drop-down, 32px in the Start menu. */
      icon?: Component
      shortcut?: string
      disabled?: boolean
      /** One of a set of choices: drawn with a check mark when chosen. */
      checked?: boolean
    }
  | { kind: 'separator'; id: string }
  /** A heading over the items after it. Modern menus only; not an item. */
  | { kind: 'header'; id: string; text: string }

export type MenuItem = Extract<MenuEntry, { kind: 'item' }>

export const isExternal = (href: string) => /^https?:/.test(href)

/** A folder of the docs tree as menu entries: folders become submenus, pages links. */
export function fromTree(nodes: NavNode[]): MenuEntry[] {
  return nodes.map((node) => {
    if (node.children.length > 0) {
      return {
        kind: 'item',
        id: node.id,
        text: node.text,
        icon: FolderIcon,
        children: fromTree(node.children),
      }
    }
    return {
      kind: 'item',
      id: node.id,
      text: node.text,
      icon: DocumentIcon,
      href: withBase(node.link ?? '/'),
    }
  })
}

/** The folder of the tree with this text, or nothing. */
export function folder(tree: NavNode[], text: string): NavNode | undefined {
  return tree.find((node) => node.text === text)
}

/**
 * A folder's menu: its subfolders and pages, then — under a separator — the
 * folder's own page, as Figma's Components cascade ends on «All components».
 */
export function folderMenu(node: NavNode | undefined, label: string): MenuEntry[] {
  if (!node) return []
  const entries = fromTree(node.children)
  if (node.link === undefined) return entries
  return [
    ...entries,
    { kind: 'separator', id: `${node.id}-sep` },
    {
      kind: 'item',
      id: `${node.id}-all`,
      text: label,
      icon: FolderIcon,
      href: withBase(node.link),
    },
  ]
}

/**
 * The modern Components menu (Figma SiteModern/Menu/Components): the overview
 * first, then the areas under a «By area» heading, each a submenu.
 */
export function componentsMenu(node: NavNode | undefined): MenuEntry[] {
  if (!node) return []
  return [
    ...(node.link === undefined
      ? []
      : [
          {
            kind: 'item',
            id: `${node.id}-all`,
            text: 'Overview',
            href: withBase(node.link),
          } as const,
          { kind: 'separator', id: `${node.id}-sep` } as const,
        ]),
    { kind: 'header', id: `${node.id}-areas`, text: 'By area' },
    ...fromTree(node.children),
  ]
}

/** The search shortcut as this platform writes it. */
export const searchShortcut = (): string =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('mac')
    ? '⌘K'
    : 'Ctrl+K'

/** The colour schemes (Figma SiteModern/Menu/Scheme), the one in use checked. */
export function schemeMenu(): MenuEntry[] {
  const SCHEMES: [SiteScheme, string, string?][] = [
    ['system', 'Auto', 'follows the system'],
    ['light', 'Light'],
    ['dark', 'Dark'],
  ]
  return SCHEMES.map(([scheme, text, shortcut]) => ({
    kind: 'item',
    id: `scheme-${scheme}`,
    text,
    shortcut,
    checked: siteScheme.value === scheme,
    action: () => setSiteScheme(scheme),
  }))
}
