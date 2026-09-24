<script setup lang="ts" generic="T extends string | number">
import { ComboboxRoot } from 'reka-ui'
import { computed, provide, reactive, ref } from 'vue'
import { useFieldContext } from '../Field/context'
import { selectContextKey } from './context'
import type { SelectProps } from './types'

defineOptions({ name: 'RkSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  searchable: false,
  manualFilter: false,
  disabled: false,
  invalid: false,
  required: false,
})

defineSlots<{
  /** Trigger and content. */
  default: () => unknown
}>()

/** The selected value. `undefined` is nothing selected — Reka's `null` stays inside. */
const model = defineModel<T | undefined>({ default: undefined })

/** The current search term. Bind it to fetch options asynchronously. */
const searchTerm = defineModel<string>('searchTerm', { default: '' })

const field = useFieldContext()
const open = ref(false)

const internalValue = computed<T | null>({
  get: () => model.value ?? null,
  set: (value) => {
    model.value = value ?? undefined
  },
})

const isDisabled = computed(() => props.disabled || (field?.disabled.value ?? false))
const isInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const isRequired = computed(() => props.required || (field?.required.value ?? false))
const describedBy = computed(() => field?.describedBy.value)
const searchable = computed(() => props.searchable)
const manualFilter = computed(() => props.manualFilter)

/**
 * Reka filters on the item's rendered text. That is the right default, but it
 * cannot know about an async list, so `manualFilter` turns it off rather than
 * double-filtering what the server already narrowed. A non-searchable select
 * ignores the filter too: the input is read-only and holds the chosen label.
 */
const ignoreFilter = computed(() => props.manualFilter || !props.searchable)

const labels = reactive(new Map<string, string>())

function registerLabel(value: string | number, label: string): void {
  labels.set(String(value), label)
}

provide(selectContextKey, {
  open,
  model,
  searchTerm,
  searchable,
  manualFilter,
  isDisabled,
  isInvalid,
  isRequired,
  describedBy,
  labels,
  registerLabel,
})

/**
 * Optional props are spread in only when set. Under
 * `exactOptionalPropertyTypes`, binding `:name="undefined"` to an optional
 * prop is a type error rather than an omission.
 */
const rootProps = computed(() => ({
  // A non-searchable select still has to open when its readonly input is
  // clicked, which is the whole interaction for that mode.
  openOnClick: true,
  disabled: isDisabled.value,
  required: isRequired.value,
  ignoreFilter: ignoreFilter.value,
  resetSearchTermOnBlur: true,
  ...(props.name === undefined ? {} : { name: props.name }),
}))
</script>

<template>
  <ComboboxRoot v-model="internalValue" v-model:open="open" v-bind="rootProps" data-slot="select">
    <slot />
  </ComboboxRoot>
</template>
