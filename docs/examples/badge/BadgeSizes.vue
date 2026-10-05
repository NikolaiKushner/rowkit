<script setup lang="ts">
import { Badge } from 'rowkit'
</script>

<template>
  <!-- sm for table cells and dense lists, md beside headings and labels. -->
  <div class="flex flex-wrap items-center gap-3">
    <Badge size="sm" variant="primary">sm</Badge>
    <Badge size="md" variant="primary">md</Badge>
  </div>
</template>
