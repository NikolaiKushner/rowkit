<script setup lang="ts">
import { Badge } from 'rowkit'
</script>

<template>
  <!-- The word carries the meaning; the dot gives the eye something to find down a column. -->
  <div class="flex flex-wrap gap-2">
    <Badge variant="success" dot>Active</Badge>
    <Badge variant="warning" dot>Invited</Badge>
    <Badge variant="danger" dot>Suspended</Badge>
  </div>
</template>
