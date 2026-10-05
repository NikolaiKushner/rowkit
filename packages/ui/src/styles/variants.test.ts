import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'
import { badgeDotVariants, badgeVariants } from '../components/Badge/Badge.variants'
import {
  buttonContentVariants,
  buttonFocusVariants,
  buttonPressedState,
  buttonVariants,
} from '../components/Button/Button.variants'
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
  dataTableSummaryCellVariants,
  dataTableVariants,
  dataTableWrapperVariants,
} from '../components/DataTable/DataTable.variants'
import {
  dialogBodyVariants,
  dialogCloseVariants,
  dialogTitleBarVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from '../components/Dialog/Dialog.variants'
import {
  emptyStateActionsVariants,
  emptyStateBodyVariants,
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
  fieldControlVariants,
  fieldErrorVariants,
  fieldHintVariants,
  fieldLabelVariants,
  fieldRequiredVariants,
  fieldVariants,
} from '../components/Field/Field.variants'
import { inputVariants } from '../components/Input/Input.variants'
import {
  selectButtonVariants,
  selectContentVariants,
  selectInputVariants,
  selectItemVariants,
  selectListVariants,
  selectMessageVariants,
  selectTriggerVariants,
} from '../components/Select/Select.variants'
import {
  checkboxBoxVariants,
  checkboxLabelVariants,
  checkboxVariants,
} from '../components/Checkbox/Checkbox.variants'
import {
  radioLabelVariants,
  radioMarkVariants,
  radioVariants,
} from '../components/Radio/Radio.variants'
import {
  groupBoxFrameVariants,
  groupBoxLegendVariants,
  groupBoxVariants,
} from '../components/GroupBox/GroupBox.variants'
import {
  progressBarFillVariants,
  progressBarVariants,
} from '../components/ProgressBar/ProgressBar.variants'
import {
  scrollAreaButtonVariants,
  scrollAreaContentVariants,
  scrollAreaCornerVariants,
  scrollAreaFootVariants,
  scrollAreaMainVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaTrackVariants,
  scrollAreaVariants,
  scrollAreaViewportVariants,
} from '../components/ScrollArea/ScrollArea.variants'
import { separatorVariants } from '../components/Separator/Separator.variants'
import {
  windowBodyVariants,
  windowButtonVariants,
  windowControlsVariants,
  windowTitleBarVariants,
  windowTitleVariants,
  windowVariants,
} from '../components/Window/Window.variants'
import {
  statusBarSectionVariants,
  statusBarVariants,
} from '../components/StatusBar/StatusBar.variants'
import { skeletonVariants } from '../components/Skeleton/Skeleton.variants'
import {
  toastActionVariants,
  toastBodyVariants,
  toastTitleVariants,
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

/**
 * Group markers (`group/button`) name an element for `group-*` variants to
 * refer to. They generate no CSS of their own, by design.
 */
const isMarker = (className: string) => /^(group|peer)(\/|$)/.test(className)

function classesOf(variant: CvaFn): string[] {
  const seen = new Set<string>()
  for (const combo of combinations(variant.config?.variants)) {
    for (const className of variant(combo).split(/\s+/)) {
      if (className && !isMarker(className)) seen.add(className)
    }
  }
  return [...seen]
}

const components: readonly (readonly [string, CvaFn])[] = [
  ['Badge', badgeVariants],
  ['Badge dot', badgeDotVariants],
  ['Button', buttonVariants],
  ['Button content', buttonContentVariants],
  ['Button focus ring', buttonFocusVariants],
  ['Button pressed state', () => buttonPressedState],
  ['Field', fieldVariants],
  ['Field label', fieldLabelVariants],
  ['Field hint', fieldHintVariants],
  ['Field error', fieldErrorVariants],
  ['Field control', fieldControlVariants],
  ['Field required', fieldRequiredVariants],
  ['Input', inputVariants],
  ['Select trigger', selectTriggerVariants],
  ['Select content', selectContentVariants],
  ['Select item', selectItemVariants],
  ['ScrollArea', scrollAreaVariants],
  ['ScrollArea main', scrollAreaMainVariants],
  ['ScrollArea viewport', scrollAreaViewportVariants],
  ['ScrollArea content', scrollAreaContentVariants],
  ['ScrollArea scrollbar', scrollAreaScrollbarVariants],
  ['ScrollArea foot', scrollAreaFootVariants],
  ['ScrollArea button', scrollAreaButtonVariants],
  ['ScrollArea track', scrollAreaTrackVariants],
  ['ScrollArea thumb', scrollAreaThumbVariants],
  ['ScrollArea corner', scrollAreaCornerVariants],
  ['Separator', separatorVariants],
  ['Window', windowVariants],
  ['Window title bar', windowTitleBarVariants],
  ['Window title', windowTitleVariants],
  ['Window controls', windowControlsVariants],
  ['Window button', windowButtonVariants],
  ['Window body', windowBodyVariants],
  ['Checkbox', checkboxVariants],
  ['Checkbox box', checkboxBoxVariants],
  ['Checkbox label', checkboxLabelVariants],
  ['Radio', radioVariants],
  ['Radio mark', radioMarkVariants],
  ['Radio label', radioLabelVariants],
  ['StatusBar', statusBarVariants],
  ['StatusBar section', statusBarSectionVariants],
  ['GroupBox', groupBoxVariants],
  ['GroupBox frame', groupBoxFrameVariants],
  ['GroupBox legend', groupBoxLegendVariants],
  ['ProgressBar', progressBarVariants],
  ['ProgressBar fill', progressBarFillVariants],
  ['Select input', selectInputVariants],
  ['Select button', selectButtonVariants],
  ['Select list', selectListVariants],
  ['Select message', selectMessageVariants],
  ['Skeleton', skeletonVariants],
  ['EmptyState', emptyStateVariants],
  ['EmptyState body', emptyStateBodyVariants],
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
  ['DataTable summary cell', dataTableSummaryCellVariants],
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
  ['Dialog title bar', dialogTitleBarVariants],
  ['Dialog close', dialogCloseVariants],
  ['Tooltip content', tooltipContentVariants],
  ['Toaster viewport', toasterViewportVariants],
  ['Toast', toastVariants],
  ['Toast message', toastMessageVariants],
  ['Toast action', toastActionVariants],
  ['Toast body', toastBodyVariants],
  ['Toast title', toastTitleVariants],
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
   *
   * Select's trigger is a wrapper: focus lives on the inner input, so the
   * recipe is expressed as `has-[:focus-visible]:…` rather than `focus-visible:…`.
   */
  const TRANSLUCENT = 'focus-visible:ring-ring/50'
  const TRANSLUCENT_HAS = 'has-[:focus-visible]:ring-ring/50'
  const RECOLOURS_BORDER = 'focus-visible:border-ring'
  const RECOLOURS_BORDER_HAS = 'has-[:focus-visible]:border-ring'

  it.each(components)('%s', (_name, variant) => {
    const classes = classesOf(variant)
    const usesTranslucent = classes.includes(TRANSLUCENT) || classes.includes(TRANSLUCENT_HAS)
    if (!usesTranslucent) return

    const borderHalf = classes.includes(TRANSLUCENT) ? RECOLOURS_BORDER : RECOLOURS_BORDER_HAS
    expect(classes, 'a 50% ring is only legal alongside the border half of the recipe').toContain(
      borderHalf
    )
    expect(
      classes.some((c) => c === 'border' || /^border-[xytrbles]$/.test(c)),
      'recolours a border it does not have — use a solid ring instead'
    ).toBe(true)
  })

  /*
   * Windows 98 marks focus with a 1px dotted rectangle, which only `outline`
   * can draw — a ring is a box-shadow and is always solid. Any outline focus
   * must be that rectangle: dotted, in the ring colour. A solid or coloured
   * outline is an improvised focus style. The one other colour is the title
   * bar's white, for a control drawn on the navy bar, where black would vanish.
   */
  it('draws outline focus only as the dotted ring', () => {
    for (const [name, variant] of components) {
      const classes = classesOf(variant)
      const prefixes = new Set(
        classes
          .map((c) => /^(.*focus-visible(?:\/\w+)?:)outline-1$/.exec(c)?.[1])
          .filter((p): p is string => p !== undefined)
      )
      for (const prefix of prefixes) {
        expect(classes, `${name}: ${prefix}outline-1 must be dotted`).toContain(
          `${prefix}outline-dotted`
        )
        expect(
          [`${prefix}outline-ring`, `${prefix}outline-titlebar-foreground`].some((c) =>
            classes.includes(c)
          ),
          `${name}: ${prefix}outline-1 must use the ring colour`
        ).toBe(true)
      }
    }
  })
})
