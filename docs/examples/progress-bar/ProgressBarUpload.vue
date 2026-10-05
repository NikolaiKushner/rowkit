<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Button, ProgressBar } from 'rowkit'

const sent = ref(0)
const size = 4800 // KB
const running = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function start(): void {
  sent.value = 0
  running.value = true
  timer = setInterval(() => {
    sent.value = Math.min(size, sent.value + 320)
    if (sent.value === size) stop()
  }, 150)
}

function stop(): void {
  clearInterval(timer)
  running.value = false
}

onBeforeUnmount(stop)
</script>

<template>
  <!-- `max` in the task's own unit — kilobytes here — and the numbers beside the bar. -->
  <div class="flex w-72 flex-col gap-2 text-ui">
    <span>report.pdf — {{ sent }} of {{ size }} KB</span>
    <ProgressBar :value="sent" :max="size" aria-label="Uploading report.pdf" />
    <div class="flex gap-1.5">
      <Button size="sm" :disabled="running" @click="start">Upload</Button>
      <Button size="sm" variant="secondary" :disabled="!running" @click="stop">Cancel</Button>
    </div>
  </div>
</template>
