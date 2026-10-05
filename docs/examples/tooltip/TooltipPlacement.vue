<script setup lang="ts">
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'rowkit'

const placements = ['top', 'right', 'bottom', 'left'] as const
</script>

<template>
  <!-- `placement` picks the side; near the edge of the screen it flips to stay visible. -->
  <div class="flex flex-wrap gap-2 py-6">
    <Tooltip v-for="placement in placements" :key="placement">
      <TooltipTrigger as-child>
        <Button variant="secondary">{{ placement }}</Button>
      </TooltipTrigger>
      <TooltipContent :placement="placement">On the {{ placement }}</TooltipContent>
    </Tooltip>
  </div>
</template>
