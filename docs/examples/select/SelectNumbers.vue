<script setup lang="ts">
import { ref } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

// Values do not have to be strings: v-model stays a number.
const pageSize = ref(25)
</script>

<template>
  <div class="flex items-center gap-2 text-ui">
    <label for="page-size">Rows per page</label>
    <Select v-model="pageSize" class="w-20">
      <SelectTrigger id="page-size" size="sm" />
      <SelectContent>
        <SelectItem
          v-for="size in [10, 25, 50, 100]"
          :key="size"
          :value="size"
          :label="String(size)"
        />
      </SelectContent>
    </Select>
    <span class="text-text-subtle">({{ typeof pageSize }} {{ pageSize }})</span>
  </div>
</template>
