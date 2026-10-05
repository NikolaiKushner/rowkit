<script setup lang="ts">
import { Separator } from 'rowkit'
</script>

<template>
  <!-- Between items of text in a row; decorative, so screen readers skip it. -->
  <div class="flex h-4 items-center gap-2 text-ui">
    <span>12 files</span>
    <Separator orientation="vertical" decorative />
    <span>4.2 MB</span>
    <Separator orientation="vertical" decorative />
    <span>Modified today</span>
  </div>
</template>
