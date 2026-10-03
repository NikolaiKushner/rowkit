<script setup lang="ts" generic="T extends string | number">
import { computed, onBeforeUnmount, useId, watch } from 'vue'
import { cn } from '../../utils/cn'
import { useSelectContext, type SelectItemRecord } from './context'
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

const select = useSelectContext('SelectItem')

// Setup, not mounted: the trigger reads the label in the same render, before
// the panel has ever opened.
select.registerLabel(props.value, props.label)

/*
 * Registered for keyboard order and filtering. The panel mounts the items
 * twice over its life — hidden while shut, listed while open — and each mount
 * registers and unregisters itself, so the list always matches what renders.
 */
const record: SelectItemRecord = {
  value: props.value,
  label: props.label,
  disabled: props.disabled,
  id: useId(),
}
const unregister = select.registerItem(record)
onBeforeUnmount(unregister)

watch(
  () => [props.label, props.disabled] as const,
  ([label, disabled]) => {
    select.registerLabel(props.value, label)
    const live = select.items.find((item) => item.id === record.id)
    if (live) Object.assign(live, { label, disabled })
  }
)

const selected = computed(() => select.model.value === props.value)
const highlighted = computed(() => select.highlighted.value === props.value)
/* Filtered out by the search: kept mounted, so the order and labels survive. */
const visible = computed(() => select.visibleItems.value.some((item) => item.id === record.id))

function onPointerMove(): void {
  if (!props.disabled) select.highlighted.value = props.value
}
</script>

<template>
  <div
    v-show="visible"
    :id="record.id"
    role="option"
    data-slot="select-item"
    :aria-selected="selected"
    :aria-disabled="props.disabled ? 'true' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :data-highlighted="highlighted ? '' : undefined"
    :data-state="selected ? 'checked' : 'unchecked'"
    :class="cn(selectItemVariants(), props.class)"
    @pointermove="onPointerMove"
    @click="select.choose(props.value)"
  >
    <slot :selected="selected">
      <span class="truncate">{{ props.label }}</span>
    </slot>
    <!--
      Check on the trailing edge — shadcn's recipe. Reserving a fixed
      gutter means labels do not shift when the selection moves.
    -->
    <span class="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
      <svg v-if="selected" class="size-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="m5 10 3.5 3.5L15 7"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </div>
</template>
