<script setup lang="ts">
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'rowkit'
</script>

<template>
  <!-- A tooltip can teach the keyboard shortcut for a command. -->
  <div class="flex gap-2">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="secondary">Save</Button>
      </TooltipTrigger>
      <TooltipContent>Save the file (Ctrl+S)</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="secondary">Find</Button>
      </TooltipTrigger>
      <TooltipContent>Find in this page (Ctrl+F)</TooltipContent>
    </Tooltip>
  </div>
</template>
