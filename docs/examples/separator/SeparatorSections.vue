<script setup lang="ts">
import { Button, Checkbox, Separator } from 'rowkit'
</script>

<template>
  <!-- Horizontal, between the sections of a panel or a dialog. -->
  <div class="flex w-64 flex-col gap-2 bg-card p-3 text-ui shadow-window">
    <b>Print</b>
    <Checkbox :model-value="true" label="Print headers" />
    <Checkbox :model-value="false" label="Print gridlines" />
    <Separator />
    <Checkbox :model-value="false" label="Black and white" />
    <Separator />
    <div class="flex justify-end gap-1.5">
      <Button>Print</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  </div>
</template>
