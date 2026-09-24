<script setup lang="ts">
import { ComboboxContent, ComboboxEmpty, ComboboxPortal, ComboboxViewport } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '../../utils/cn'
import { selectContextKey } from './context'
import { selectContentVariants } from './Select.variants'
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

const select = inject(selectContextKey)
if (select === undefined) {
  throw new Error('SelectContent must be used inside Select')
}
</script>

<template>
  <ComboboxPortal :defer="false">
    <!--
      `force-mount` keeps the items alive while the panel is shut, so each
      `SelectItem` can register its label before the first paint of a
      preselected value. `hidden` takes the closed panel out of sight and out
      of the accessibility tree; Reka still unmounts nothing we need.
    -->
    <ComboboxContent
      force-mount
      position="popper"
      :side-offset="4"
      data-slot="select-content"
      :class="cn(selectContentVariants(), !select.open.value && 'hidden', props.class)"
    >
      <ComboboxViewport class="max-h-64 overflow-y-auto p-1">
        <div v-if="props.loading" class="px-2 py-1.5 text-sm text-muted-foreground" role="status">
          {{ props.loadingText }}
        </div>

        <template v-else>
          <ComboboxEmpty class="px-2 py-1.5 text-sm text-muted-foreground">
            <slot name="empty">{{ props.emptyText }}</slot>
          </ComboboxEmpty>

          <slot />
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxPortal>
</template>
