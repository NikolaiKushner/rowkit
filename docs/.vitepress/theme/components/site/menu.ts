import type { Component } from 'vue'
import { withBase } from 'vitepress'
import { DocumentIcon, FolderIcon } from 'rowkit'
import type { NavNode } from './useSiteNav'

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
    }
  | { kind: 'separator'; id: string }

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
