import type { HTMLAttributes } from 'vue'

/**
 * Props for `GroupBox`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface GroupBoxProps {
  /** The text on the frame's top line. Names the group for assistive technology. */
  legend?: string
  /**
   * The element. `fieldset` — the default — groups form controls, and the
   * browser names the group from its legend. `section` or `div` frame
   * anything else; the group is then `role="group"`, named by the legend.
   */
  as?: 'fieldset' | 'section' | 'div'
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
