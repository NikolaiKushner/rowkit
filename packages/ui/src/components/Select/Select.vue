<script setup lang="ts" generic="T extends string | number">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import type { SelectOption } from './types'
import {
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
  type SelectVariants,
} from './Select.variants'

defineOptions({ name: 'RkSelect', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** The available choices. */
    options: SelectOption<T>[]
    /** Text shown in the trigger while nothing is selected. */
    placeholder?: string
    /**
     * Adds a search box inside the panel.
     *
     * Worth turning on somewhere around twenty options. Below that the search
     * box costs a keystroke and saves nothing.
     */
    searchable?: boolean
    /** Accessible name for the open/close chevron. */
    togglerLabel?: string
    /** Shown when no option matches the search term. */
    emptyText?: string
    /**
     * Hands filtering to the consumer.
     *
     * Set this when options are fetched per keystroke: the list is already the
     * server's answer, so filtering it again locally would hide results that
     * matched on a field the label does not show.
     */
    manualFilter?: boolean
    /** Shows a loading row in place of the list. For async options. */
    loading?: boolean
    /** Text shown while `loading`. */
    loadingText?: string
    /** Control height and text size. */
    size?: NonNullable<SelectVariants['size']>
    /** Disables the control. A surrounding disabled `Field` also disables it. */
    disabled?: boolean
    /** Marks the value invalid. A `Field` with an `error` also sets it. */
    invalid?: boolean
    /** Marks the control required. A required `Field` also sets it. */
    required?: boolean
    /** Id for the trigger. Inherited from a surrounding `Field` when omitted. */
    id?: string
    /** Name submitted with a native form. */
    name?: string
    /** Additional classes for the trigger, merged so a consumer's utility wins. */
    class?: HTMLAttributes['class']
  }>(),
  {
    placeholder: 'Select…',
    searchable: false,
    togglerLabel: 'Show options',
    emptyText: 'No results',
    manualFilter: false,
    loading: false,
    loadingText: 'Loading…',
    size: 'md',
  }
)

/** The selected value. */
const model = defineModel<T | undefined>({ default: undefined })

/** The current search term. Bind it to fetch options asynchronously. */
const searchTerm = defineModel<string>('searchTerm', { default: '' })

defineSlots<{
  /** Replaces an option's row. */
  option: (props: { option: SelectOption<T>; selected: boolean }) => unknown
  /** Replaces the trigger's text. */
  value: (props: { option: SelectOption<T> | undefined }) => unknown
  /** Replaces the empty-results message. */
  empty: () => unknown
}>()

const field = useFieldContext()

const triggerId = computed(() => props.id ?? field?.controlId.value)
// OR, not `??` — see the note in Input.vue.
const isDisabled = computed(() => props.disabled || (field?.disabled.value ?? false))
const isInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const isRequired = computed(() => props.required || (field?.required.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const open = ref(false)

/**
 * Reka models "nothing selected" as `null`; the public API uses `undefined`,
 * which is what a Vue consumer gets from an unset ref. Translating here keeps
 * the null out of the component's surface.
 */
const internalValue = computed<T | null>({
  get: () => model.value ?? null,
  set: (value) => {
    model.value = value ?? undefined
  },
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

const selectedOption = computed(() => props.options.find((option) => option.value === model.value))

/**
 * Reka filters on the item's rendered text. That is the right default, but it
 * cannot know about an async list, so `manualFilter` turns it off rather than
 * double-filtering what the server already narrowed.
 */
const ignoreFilter = computed(() => props.manualFilter || !props.searchable)

/**
 * What the input shows when it is not being typed into. Without this the input
 * would sit empty after a selection and the chosen option would be invisible.
 */
const displayValue = (): string => selectedOption.value?.label ?? ''

/**
 * The text in the input.
 *
 * Reka only applies `displayValue` on its own reset path — selection, blur,
 * close — never on mount, so a Select given a value up front would render an
 * empty box until the user touched it.
 */
const inputValue = ref(displayValue())

watch(
  [() => model.value, () => props.options, open],
  () => {
    if (!open.value) inputValue.value = displayValue()
  },
  { immediate: true }
)

// Only edits made while the panel is open are a search. Seeding the box with
// the selected label is not something a consumer should have to filter out of
// an async fetch.
watch(inputValue, (value) => {
  if (open.value) searchTerm.value = value
})
</script>

<template>
  <ComboboxRoot v-model="internalValue" v-model:open="open" v-bind="rootProps">
    <!--
      The input, not a button, is the anchor. Reka gives the trigger
      `tabindex="-1"` and `aria-label="Show popup"` on the assumption that a
      ComboboxInput is present to be the focusable combobox — without one the
      control is unreachable by keyboard and announces itself as "Show popup"
      instead of its field label.
    -->
    <ComboboxAnchor
      :class="cn(selectTriggerVariants({ size: props.size, invalid: isInvalid }), props.class)"
    >
      <ComboboxInput
        v-bind="$attrs"
        :id="triggerId"
        v-model="inputValue"
        :placeholder="props.placeholder"
        :readonly="!props.searchable"
        :display-value="displayValue"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="
          cn(
            'min-w-0 flex-1 truncate bg-transparent text-inherit outline-none',
            'placeholder:text-text-subtle disabled:cursor-not-allowed',
            !props.searchable && 'cursor-pointer'
          )
        "
      />
      <ComboboxTrigger
        class="flex shrink-0 cursor-pointer items-center text-text-muted"
        :aria-label="props.togglerLabel"
      >
        <svg
          class="size-4 transition-transform duration-fast ease-standard"
          :class="open && 'rotate-180'"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent position="popper" :side-offset="4" :class="selectContentVariants()">
        <ComboboxViewport class="max-h-64 overflow-y-auto p-1">
          <div v-if="props.loading" class="px-2 py-1.5 text-sm text-text-muted" role="status">
            {{ props.loadingText }}
          </div>

          <template v-else>
            <ComboboxEmpty class="px-2 py-1.5 text-sm text-text-muted">
              <slot name="empty">{{ props.emptyText }}</slot>
            </ComboboxEmpty>

            <ComboboxItem
              v-for="option in props.options"
              :key="String(option.value)"
              :value="option.value"
              :disabled="option.disabled ?? false"
              :class="selectItemVariants()"
            >
              <!--
                The indicator only renders when the item is selected, so the
                space is reserved by the wrapper. Otherwise every label shifts
                sideways as the selection moves down the list.
              -->
              <span class="flex size-4 shrink-0 items-center justify-center">
                <ComboboxItemIndicator as-child>
                  <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="m5 10 3.5 3.5L15 7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </ComboboxItemIndicator>
              </span>
              <span v-if="!$slots.option" class="truncate">{{ option.label }}</span>
              <slot v-else name="option" :option="option" :selected="option.value === model" />
            </ComboboxItem>
          </template>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
