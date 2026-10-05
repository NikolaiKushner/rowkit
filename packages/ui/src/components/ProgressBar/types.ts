import type { HTMLAttributes } from 'vue'

/**
 * Props for `ProgressBar`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ProgressBarProps {
  /** How far along, from 0 to `max`. Values outside are clamped. */
  value: number
  /** The value that means done. */
  max?: number
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
