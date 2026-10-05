<script setup lang="ts">
import { ScrollArea } from 'rowkit'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const sales = [12, 19, 8, 24, 31, 27, 22, 18, 29, 35, 41, 38]
</script>

<template>
  <!-- Wider than its box: the bar runs along the bottom, below the content, never over it. -->
  <ScrollArea label="Monthly sales" class="w-full max-w-80 bg-input p-0.5 shadow-sunken">
    <div class="flex h-32 items-end gap-2 p-2">
      <div
        v-for="(month, i) in months"
        :key="month"
        class="flex w-10 shrink-0 flex-col items-center gap-1 text-ui"
      >
        <span class="w-6 bg-primary-solid" :style="{ height: `${(sales[i] ?? 0) * 2}px` }" />
        {{ month }}
      </div>
    </div>
  </ScrollArea>
</template>
