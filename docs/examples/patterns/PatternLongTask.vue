<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Button, ProgressBar, StatusBar, StatusBarSection } from 'rowkit'

const total = 1250
const done = ref(0)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function stop(): void {
  clearInterval(timer)
  running.value = false
}

// A task you can measure gets a bar and a count, not a placeholder.
function start(): void {
  done.value = 0
  running.value = true
  timer = setInterval(() => {
    done.value = Math.min(total, done.value + 50)
    if (done.value === total) stop()
  }, 120)
}

onBeforeUnmount(stop)
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <div class="flex gap-1.5">
      <Button :disabled="running" @click="start">Export 1,250 rows</Button>
      <Button variant="secondary" :disabled="!running" @click="stop">Cancel</Button>
    </div>
    <StatusBar>
      <StatusBarSection aria-live="polite">
        {{
          running
            ? `Exporting ${done} of ${total} rows…`
            : done === total
              ? 'Export finished.'
              : 'Ready'
        }}
      </StatusBarSection>
      <StatusBarSection class="w-36 px-0.5">
        <ProgressBar
          :value="done"
          :max="total"
          aria-label="Export progress"
          class="h-[14px] w-full"
        />
      </StatusBarSection>
    </StatusBar>
  </div>
</template>
