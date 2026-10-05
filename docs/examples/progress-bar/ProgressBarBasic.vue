<script setup lang="ts">
import { ProgressBar } from 'rowkit'
</script>

<template>
  <!-- Whole blocks only, as Windows 98 draws them. Every bar needs a name. -->
  <div class="flex w-56 flex-col gap-2">
    <ProgressBar :value="25" aria-label="Quarter done" />
    <ProgressBar :value="60" aria-label="Most of the way" />
    <ProgressBar :value="100" aria-label="Done" />
  </div>
</template>
