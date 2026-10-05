<script setup lang="ts">
import { ScrollArea } from 'rowkit'

const log = Array.from(
  { length: 30 },
  (_, i) => `14:${String(10 + i).padStart(2, '0')} Job ${String(800 + i)} finished`
)
</script>

<template>
  <!-- Give it a size; the bars appear on whichever axis the content outgrows. -->
  <ScrollArea label="Event log" class="h-40 w-72 bg-input p-0.5 text-ui shadow-sunken">
    <p v-for="line in log" :key="line" class="m-0 px-1">{{ line }}</p>
  </ScrollArea>
</template>
