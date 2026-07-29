import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { SkeletonVariants } from './Skeleton.variants'

/**
 * Props for `Skeleton`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface SkeletonProps {
  /** Geometry preset. */
  variant?: NonNullable<SkeletonVariants['variant']>
  /**
   * Number of stacked bars. Only meaningful for `text`.
   *
   * The last bar is shortened, because real paragraphs do not end flush with
   * the margin and a stack of equal bars reads as a table, not prose.
   */
  lines?: number
  /**
   * Whether the placeholder pulses. Suppressed automatically for anyone with
   * `prefers-reduced-motion`.
   */
  animated?: boolean
  /**
   * Announces this placeholder to assistive technology as a busy region.
   *
   * Omitted, the skeleton is `aria-hidden` — which is the right default,
   * because a loading table renders dozens of these and a reader should hear
   * "Loading users" once, not once per cell. Set it on the single element
   * that stands for the whole region.
   */
  label?: string
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
