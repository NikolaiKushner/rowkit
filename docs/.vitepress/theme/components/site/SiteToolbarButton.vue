<script setup lang="ts">
/**
 * An Explorer toolbar button: a 32px icon over an 11px caption, flat until
 * hovered (thin raised bevel), thin sunken while held. Disabled, the caption
 * greys and embosses and the icon fades.
 */
defineProps<{
  label: string
  disabled?: boolean
}>()

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="rk-toolbar-button flex min-w-14 shrink-0 flex-col items-center gap-0.5 px-1 pt-0.5 pb-1 text-ui text-foreground outline-none hover:shadow-raised-thin focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-dotted focus-visible:outline-ring active:pt-1 active:pr-0.5 active:pb-0.5 active:pl-1.5 active:shadow-status active:hover:shadow-status disabled:text-text-disabled disabled:text-shadow-disabled disabled:hover:shadow-none"
    @click="$emit('click', $event)"
  >
    <span class="rk-toolbar-icon size-8"><slot /></span>
    {{ label }}
  </button>
</template>

<style scoped>
/* A disabled toolbar icon fades to grey, as Explorer drew Forward with no history. */
.rk-toolbar-button:disabled .rk-toolbar-icon {
  filter: grayscale(1);
  opacity: 0.5;
}
</style>
