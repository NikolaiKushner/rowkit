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
  /** The inset around a dropped list's options. */
  'popover-inset': '0px',

  /** Data table rows, and the header that matches them. */
  'row-sm': '22px',
  'row-md': '27px',

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

  /** A progress bar: its height, the inset around the fill, and the fill. */
  progress: '18px',
  'progress-inset': '2px',
  'progress-fill': '12px',
  /** One block of the fill, and the block plus the gap after it. Equal values draw a solid bar. */
  'progress-block': '8px',
  'progress-period': '10px',

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
