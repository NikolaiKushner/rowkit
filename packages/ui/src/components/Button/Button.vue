<script setup lang="ts">
import { Primitive } from '../../primitives/Primitive'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import HourglassIcon from '../../icons/HourglassIcon.vue'
import {
  buttonContentVariants,
  buttonFocusOuter,
  buttonFocusVariants,
  buttonPressedState,
  buttonVariants,
} from './Button.variants'

import type { ButtonProps } from './types'

defineOptions({ name: 'RkButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
  pressed: undefined,
  as: 'button',
  asChild: false,
})

defineSlots<{
  /** The button label. */
  default: () => unknown
  /** Icon before the label. Replaced by the hourglass while loading. */
  leading: () => unknown
  /** Icon after the label. */
  trailing: () => unknown
}>()

/**
 * `disabled` on a native button removes it from the tab order, which is the
 * right behaviour for a genuinely unavailable action but the wrong one for a
 * button that is merely busy — focus would jump to the document body the
 * moment the user submits.
 */
const isNativeButton = computed(() => props.as === 'button' && !props.asChild)

/**
 * `aria-busy:pointer-events-none` stops the mouse, but not the keyboard and
 * not a programmatic `.click()`. Without this guard, holding Enter on a
 * loading submit button fires the handler repeatedly.
 *
 * Capture phase, so it runs before the listeners a consumer attached through
 * fallthrough attributes.
 */
/**
 * With as-child there is no inner ring to draw on, so the dotted ring goes on
 * the element itself, inset past the bevel.
 */
const asChildFocus =
  'focus-visible:focus-ring focus-visible:-outline-offset-4 focus-visible:outline-ring'

function onClickCapture(event: MouseEvent): void {
  if (props.loading || props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :type="isNativeButton ? props.type : undefined"
    :disabled="isNativeButton && props.disabled ? true : undefined"
    :aria-disabled="!isNativeButton && props.disabled ? 'true' : undefined"
    :aria-busy="props.loading ? 'true' : undefined"
    :aria-pressed="props.pressed === undefined ? undefined : String(props.pressed)"
    :class="
      cn(
        buttonVariants({
          variant: props.variant,
          size: props.size,
          block: props.block,
        }),
        buttonPressedState,
        props.asChild ? asChildFocus : buttonFocusOuter,
        props.class
      )
    "
    data-slot="button"
    @click.capture="onClickCapture"
  >
    <!--
      With as-child the consumer's element is the button, so its content goes
      in as given: the content and focus-ring wrappers would otherwise be the
      first child, and the button's attributes would land on them.
    -->
    <slot v-if="props.asChild" />
    <span
      v-else
      data-slot="button-content"
      :class="buttonContentVariants({ variant: props.variant })"
    >
      <span data-slot="button-focus" :class="buttonFocusVariants({ size: props.size })">
        <!--
          The hourglass, or a theme's spinner: the busy glyph stands in for the
          hourglass's own (`--rk-icon-hourglass`) and turns where the theme
          says so. Windows 98 draws its pixels and keeps them still.
        -->
        <HourglassIcon
          v-if="props.loading"
          data-slot="button-busy"
          class="[--rk-icon-hourglass:var(--rk-icon-spinner)] animate-(--rk-animate-busy)"
        />
        <span v-else-if="$slots.leading" class="flex shrink-0 items-center">
          <slot name="leading" />
        </span>

        <span v-if="$slots.default" class="truncate"><slot /></span>

        <span v-if="$slots.trailing" class="flex shrink-0 items-center">
          <slot name="trailing" />
        </span>
      </span>

      <!--
        Only rendered when the consumer supplies a loading label, so the default
        is an unchanged accessible name plus aria-busy rather than a label that
        silently rewrites itself under a screen reader.
      -->
      <span v-if="props.loading && props.loadingLabel" class="sr-only" role="status">
        {{ props.loadingLabel }}
      </span>
    </span>
  </Primitive>
</template>
