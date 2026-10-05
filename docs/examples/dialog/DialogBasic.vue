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
  Info32Icon,
} from 'rowkit'

const open = ref(false)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="secondary">About this app</Button>
    </DialogTrigger>
    <DialogContent size="sm">
      <DialogHeader>
        <DialogTitle>About Ledger</DialogTitle>
      </DialogHeader>
      <DialogBody class="flex items-start gap-3">
        <Info32Icon class="shrink-0" />
        <p class="m-0 text-ui">Ledger 4.2, built 5 October 2026. Licensed to Lovelace Ltd.</p>
      </DialogBody>
      <DialogFooter>
        <Button @click="open = false">OK</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
