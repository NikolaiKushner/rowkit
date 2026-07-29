<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import {
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
  type EmptyStateVariants,
} from './EmptyState.variants'

defineOptions({ name: 'RkEmptyState' })

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    size: 'md',
    level: 2,
    announce: false,
    as: 'div',
    asChild: false,
  }
)

defineSlots<{
  /**
   * Illustration or icon above the title. Decorative — mark it `aria-hidden`
   * unless it carries meaning the title does not.
   */
  icon: () => unknown
  /** Replaces the `description` text, for explanations that need markup. */
  description: () => unknown
  /**
   * Buttons. Keep it to one primary action, optionally with one secondary —
   * an empty state offering four choices is a menu, not a next step.
   */
  actions: () => unknown
}>()

const headingTag = computed(() => `h${props.level}` as const)

/**
 * `role="status"` is polite by default, so it waits for a pause rather than
 * interrupting whatever the user is currently reading.
 */
const liveAttrs = computed(() => (props.announce ? ({ role: 'status' } as const) : {}))
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="liveAttrs"
    :class="cn(emptyStateVariants({ size: props.size }), props.class)"
  >
    <div v-if="$slots.icon" :class="emptyStateIconVariants({ size: props.size })">
      <slot name="icon" />
    </div>

    <component :is="headingTag" :class="emptyStateTitleVariants({ size: props.size })">
      {{ props.title }}
    </component>

    <p
      v-if="props.description !== undefined || $slots.description"
      :class="emptyStateDescriptionVariants({ size: props.size })"
    >
      <slot name="description">{{ props.description }}</slot>
    </p>

    <div v-if="$slots.actions" :class="emptyStateActionsVariants({ size: props.size })">
      <slot name="actions" />
    </div>
  </Primitive>
</template>
