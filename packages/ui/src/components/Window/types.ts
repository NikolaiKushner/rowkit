import type { HTMLAttributes } from 'vue'

/**
 * Props for `Window`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface WindowProps {
  /**
   * Whether this is the window in use. An inactive window's title bar is the
   * grey gradient — the one behind a dialog, or beside the window with focus.
   */
  active?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `WindowTitleBar`. */
export interface WindowTitleBarProps {
  /** The window's title. Names the window. The default slot replaces it. */
  title?: string
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `WindowButton`. */
export interface WindowButtonProps {
  /** Which caption button: the glyph it shows. */
  glyph: 'minimize' | 'maximize' | 'restore' | 'close'
  /** Accessible name. The glyph alone says nothing to a screen reader. */
  label: string
  /** Disables the button: a grey, embossed glyph. */
  disabled?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `WindowBody`. */
export interface WindowBodyProps {
  /** Additional classes — padding, a layout — merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
