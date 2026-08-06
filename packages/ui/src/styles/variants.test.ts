import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'
import { badgeVariants } from '../components/Badge/Badge.variants'
import { buttonVariants } from '../components/Button/Button.variants'
import {
  dataTableCaptionVariants,
  dataTableCellVariants,
  dataTableCheckboxVariants,
  dataTableHeaderCellVariants,
  dataTableHeaderRowVariants,
  dataTableRadioVariants,
  dataTableRowVariants,
  dataTableSelectCellVariants,
  dataTableSortButtonVariants,
  dataTableSortIconVariants,
  dataTableVariants,
  dataTableWrapperVariants,
} from '../components/DataTable/DataTable.variants'
import {
  dialogBodyVariants,
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from '../components/Dialog/Dialog.variants'
import {
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
} from '../components/EmptyState/EmptyState.variants'
import {
  filterBarChipRemoveVariants,
  filterBarChipsVariants,
  filterBarChipVariants,
  filterBarControlsVariants,
  filterBarSummaryVariants,
  filterBarVariants,
} from '../components/FilterBar/FilterBar.variants'
import {
  fieldErrorVariants,
  fieldHintVariants,
  fieldLabelVariants,
  fieldVariants,
} from '../components/Field/Field.variants'
import { inputVariants } from '../components/Input/Input.variants'
import {
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
} from '../components/Select/Select.variants'
import { skeletonVariants } from '../components/Skeleton/Skeleton.variants'
import {
  toastActionVariants,
  toastCloseVariants,
  toasterViewportVariants,
  toastMessageVariants,
  toastVariants,
} from '../components/Toaster/Toaster.variants'
import { tooltipContentVariants } from '../components/Tooltip/Tooltip.variants'
import {
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationSummaryVariants,
  paginationVariants,
} from '../components/Pagination/Pagination.variants'

/**
 * Every class a component can emit has to produce CSS.
 *
 * A Tailwind class that does not match a utility is not an error — it is
 * simply absent from the stylesheet, and the component renders subtly wrong
 * with nothing in the console. That is exactly how `duration-fast` shipped
 * against a theme namespace Tailwind does not read.
 *
 * This walks every variant combination of every component, collects the class
 * names, and asserts each one reaches the compiled output.
 */

const require = createRequire(import.meta.url)
const stylesDir = dirname(fileURLToPath(import.meta.url))

async function loadStylesheet(id: string, base: string) {
  const specifier = id === 'tailwindcss' ? 'tailwindcss/index.css' : id
  const path = specifier.startsWith('.')
    ? resolve(base, specifier)
    : require.resolve(specifier, { paths: [base] })
  return { path, base: dirname(path), content: await readFile(path, 'utf8') }
}

/** Escapes a class name into the selector Tailwind emits for it. */
function toSelector(className: string): string {
  return `.${className.replace(/[:.[\]()/%!#,'"+*~>^$=&]/g, (char) => `\\${char}`)}`
}

/** Every combination of a cva config's variant options. */
function combinations(
  variants: Record<string, Record<string, unknown>> | undefined
): Record<string, string>[] {
  if (!variants) return [{}]
  return Object.entries(variants).reduce<Record<string, string>[]>(
    (acc, [name, options]) =>
      acc.flatMap((combo) => Object.keys(options).map((value) => ({ ...combo, [name]: value }))),
    [{}]
  )
}

/** A cva function carries its config on `.config` at runtime. */
type CvaFn = ((props?: Record<string, string>) => string) & {
  config?: { variants?: Record<string, Record<string, unknown>> }
}

function classesOf(variant: CvaFn): string[] {
  const seen = new Set<string>()
  for (const combo of combinations(variant.config?.variants)) {
    for (const className of variant(combo).split(/\s+/)) {
      if (className) seen.add(className)
    }
  }
  return [...seen]
}

const components: readonly (readonly [string, CvaFn])[] = [
  ['Badge', badgeVariants],
  ['Button', buttonVariants],
  ['Field', fieldVariants],
  ['Field label', fieldLabelVariants],
  ['Field hint', fieldHintVariants],
  ['Field error', fieldErrorVariants],
  ['Input', inputVariants],
  ['Select trigger', selectTriggerVariants],
  ['Select content', selectContentVariants],
  ['Select item', selectItemVariants],
  ['Skeleton', skeletonVariants],
  ['EmptyState', emptyStateVariants],
  ['EmptyState icon', emptyStateIconVariants],
  ['EmptyState title', emptyStateTitleVariants],
  ['EmptyState description', emptyStateDescriptionVariants],
  ['EmptyState actions', emptyStateActionsVariants],
  ['Pagination', paginationVariants],
  ['Pagination item', paginationItemVariants],
  ['Pagination ellipsis', paginationEllipsisVariants],
  ['Pagination summary', paginationSummaryVariants],
  ['FilterBar', filterBarVariants],
  ['FilterBar controls', filterBarControlsVariants],
  ['FilterBar chips', filterBarChipsVariants],
  ['FilterBar chip', filterBarChipVariants],
  ['FilterBar chip remove', filterBarChipRemoveVariants],
  ['FilterBar summary', filterBarSummaryVariants],
  ['DataTable wrapper', dataTableWrapperVariants],
  ['DataTable', dataTableVariants],
  ['DataTable caption', dataTableCaptionVariants],
  ['DataTable header row', dataTableHeaderRowVariants],
  ['DataTable header cell', dataTableHeaderCellVariants],
  ['DataTable cell', dataTableCellVariants],
  ['DataTable row', dataTableRowVariants],
  ['DataTable select cell', dataTableSelectCellVariants],
  ['DataTable checkbox', dataTableCheckboxVariants],
  ['DataTable radio', dataTableRadioVariants],
  ['Dialog overlay', dialogOverlayVariants],
  ['Dialog content', dialogContentVariants],
  ['Dialog header', dialogHeaderVariants],
  ['Dialog title', dialogTitleVariants],
  ['Dialog description', dialogDescriptionVariants],
  ['Dialog body', dialogBodyVariants],
  ['Dialog footer', dialogFooterVariants],
  ['Dialog close', dialogCloseVariants],
  ['Tooltip content', tooltipContentVariants],
  ['Toaster viewport', toasterViewportVariants],
  ['Toast', toastVariants],
  ['Toast message', toastMessageVariants],
  ['Toast action', toastActionVariants],
  ['Toast close', toastCloseVariants],
  ['DataTable sort button', dataTableSortButtonVariants],
  ['DataTable sort icon', dataTableSortIconVariants],
]

let css = ''

beforeAll(async () => {
  const all = components.flatMap(([, variant]) => classesOf(variant))
  const compiler = await compile(`@import 'tailwindcss';\n@import './index.css';\n`, {
    base: stylesDir,
    loadStylesheet,
  })
  css = compiler.build([...new Set(all)])
})

describe('component classes compile to real utilities', () => {
  it.each(components)('%s', (_name, variant) => {
    const missing = classesOf(variant).filter((className) => !css.includes(toSelector(className)))
    expect(missing, `no CSS generated for: ${missing.join(', ')}`).toEqual([])
  })

  it('covers a meaningful number of classes', () => {
    // Guards against the config walk silently returning nothing and the whole
    // suite passing on an empty set.
    const total = new Set(components.flatMap(([, variant]) => classesOf(variant))).size
    expect(total).toBeGreaterThan(60)
  })
})

describe('the focus ring has something to draw', () => {
  /*
   * The reference design's recipe is two halves: the border turns the ring colour, and a 3px
   * ring at 50% opacity appears outside it. The ring is translucent and cannot
   * carry 3:1 on its own — the solid border is what satisfies WCAG 1.4.11.
   *
   * On an element with no border, `focus-visible:border-ring` sets a
   * colour on a zero-width border and paints nothing. Focus then shows as a
   * faint translucent halo and the criterion is missed, while a screenshot
   * still shows "a focus ring". Borderless elements take a solid ring instead.
   */
  const TRANSLUCENT = 'focus-visible:ring-ring/50'
  const RECOLOURS_BORDER = 'focus-visible:border-ring'

  it.each(components)('%s', (_name, variant) => {
    const classes = classesOf(variant)
    if (!classes.includes(TRANSLUCENT)) return

    expect(classes, 'a 50% ring is only legal alongside the border half of the recipe').toContain(
      RECOLOURS_BORDER
    )
    expect(
      classes.some((c) => c === 'border' || /^border-[xytrbles]$/.test(c)),
      'recolours a border it does not have — use a solid ring instead'
    ).toBe(true)
  })
})
