<script setup lang="ts">
import { ref } from 'vue'
import { Button, ProgressBar } from 'rowkit'

const done = ref(3)
const total = 12
</script>

<template>
  <!-- Counted steps rather than a percentage: 3 of 12 files. -->
  <div class="flex w-72 flex-col gap-2 text-ui">
    <span>Copying {{ done }} of {{ total }} files</span>
    <ProgressBar :value="done" :max="total" :aria-label="`Copied ${done} of ${total} files`" />
    <Button
      size="sm"
      variant="secondary"
      class="self-start"
      :disabled="done === total"
      @click="done++"
    >
      Copy next file
    </Button>
  </div>
</template>
