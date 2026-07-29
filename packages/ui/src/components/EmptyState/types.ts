import type { PrimitiveProps } from 'reka-ui'
import type { EmptyStateReason, EmptyStateVariants } from './EmptyState.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `EmptyState`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface EmptyStateProps {
  /**
   * What is empty, in a few words.
   *
   * Name the thing rather than the absence — "No projects yet" beats "No
   * results found", which tells the user nothing they cannot already see.
   */
  title: string
  /**
   * One sentence on what to do next. This is the part that turns a dead end
   * into a starting point, and the part most empty states leave out.
   */
  description?: string
  /**
   * Why the view is empty.
   *
   * The three cases look identical and mean completely different things, and
   * no amount of copy discipline at the call site keeps them apart on its own.
   * `no-data` is first-run — nothing exists yet, so the action is to create.
   * `no-results` is a filter that matched nothing — the action is to widen it,
   * and offering "create your first project" to someone with fifty is the
   * failure this prop exists to prevent. `error` is a request that failed, and
   * must not read as "this worked and there is nothing here".
   *
   * Drives tone and the default description. It never selects an icon: rowkit
   * ships none, and bundling SVGs to serve one prop would cross the scope
   * line. Pass your own through `#icon`.
   *
   * `no-results` and `error` normally want `announce` as well, since both
   * replace content that was there a moment ago.
   */
  reason?: EmptyStateReason
  /** Scales every part together. `sm` fits inside a table body. */
  size?: NonNullable<EmptyStateVariants['size']>
  /**
   * Heading level for the title.
   *
   * An empty state nested in a page that already has an `h1` needs to
   * continue that outline, not restart it. Screen reader users navigate by
   * heading, so a level chosen at random breaks the page's structure.
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Announces the empty state when it appears.
   *
   * Turn this on when it replaces content that was there a moment ago — a
   * filter that narrowed to nothing. A sighted user sees the table empty;
   * without this, a screen reader user gets no indication at all.
   *
   * Leave it off for a first-run empty state, which is simply what the page
   * says when it loads.
   */
  announce?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
  /** Element or component to render as. */
  as?: PrimitiveProps['as']
  /** Merge props onto the single child element instead of rendering a wrapper. */
  asChild?: PrimitiveProps['asChild']
}
