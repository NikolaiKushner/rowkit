<script setup lang="ts">
import { computed } from 'vue'

/**
 * A checkbox with a third, mixed state, for DataTable's row and select-all
 * controls — the one place a native `<input type="checkbox">` cannot be drawn
 * the way the design needs.
 *
 * Internal and controlled: the owner holds the value and gets every change
 * through `update:modelValue`. Nothing else rowkit does not need is here — no
 * groups, no hidden form field. Style it by `data-state`: `checked`,
 * `unchecked` or `indeterminate`.
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

const mixed = computed(() => props.modelValue === 'indeterminate')
const state = computed(() =>
  mixed.value ? 'indeterminate' : props.modelValue ? 'checked' : 'unchecked'
)

/** Mixed resolves to checked: selecting the rest is what a user means by it. */
function activate(): void {
  if (props.disabled) return
  emit('update:modelValue', mixed.value || props.modelValue === false)
}

/** A checkbox answers Space only; a native button would also click on Enter. */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') event.preventDefault()
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="mixed ? 'mixed' : props.modelValue === true"
    :data-state="state"
    :data-disabled="props.disabled ? '' : undefined"
    :disabled="props.disabled"
    @keydown="onKeydown"
    @click="activate"
  >
    <span
      v-if="props.modelValue !== false"
      :data-state="state"
      class="pointer-events-none flex items-center justify-center"
    >
      <slot :state="props.modelValue" />
    </span>
  </button>
</template>
