<script setup lang="ts">
import { Button, ButtonGroup, CopyIcon, EditIcon, PlusIcon, SearchIcon, TrashIcon } from 'rowkit'
</script>

<template>
  <!-- A tool palette down the side of a window: vertical, each button the full width. -->
  <ButtonGroup orientation="vertical" aria-label="Tools" class="w-32 bg-card p-0.5 shadow-window">
    <Button variant="ghost" class="justify-start">
      <template #leading><PlusIcon /></template>
      New
    </Button>
    <Button variant="ghost" class="justify-start">
      <template #leading><EditIcon /></template>
      Edit
    </Button>
    <Button variant="ghost" class="justify-start">
      <template #leading><CopyIcon /></template>
      Copy
    </Button>
    <Button variant="ghost" class="justify-start">
      <template #leading><SearchIcon /></template>
      Find
    </Button>
    <Button variant="ghost" class="justify-start">
      <template #leading><TrashIcon /></template>
      Delete
    </Button>
  </ButtonGroup>
</template>
