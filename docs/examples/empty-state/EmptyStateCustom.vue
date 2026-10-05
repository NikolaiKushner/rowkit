<script setup lang="ts">
import { Button, EmptyState, Trash32Icon } from 'rowkit'
</script>

<template>
  <!-- Your own 32px icon, and a description with markup in it. -->
  <EmptyState title="The Recycle Bin is empty" :level="3">
    <template #icon><Trash32Icon aria-hidden="true" /></template>
    <template #description>
      Deleted files stay here for 30 days.
      <a href="/components/dialog" class="text-link underline">How restoring works</a>
    </template>
    <template #actions>
      <Button variant="secondary">Open folder</Button>
    </template>
  </EmptyState>
</template>
