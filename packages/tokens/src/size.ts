/**
 * Component sizes: the heights, widths and insets a theme sets.
 *
 * Emitted into Tailwind's spacing namespace (`--spacing-control-md`), so every
 * sizing utility reads them by name — `h-control-md`, `min-w-button-md`,
 * `size-check`, `p-frame` — and a theme that changes a value changes every
 * control drawn with it.
 *
 * The values here are Windows 98's, in CSS pixels: the sizes the Figma file
 * draws at Large Fonts. They are pixels rather than rems on purpose. A bevel is
 * drawn in whole pixels, and a control whose height scaled with the root font
 * size would land on fractional pixels and blur its edges.
 */
export const size = {
  /** Control heights: buttons, fields, selects. Also the side of a square icon button's row. */
  'control-xs': '21px',
  'control-sm': '26px',
  'control-md': '28px',
  'control-lg': '33px',

  /** Square icon buttons. A touch wider than the row they sit in, as Windows 98 drew them. */
  'icon-xs': '25px',
  'icon-sm': '27px',
  'icon-md': '30px',
  'icon-lg': '34px',

  /** A button's minimum width, so a short label still makes a button worth aiming at. */
  'button-min-xs': '3rem',
  'button-min-sm': '4rem',
  'button-min-md': '92px',
  'button-min-lg': '108px',

  /** A button's side padding. */
  'button-px-xs': '0.375rem',
  'button-px-sm': '0.5rem',
  'button-px-md': '0.75rem',
  'button-px-lg': '1rem',

  /** A field's side padding, inside its edge. */
  'field-px': '0.25rem',
  'field-px-lg': '0.375rem',

  /**
   * A field's spacing: between label, control and message at each size, between
   * a label and the control beside it, and between the error icon and its text.
   */
  'field-gap-sm': '0.25rem',
  'field-gap-md': '0.375rem',
  'field-gap-lg': '0.5rem',
  'field-left-gap': '0.5rem',
  'field-error-gap': '0.25rem',

  /** The side of a checkbox's box, and of an option button. */
  check: '13px',
  radio: '12px',

  /** A window's or a dialog's title bar. */
  titlebar: '22px',
  /** A caption button: minimise, maximise, close. */
  'caption-w': '20px',
  'caption-h': '18px',
  /** The gap between caption buttons, and the extra space before the close button. */
  'caption-gap': '0px',
  'caption-close-gap': '2px',
  /** A title bar's side padding. */
  'titlebar-px': '2px',
  /**
   * Where a dialog's title starts and ends in its title bar, clear of the
   * close button. Equal values centre it.
   */
  'title-inset-start': '4px',
  'title-inset-end': '28px',

  /**
   * The frame between a window's edge and its content: the width of the bevel.
   * A theme whose windows have no bevel sets it to zero.
   */
  frame: '2px',

  /**
   * A dialog's insets: the side padding of its header, body and footer, the
   * room above the first line, and above and below the footer's buttons.
   */
  'dialog-px': '0.75rem',
  'dialog-pt': '0.75rem',
  'dialog-footer-pt': '0.5rem',
  'dialog-footer-pb': '0.75rem',

  /** One option in a list: a select's, a menu's. */
  item: '22px',
  /** An option's padding either side, the column its check mark sits in, the gap after it, and the mark. */
  'item-pl': '2px',
  'item-pr': '0.25rem',
  'item-check': '12px',
  'item-gap': '2px',
  'item-check-glyph': '7px',
  /** The inset around a dropped list's options, inside its border: 1px in Windows 98, as Figma draws it. */
  'popover-inset': '1px',

  /**
   * A data table's side padding: a header cell's, around the 1px its label's
   * focus ring takes, and a body cell's.
   */
  'table-header-px': '0.25rem',
  'table-cell-px': '0.375rem',
  /** Data table rows, and the header that matches them. */
  'row-sm': '22px',
  'row-md': '27px',

  /** A select's drop arrows, and how far the down arrow tucks under an up arrow above it. */
  'select-arrow': '8px',
  'select-arrow-overlap': '0px',
  /** «Loading…» and «No results found» in a dropped list: padding, and the gap after the busy glyph. */
  'select-message-px': '6px',
  'select-message-py': '6px',
  'select-message-gap': '6px',
  /** The strip around a searchable list's search box, and the space under it. */
  'select-search-p': '2px',
  'select-search-gap': '0px',
  /**
   * The buttons inside a number, date or select field: their height at each
   * size, centred in the field as Figma draws them; how far they sit from the
   * field's right edge; and the date field's glyph. A select's arrows sit
   * `select-pr` in.
   */
  'field-button-h-sm': '17px',
  'field-button-h': '19px',
  'field-button-h-lg': '23px',
  'field-button-pr': '2px',
  'field-drop-icon': '8px',
  'select-pr': '2px',
  /** A filter bar's padding and the space between its items. */
  'filter-bar-p': '0.25rem',
  'filter-bar-gap': '0.25rem',
  /** A filter chip's side padding, and its right padding beside the ✕. */
  'chip-px': '0.375rem',
  'chip-pr-remove': '0.125rem',
  /** A toast's padding, the gap between its icon, text and ✕, and between its lines. */
  'toast-py': '0.5rem',
  'toast-pl': '0.5rem',
  'toast-pr': '0.25rem',
  'toast-gap': '0.5rem',
  'toast-body-gap': '0.25rem',
  /** A toast's status icon, and its ✕. */
  'toast-icon': '16px',
  'toast-close-w': '20px',
  'toast-close-h': '18px',
  /** A page number's side padding. */
  'pager-px': '0.25rem',
  /**
   * A pager's arrows, the inset of the dotted focus ring round a page label,
   * and how narrow a small page button may get (Windows 98 lets it hug its
   * number; a theme can keep it square).
   */
  'pager-arrow': '8px',
  'pager-focus-px': '1px',
  'pager-min-sm': '0px',
  /** A filter chip. */
  'chip-sm': '23px',
  'chip-md': '26px',

  /** A badge's side padding. */
  'badge-px-sm': '0.25rem',
  'badge-px-md': '0.375rem',
  /** The side of a badge's status dot. */
  'badge-dot': '5px',

  /** An empty view's padding at each size, and the gap between its icon and its text at `md` and `lg`. */
  'empty-p-sm': '0.75rem',
  'empty-p-md': '1.5rem',
  'empty-p-lg': '1.5rem',
  'empty-gap': '1rem',

  /** A tooltip's padding. */
  'tooltip-px': '0.25rem',
  'tooltip-py': '1px',

  /** A status bar. */
  statusbar: '27px',
  /** A status bar's padding and the space between its sections; a section's side padding and the space inside it. */
  'statusbar-px': '2px',
  'statusbar-py': '2px',
  'statusbar-gap': '2px',
  'statusbar-section-px': '0.25rem',
  'statusbar-section-gap': '0.25rem',

  /** A progress bar: its height, the inset around the fill, and the fill. */
  progress: '18px',
  'progress-inset': '2px',
  'progress-fill': '12px',
  /** One block of the fill, and the block plus the gap after it. Equal values draw a solid bar. */
  'progress-block': '8px',
  'progress-period': '10px',
  /** The segment an indeterminate bar moves along the track: four blocks in Windows 98. */
  'progress-segment': '38px',

  /** A scroll bar's thickness, and the side of its arrow buttons (zero hides them). */
  scrollbar: '16px',
  'scroll-button': '16px',
  /** The space between the thumb and the edge of its track. */
  'scroll-inset': '0px',

  /** A group box: where its frame starts, the room above its content, and its legend's offset. */
  'groupbox-top': '6px',
  'groupbox-pt': '1rem',
  'groupbox-legend-x': '0.5rem',
  'groupbox-legend-px': '2px',
} as const

/** Names of every size token. */
export type SizeName = keyof typeof size
