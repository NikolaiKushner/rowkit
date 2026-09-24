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
  <!--
    While shut, the items still have to mount: each `SelectItem` registers its
    label in setup, and the trigger reads that label for a value that was set
    before the panel ever opened. They mount here, not inside `ComboboxContent`.

    `ComboboxContent` installs focus guards at the edges of `document.body` for
    as long as it is mounted, and Reka forces `display: flex` on it. Keeping
    the panel mounted while closed stole the first Tab stop and left a nameless
    listbox in the accessibility tree.
  -->
  <div v-if="!select.open.value" hidden>
    <slot />
  </div>

  <ComboboxPortal v-else :defer="false">
    <ComboboxContent
      position="popper"
      :side-offset="4"
      data-slot="select-content"
      :class="cn(selectContentVariants(), props.class)"
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
