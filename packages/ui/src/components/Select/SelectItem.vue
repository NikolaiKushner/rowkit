<script setup lang="ts" generic="T extends string | number">
import { ComboboxItem, ComboboxItemIndicator } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '../../utils/cn'
import { selectContextKey } from './context'
import { selectItemVariants } from './Select.variants'
import type { SelectItemProps } from './types'

defineOptions({ name: 'RkSelectItem' })

const props = withDefaults(defineProps<SelectItemProps<T>>(), {
  disabled: false,
})

defineSlots<{
  /**
   * The row. Defaults to `label`.
   *
   * `selected` is whether this item is the current value.
   */
  default: (props: { selected: boolean }) => unknown
}>()

const select = inject(selectContextKey)
if (select === undefined) {
  throw new Error('SelectItem must be used inside Select')
}

// Setup, not mounted: the trigger reads the label in the same render, before
// the panel has ever opened.
select.registerLabel(props.value, props.label)
</script>

<template>
  <ComboboxItem
    data-slot="select-item"
    :value="props.value"
    :disabled="props.disabled"
    :class="cn(selectItemVariants(), props.class)"
  >
    <slot :selected="select.model.value === props.value">
      <span class="truncate">{{ props.label }}</span>
    </slot>
    <!--
      Check on the trailing edge — shadcn's recipe. Reserving a fixed
      gutter means labels do not shift when the selection moves.
    -->
    <span class="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
      <ComboboxItemIndicator as-child>
        <svg class="size-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="m5 10 3.5 3.5L15 7"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </ComboboxItemIndicator>
    </span>
  </ComboboxItem>
</template>
