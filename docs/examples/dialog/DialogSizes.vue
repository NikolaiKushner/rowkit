<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'rowkit'

const sizes = [
  { size: 'sm', width: '320px', use: 'a question or a short message' },
  { size: 'md', width: '440px', use: 'a small form — the default' },
  { size: 'lg', width: '600px', use: 'a list, a table, longer text' },
] as const

const open = ref<string>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Dialog
      v-for="item in sizes"
      :key="item.size"
      :open="open === item.size"
      @update:open="(value) => (open = value ? item.size : undefined)"
    >
      <DialogTrigger as-child>
        <Button variant="secondary">size="{{ item.size }}"</Button>
      </DialogTrigger>
      <DialogContent :size="item.size">
        <DialogHeader>
          <DialogTitle>{{ item.width }} wide</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p class="m-0 text-ui">For {{ item.use }}. The height follows the content.</p>
        </DialogBody>
        <DialogFooter>
          <Button @click="open = undefined">OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
