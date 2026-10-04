<script setup lang="ts">
import CloseGlyphIcon from '../../icons/CloseGlyphIcon.vue'
import MaximizeGlyphIcon from '../../icons/MaximizeGlyphIcon.vue'
import MinimizeGlyphIcon from '../../icons/MinimizeGlyphIcon.vue'
import RestoreGlyphIcon from '../../icons/RestoreGlyphIcon.vue'
import { cn } from '../../utils/cn'
import { windowButtonVariants } from './Window.variants'
import type { WindowButtonProps } from './types'

defineOptions({ name: 'RkWindowButton' })

const props = withDefaults(defineProps<WindowButtonProps>(), {
  disabled: false,
})

defineEmits<{
  /** The button was activated. What it does — close, minimize — is the caller's. */
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    data-slot="window-button"
    :data-glyph="props.glyph"
    :aria-label="props.label"
    :disabled="props.disabled"
    :class="cn(windowButtonVariants(), props.class)"
    @click="$emit('click', $event)"
  >
    <MinimizeGlyphIcon v-if="props.glyph === 'minimize'" />
    <MaximizeGlyphIcon v-else-if="props.glyph === 'maximize'" />
    <RestoreGlyphIcon v-else-if="props.glyph === 'restore'" />
    <CloseGlyphIcon v-else />
  </button>
</template>
