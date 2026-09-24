import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { DialogVariants } from './Dialog.variants'

/**
 * Props for `DialogTrigger`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface DialogTriggerProps {
  /** Element or component to render as. Defaults to a button. */
  as?: PrimitiveProps['as']
  /** Merge props onto the single child element instead of rendering a wrapper. */
  asChild?: PrimitiveProps['asChild']
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/**
 * Props for `DialogContent`.
 *
 * The portal, the scrim, and the close button live here. They are not separate
 * parts: a dialog without them is not a dialog.
 */
export interface DialogContentProps {
  /** Width preset. Height is content-driven, capped to the viewport. */
  size?: NonNullable<DialogVariants['size']>
  /**
   * Blocks Escape and clicking the scrim, for a flow where dismissing by
   * accident loses work.
   *
   * **Never removes the close button.** A dialog with no exit is hostile; this
   * hardens accidental dismissal, not intentional exit.
   */
  preventClose?: boolean
  /** Accessible name for the close button. */
  closeLabel?: string
  /** Additional classes for the dialog surface, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `DialogHeader`. */
export interface DialogHeaderProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `DialogTitle`. The title is the dialog's accessible name. */
export interface DialogTitleProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/**
 * Props for `DialogDescription`.
 *
 * Mounting this part wires `aria-describedby`. Leaving it out sets that
 * attribute to an empty string, so a reader is not pointed at an element that
 * was never rendered.
 */
export interface DialogDescriptionProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/**
 * Props for `DialogBody`.
 *
 * The only scrolling region. Header, close, and footer stay put while this
 * overflows.
 */
export interface DialogBodyProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `DialogFooter`. */
export interface DialogFooterProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
