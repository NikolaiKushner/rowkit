import type { HTMLAttributes } from 'vue'

/**
 * Props for `StatusBar`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface StatusBarProps {
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `StatusBarSection`. */
export interface StatusBarSectionProps {
  /** Additional classes — a width, for every section but the first. */
  class?: HTMLAttributes['class']
}
