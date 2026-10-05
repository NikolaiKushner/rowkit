<script setup lang="ts">
import { Button, Tooltip, TooltipContent, TooltipTrigger, TrashIcon } from 'rowkit'
</script>

<template>
  <!-- An icon-only button: the aria-label names it, the tooltip shows the name. -->
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="ghost" size="icon" aria-label="Delete project"><TrashIcon /></Button>
    </TooltipTrigger>
    <TooltipContent>Delete project</TooltipContent>
  </Tooltip>
</template>
