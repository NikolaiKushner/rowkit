<script setup lang="ts">
import { Skeleton } from 'rowkit'
</script>

<template>
  <!-- animated off: the dither stays still, for a placeholder that sits a while. -->
  <div class="flex w-72 flex-col gap-2">
    <Skeleton :animated="false" :lines="2" />
    <Skeleton :animated="false" variant="rect" class="h-10" />
  </div>
</template>
