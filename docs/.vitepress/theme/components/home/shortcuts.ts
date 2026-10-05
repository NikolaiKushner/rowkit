import type { Component } from 'vue'
import { withBase } from 'vitepress'
import {
  Book32Icon,
  Code32Icon,
  Computer32Icon,
  Document32Icon,
  Folder32Icon,
  Trash32Icon,
} from 'rowkit'

export interface Shortcut {
  label: string
  href: string
  icon: Component
}

/** The desktop's shortcuts, top to bottom: the home page's and the 404's. */
export const shortcuts: Shortcut[] = [
  { label: 'Guide', href: withBase('/introduction'), icon: Book32Icon },
  { label: 'Components', href: withBase('/components/button'), icon: Folder32Icon },
  { label: 'Patterns', href: withBase('/patterns/data-table-page'), icon: Folder32Icon },
  { label: 'Storybook', href: 'https://storybook.rowkit.dev', icon: Computer32Icon },
  { label: 'GitHub', href: 'https://github.com/NikolaiKushner/rowkit', icon: Code32Icon },
  { label: 'Decisions', href: withBase('/decisions/001-typescript-pin'), icon: Document32Icon },
  {
    label: 'Old versions',
    href: 'https://github.com/NikolaiKushner/rowkit/releases',
    icon: Trash32Icon,
  },
]
