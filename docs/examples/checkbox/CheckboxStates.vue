<script setup lang="ts">
import { Checkbox } from 'rowkit'
</script>

<template>
  <div class="grid grid-cols-1 gap-1 sm:grid-cols-2">
    <Checkbox :model-value="false" label="Unchecked" />
    <Checkbox :model-value="true" label="Checked" />
    <!-- Some, not all: the bar, not the tick. Clicking it checks. -->
    <Checkbox :model-value="false" indeterminate label="Indeterminate" />
    <Checkbox :model-value="false" disabled label="Disabled" />
    <Checkbox :model-value="true" disabled label="Disabled, checked" />
  </div>
</template>
