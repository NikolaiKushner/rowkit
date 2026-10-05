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
} from 'rowkit'

const open = ref(false)
const deleted = ref(false)

function remove(): void {
  deleted.value = true
  open.value = false
}
</script>

<template>
  <!--
    A destructive button opens a confirmation. In the dialog the safe choice
    is the default: Enter cancels, and Delete has to be chosen on purpose.
  -->
  <div class="flex items-center gap-3">
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="destructive" :disabled="deleted">Delete project…</Button>
      </DialogTrigger>
      <DialogContent class="w-[360px]">
        <DialogHeader>
          <DialogTitle>Delete «Apollo»?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            The project and its 14 tables are removed for everyone. This cannot be undone.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <Button @click="open = false">Cancel</Button>
          <Button variant="destructive" @click="remove">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <span v-if="deleted" class="text-ui" role="status">
      Deleted.
      <Button variant="link" @click="deleted = false">Undo</Button>
    </span>
  </div>
</template>
