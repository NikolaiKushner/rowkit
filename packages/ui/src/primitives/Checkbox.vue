<script setup lang="ts">
import { computed } from 'vue'

/**
 * A tri-state checkbox drawn as a button, for the places a native
 * `<input type="checkbox">` cannot be styled into the design: DataTable's row
 * and select-all controls.
 *
 * Internal, not exported. Controlled only — the owner holds the state — and
 * deliberately small: no checkbox group, no hidden form input, no roving
 * focus, because nothing in rowkit uses them. Styles key on `data-state`
 * (`checked`, `unchecked`, `indeterminate`).
 */
const props = withDefaults(
  defineProps<{
    /** `true`, `false`, or `'indeterminate'` for a partially selected group. */
    modelValue: boolean | 'indeterminate'
    /** Blocks interaction and sets `data-disabled`. */
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{
  /** Activating an indeterminate checkbox checks it, rather than clearing it. */
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  /** The check mark. Rendered only while checked or indeterminate. */
  default: (props: { state: boolean | 'indeterminate' }) => unknown
}>()

const dataState = computed(() =>
  props.modelValue === 'indeterminate'
    ? 'indeterminate'
    : props.modelValue
      ? 'checked'
      : 'unchecked'
)

function toggle(): void {
  emit('update:modelValue', props.modelValue === 'indeterminate' ? true : !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="props.modelValue === 'indeterminate' ? 'mixed' : props.modelValue"
    :data-state="dataState"
    :data-disabled="props.disabled ? '' : undefined"
    :disabled="props.disabled"
    @keydown.enter.prevent
    @click="toggle"
  >
    <!--
      Enter is swallowed above: per WAI-ARIA a checkbox toggles on Space only,
      and a native button would otherwise fire click on both. This comment
      sits inside the button so the component keeps a single root element and
      inherits the consumer's class and aria-label.
    -->
    <span
      v-if="props.modelValue !== false"
      :data-state="dataState"
      class="pointer-events-none flex items-center justify-center"
    >
      <slot :state="props.modelValue" />
    </span>
  </button>
</template>
