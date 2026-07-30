<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastViewport,
} from 'reka-ui'
import { watch } from 'vue'
import { useToast } from '../../composables/useToast'
import { cn } from '../../utils/cn'
import {
  toastActionVariants,
  toastCloseVariants,
  toasterViewportVariants,
  toastMessageVariants,
  toastVariants,
} from './Toaster.variants'
import type { ToasterProps } from './types'

defineOptions({ name: 'RkToaster' })

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right',
  max: 3,
  label: 'Notification',
  closeLabel: 'Dismiss',
})

const { visible, dismiss, setMax } = useToast()

watch(() => props.max, setMax, { immediate: true })

/**
 * Reka reads `Infinity` as "never dismiss on its own"; the public API uses `0`,
 * which is the more obvious way to say it in a call site.
 */
const durationFor = (duration: number): number => (duration === 0 ? Infinity : duration)

/**
 * Every toast is `background`, including danger ones.
 *
 * Reka maps `foreground` to an assertive live region, which interrupts whatever
 * a screen reader is currently saying. That is for genuine emergencies, not for
 * "could not save" — the user is mid-sentence somewhere else and losing that is
 * a worse outcome than hearing the error a moment later. Polite for everything,
 * deliberately.
 */
</script>

<template>
  <ToastProvider :label="props.label" swipe-direction="right">
    <template v-for="item in visible" :key="item.id">
      <ToastRoot
        type="background"
        :duration="durationFor(item.duration)"
        :open="true"
        :class="toastVariants({ variant: item.variant })"
        @update:open="(open: boolean) => !open && dismiss(item.id)"
      >
        <span :class="toastMessageVariants()">{{ item.message }}</span>

        <ToastAction
          v-if="item.action"
          :alt-text="item.action.label"
          :class="toastActionVariants()"
          @click="item.action.onClick()"
        >
          {{ item.action.label }}
        </ToastAction>

        <ToastClose :aria-label="props.closeLabel" :class="toastCloseVariants()">
          <svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="m4 4 6 6M10 4l-6 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </ToastClose>
      </ToastRoot>
    </template>

    <ToastPortal>
      <!--
        The viewport is always mounted, whether or not anything is queued. A live
        region added at the same moment as its content is frequently not
        announced — the same reason DataTable keeps an empty status region.
      -->
      <ToastViewport
        :class="cn(toasterViewportVariants({ position: props.position }), props.class)"
      />
    </ToastPortal>
  </ToastProvider>
</template>
