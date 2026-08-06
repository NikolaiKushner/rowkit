import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { BadgeVariants } from './Badge.variants'

/**
 * Props live here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface BadgeProps {
  /**
   * Status family. `neutral` is the "no particular status" default rather
   * than an absence of styling.
   */
  variant?: NonNullable<BadgeVariants['variant']>
  /**
   * How much visual weight the badge carries. Prefer `subtle` in a table —
   * soft tinted chip with a matching hairline, quieter than `solid` / `outline`.
   * `solid` is for when a single badge has to carry the page.
   */
  appearance?: NonNullable<BadgeVariants['appearance']>
  /** Badge size. `sm` is intended for dense table rows. */
  size?: NonNullable<BadgeVariants['size']>
  /**
   * Shows a filled dot before the label, inheriting the text colour.
   *
   * Useful when the same badge appears many times in a column and the eye
   * needs a shape to lock onto rather than a colour.
   */
  dot?: boolean
  /**
   * Additional classes, merged with the variant classes so a consumer's
   * utility wins over the component's own.
   */
  class?: HTMLAttributes['class']
  /** Element or component to render as. */
  as?: PrimitiveProps['as']
  /** Merge props onto the single child element instead of rendering a wrapper. */
  asChild?: PrimitiveProps['asChild']
}
