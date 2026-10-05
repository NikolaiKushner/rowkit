<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Select v-for="size in ['sm', 'md', 'lg'] as const" :key="size" model-value="a" class="w-36">
      <SelectTrigger :size="size" :toggler-label="`Open ${size} list`" />
      <SelectContent>
        <SelectItem value="a" :label="`Size ${size}`" />
        <SelectItem value="b" label="Another option" />
      </SelectContent>
    </Select>
  </div>
</template>
