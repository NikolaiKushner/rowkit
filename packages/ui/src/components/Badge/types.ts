import type { PrimitiveProps } from '../../primitives/Primitive'
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
   * How much visual weight the badge carries. `subtle` — white face,
   * coloured text and border — is the default and the one for tables.
   * `solid` fills the badge with the colour, for a short label that has to
   * stand out. `outline` keeps the face transparent and the text black; the
   * colour is only in the border.
   */
  appearance?: NonNullable<BadgeVariants['appearance']>
  /** `sm` (15px) for table rows and navigation counts, `md` (17px) elsewhere. */
  size?: NonNullable<BadgeVariants['size']>
  /**
   * Shows a 5×5 square before the label in the variant's colour.
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
