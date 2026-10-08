<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  provide,
  ref,
  useId,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import HourglassIcon from '../../icons/HourglassIcon.vue'
import DismissableLayer from '../../primitives/DismissableLayer.vue'
import type { PointerDownOutsideEvent } from '../../primitives/dismissableLayer'
import { unrefElement } from '../../primitives/dom'
import { useFloating } from '../../primitives/position'
import { cn } from '../../utils/cn'
import { FIELD_CONTEXT, type FieldContext } from '../Field/context'
import Input from '../Input/Input.vue'
import { useSelectContext } from './context'
import {
  selectContentVariants,
  selectListVariants,
  selectMessageVariants,
  selectSearchVariants,
} from './Select.variants'
import type { SelectContentProps } from './types'

defineOptions({ name: 'RkSelectContent' })

const props = withDefaults(defineProps<SelectContentProps>(), {
  emptyText: 'No results found',
  searchLabel: 'Search',
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

/*
 * The search box is an Input, and an Input inside a Field takes the Field's
 * id, error and description. Those belong to the select's own control, so the
 * Field stops here.
 */
provide(FIELD_CONTEXT, undefined as unknown as FieldContext)

const layer = ref<ComponentPublicInstance | null>(null)
const panel = computed(() => unrefElement(layer.value))
watch(panel, (element) => (select.panel.value = element ?? undefined))

const searchId = useId()

/* A searchable list hands focus to its search box as it opens. */
watch(panel, async (element) => {
  if (!element || !select.searchable.value) return
  await nextTick()
  element.querySelector<HTMLInputElement>('[data-slot="select-search"] input')?.focus()
})

/*
 * The search box drives the list the way the control does: arrows move the
 * highlight, Enter chooses, Escape and Tab close. Tab closes with focus back
 * on the control and lets the browser carry on from there, so it lands where
 * Tab from the control would have.
 */
function onSearchKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault()
      select.move(event.key === 'ArrowDown' ? 'next' : 'previous')
      return
    case 'Enter':
      event.preventDefault()
      if (select.highlighted.value !== undefined) select.choose(select.highlighted.value)
      return
    case 'Escape':
      // Closes the list, not the dialog the select sits in.
      event.preventDefault()
      event.stopPropagation()
      select.setOpen(false)
      return
    case 'Tab':
      select.setOpen(false)
  }
}

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
        The search box is the combobox while the list is open: it owns the
        listbox and follows the highlight through aria-activedescendant.
      -->
      <div v-if="select.searchable.value" data-slot="select-search" :class="selectSearchVariants()">
        <Input
          :id="searchId"
          v-model="select.searchTerm.value"
          type="search"
          size="sm"
          role="combobox"
          autocomplete="off"
          aria-autocomplete="list"
          aria-expanded="true"
          :aria-controls="select.listboxId"
          :aria-activedescendant="select.activeDescendant.value"
          :aria-label="props.searchLabel"
          :placeholder="props.searchLabel"
          @keydown="onSearchKeyDown"
        />
      </div>

      <!--
        Options never take focus: it stays in the control or the search box,
        and the listbox follows it through aria-activedescendant. A press on an
        option is prevented so focus does not leave mid-choice.
      -->
      <div :id="select.listboxId" role="listbox" :class="selectListVariants()" @pointerdown.prevent>
        <div v-if="props.loading" :class="selectMessageVariants({ tone: 'loading' })" role="status">
          <!-- Windows 98's hourglass; a theme with a spinner glyph turns it. -->
          <HourglassIcon
            aria-hidden="true"
            class="shrink-0 [--rk-icon-hourglass:var(--rk-icon-spinner)] motion-safe:animate-(--rk-animate-busy)"
          />
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
