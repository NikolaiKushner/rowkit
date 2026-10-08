<script setup lang="ts">
import { ProgressBar } from 'rowkit'
</script>

<template>
  <!-- No value: how much is left is unknown, so a segment travels the track. -->
  <div class="flex w-56 flex-col gap-2">
    <ProgressBar aria-label="Connecting to the server" />
  </div>
</template>
