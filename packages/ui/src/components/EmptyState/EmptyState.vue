<script setup lang="ts">
import { Primitive } from '../../primitives/Primitive'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import Error32Icon from '../../icons/Error32Icon.vue'
import FolderEmpty32Icon from '../../icons/FolderEmpty32Icon.vue'
import Search32Icon from '../../icons/Search32Icon.vue'
import {
  emptyStateActionsVariants,
  emptyStateBodyVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
  type EmptyStateReason,
} from './EmptyState.variants'

import type { EmptyStateProps } from './types'

defineOptions({ name: 'RkEmptyState' })

const props = withDefaults(defineProps<EmptyStateProps>(), {
  reason: 'no-data',
  size: 'md',
  level: 2,
  announce: false,
  as: 'div',
  asChild: false,
})

defineSlots<{
  /**
   * Replaces the 32px icon the `reason` picks. Keep it 32×32 and decorative —
   * mark it `aria-hidden` unless it carries meaning the title does not.
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
 * Generic copy for the two reasons that have any.
 *
 * `no-data` gets none: what to do when nothing exists yet is entirely
 * domain-specific, and a library guessing at it would produce worse copy than
 * silence. The other two are genuinely generic, and an explicit `description`
 * always wins.
 */
const defaultDescriptions: Partial<Record<EmptyStateReason, string>> = {
  'no-results': 'Try removing a filter or searching for something else.',
  error: 'Something went wrong. Try again.',
}

const resolvedDescription = computed(() => props.description ?? defaultDescriptions[props.reason])

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
    data-slot="empty-state"
    :data-reason="props.reason"
    v-bind="liveAttrs"
    :class="cn(emptyStateVariants({ size: props.size }), props.class)"
  >
    <div data-slot="empty-state-icon" :class="emptyStateIconVariants()">
      <slot name="icon">
        <Error32Icon v-if="props.reason === 'error'" />
        <Search32Icon v-else-if="props.reason === 'no-results'" />
        <FolderEmpty32Icon v-else />
      </slot>
    </div>

    <div :class="emptyStateBodyVariants()">
      <component :is="headingTag" :class="emptyStateTitleVariants({ size: props.size })">
        {{ props.title }}
      </component>

      <p
        v-if="resolvedDescription !== undefined || $slots.description"
        :class="emptyStateDescriptionVariants({ size: props.size, reason: props.reason })"
      >
        <slot name="description">{{ resolvedDescription }}</slot>
      </p>

      <div v-if="$slots.actions" :class="emptyStateActionsVariants({ size: props.size })">
        <slot name="actions" />
      </div>
    </div>
  </Primitive>
</template>
