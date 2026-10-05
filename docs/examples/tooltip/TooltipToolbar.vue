<script setup lang="ts">
import {
  Button,
  CopyIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrashIcon,
} from 'rowkit'

const tools = [
  { label: 'New', icon: PlusIcon },
  { label: 'Edit', icon: EditIcon },
  { label: 'Copy', icon: CopyIcon },
  { label: 'Find', icon: SearchIcon },
  { label: 'Delete', icon: TrashIcon },
]
</script>

<template>
  <!--
    One provider over the toolbar: the first tooltip waits 300ms, and while
    one is showing the next opens at once as the pointer sweeps along.
  -->
  <TooltipProvider :delay-duration="300" :skip-delay-duration="500">
    <div role="toolbar" aria-label="Edit" class="flex gap-0.5">
      <Tooltip v-for="tool in tools" :key="tool.label">
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" :aria-label="tool.label">
            <component :is="tool.icon" />
          </Button>
        </TooltipTrigger>
        <TooltipContent placement="bottom">{{ tool.label }}</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
