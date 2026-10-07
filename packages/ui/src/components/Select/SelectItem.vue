<script setup lang="ts" generic="T extends string | number">
import { computed, onBeforeUnmount, useId, watch } from 'vue'
import { cn } from '../../utils/cn'
import { useSelectContext, type SelectItemRecord } from './context'
import CheckGlyphIcon from '../../icons/CheckGlyphIcon.vue'
import { selectItemCheckVariants, selectItemVariants } from './Select.variants'
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

/* Pressed on the field, dragged here, released: that is a choice too. */
function onPointerUp(): void {
  if (select.dragging.value) select.choose(props.value)
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
    @pointerup="onPointerUp"
    @click="select.choose(props.value)"
  >
    <span data-slot="select-item-check" aria-hidden="true" :class="selectItemCheckVariants()">
      <CheckGlyphIcon v-if="selected" />
    </span>
    <slot :selected="selected">
      <span class="truncate">{{ props.label }}</span>
    </slot>
  </div>
</template>
