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

const open = ref(false)
const accepted = ref(false)

const clauses = Array.from(
  { length: 24 },
  (_, i) =>
    `${String(i + 1)}. Nothing here is a real term. It is long so the body has more to show than fits, and scrolls while the title and the buttons stay put.`
)
</script>

<template>
  <div class="flex items-center gap-3">
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="secondary">Read the terms</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
        </DialogHeader>
        <!-- The body is the only part that scrolls. -->
        <DialogBody class="flex flex-col gap-2">
          <p v-for="clause in clauses" :key="clause" class="m-0 text-ui">{{ clause }}</p>
        </DialogBody>
        <DialogFooter>
          <Button @click="((accepted = true), (open = false))">Accept</Button>
          <Button variant="secondary" @click="open = false">Decline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <span class="text-ui">{{ accepted ? 'Accepted.' : 'Not accepted yet.' }}</span>
  </div>
</template>
