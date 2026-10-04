<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import DismissableLayer from '../../primitives/DismissableLayer.vue'
import type { PointerDownOutsideEvent } from '../../primitives/dismissableLayer'
import { unrefElement } from '../../primitives/dom'
import { useFloating } from '../../primitives/position'
import { cn } from '../../utils/cn'
import { useSelectContext } from './context'
import { selectContentVariants, selectListVariants, selectMessageVariants } from './Select.variants'
import type { SelectContentProps } from './types'

defineOptions({ name: 'RkSelectContent' })

const props = withDefaults(defineProps<SelectContentProps>(), {
  emptyText: 'No results',
  loading: false,
  loadingText: 'Loading…',
})

defineSlots<{
  /** The items. */
  default: () => unknown
  /** Replaces the empty-results message. */
  empty: () => unknown
}>()

const select = useSelectContext('SelectContent')

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const layer = ref<ComponentPublicInstance | null>(null)
const panel = computed(() => unrefElement(layer.value))

/* Below the control, or above it when there is no room below. */
const { style } = useFloating(select.anchor, panel, () => ({
  side: 'bottom',
  offset: 0,
  padding: 8,
}))

/* As wide as the control, so the panel never offers truncated labels alone. */
const panelStyle = computed(() => ({
  ...style.value,
  '--rk-select-trigger-width': `${String(select.anchor.value?.offsetWidth ?? 0)}px`,
}))

/* Keep the highlighted option in view as the keyboard moves through a long list. */
watch(
  () => select.activeDescendant.value,
  async (id) => {
    if (!id) return
    await nextTick()
    document.getElementById(id)?.scrollIntoView({ block: 'nearest' })
  }
)

/*
 * The control sits outside the panel, so a press on it would read as a click
 * outside. It is the control's own click that toggles; the layer stays out of
 * it. Focus moving to the control is likewise not "leaving".
 */
function insideControl(event: CustomEvent<{ originalEvent: Event }>): boolean {
  return !!select.anchor.value?.contains(event.detail.originalEvent.target as Node)
}

function onPointerDownOutside(event: PointerDownOutsideEvent): void {
  if (insideControl(event)) event.preventDefault()
}

function onFocusOutside(event: CustomEvent<{ originalEvent: FocusEvent }>): void {
  if (insideControl(event)) event.preventDefault()
}

const isEmpty = computed(() => select.visibleItems.value.length === 0)
</script>

<template>
  <!--
    While shut, the items still mount, hidden: each SelectItem registers its
    label during setup, and the trigger shows the label of a value set before
    the panel ever opened.
  -->
  <div v-if="!select.open.value" hidden>
    <slot />
  </div>

  <Teleport v-else-if="mounted" to="body">
    <DismissableLayer
      ref="layer"
      data-slot="select-content"
      :style="panelStyle"
      :class="cn(selectContentVariants(), props.class)"
      @pointer-down-outside="onPointerDownOutside"
      @focus-outside="onFocusOutside"
      @dismiss="select.setOpen(false)"
    >
      <!--
        Options never take focus: it stays in the control, and the listbox
        follows it through aria-activedescendant. A press on an option is
        prevented so the control does not blur mid-choice.
      -->
      <div :id="select.listboxId" role="listbox" :class="selectListVariants()" @pointerdown.prevent>
        <div v-if="props.loading" :class="selectMessageVariants()" role="status">
          {{ props.loadingText }}
        </div>

        <template v-else>
          <div v-if="isEmpty" :class="selectMessageVariants()">
            <slot name="empty">{{ props.emptyText }}</slot>
          </div>

          <slot />
        </template>
      </div>
    </DismissableLayer>
  </Teleport>
</template>
