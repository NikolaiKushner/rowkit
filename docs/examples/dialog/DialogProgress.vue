<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ProgressBar,
} from 'rowkit'

const open = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function stop(): void {
  clearInterval(timer)
  open.value = false
}

function start(): void {
  progress.value = 0
  open.value = true
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 8)
    if (progress.value === 100) stop()
  }, 250)
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <!--
    Opened from code, with no trigger: focus goes back to whatever had it.
    prevent-close blocks Escape and outside clicks, so a stray key does not
    hide a running job; the ✕ and Cancel still stop it on purpose.
  -->
  <Button variant="secondary" @click="start">Import 1,250 contacts</Button>
  <Dialog :open="open" @update:open="(value) => !value && stop()">
    <DialogContent size="sm" prevent-close close-label="Cancel import">
      <DialogHeader>
        <DialogTitle>Importing contacts</DialogTitle>
      </DialogHeader>
      <DialogBody class="flex flex-col gap-2">
        <DialogDescription>contacts.csv — {{ progress }}% done</DialogDescription>
        <ProgressBar :value="progress" aria-label="Import progress" />
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" @click="stop">Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
