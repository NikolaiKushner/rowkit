<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Warning32Icon,
} from 'rowkit'

const open = ref(false)
const archived = ref(false)

function archive(): void {
  archived.value = true
  open.value = false
}
</script>

<template>
  <div class="flex items-center gap-3">
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="destructive" :disabled="archived">Archive project</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Archive «Apollo»?</DialogTitle>
        </DialogHeader>
        <DialogBody class="flex items-start gap-3">
          <Warning32Icon class="shrink-0" />
          <!-- The description is read out with the title when the dialog opens. -->
          <DialogDescription>
            Nobody can edit it until it is restored. Its 14 tables stay readable.
          </DialogDescription>
        </DialogBody>
        <!-- The safe choice first and default: Enter does not archive by accident. -->
        <DialogFooter>
          <Button @click="open = false">Cancel</Button>
          <Button variant="destructive" @click="archive">Archive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <span v-if="archived" role="status" class="text-ui">
      Archived.
      <Button variant="link" @click="archived = false">Restore</Button>
    </span>
  </div>
</template>
