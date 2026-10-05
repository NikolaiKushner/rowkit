<script setup lang="ts">
import {
  Button,
  CopyIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  TriangleDownIcon,
} from 'rowkit'
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- An icon before the label, or after it — a chevron for a button that opens something. -->
    <div class="flex flex-wrap items-center gap-2">
      <Button>
        <template #leading><PlusIcon /></template>
        New user
      </Button>
      <Button variant="secondary">
        <template #leading><CopyIcon /></template>
        Duplicate
      </Button>
      <Button variant="secondary">
        Export
        <template #trailing><TriangleDownIcon /></template>
      </Button>
    </div>

    <!-- Icon only: a square button. It has no visible text, so it needs an aria-label. -->
    <div class="flex flex-wrap items-center gap-2">
      <Button size="icon-xs" variant="ghost" aria-label="Edit"><EditIcon /></Button>
      <Button size="icon-sm" variant="ghost" aria-label="Search"><SearchIcon /></Button>
      <Button size="icon" variant="secondary" aria-label="Copy"><CopyIcon /></Button>
      <Button size="icon-lg" variant="secondary" aria-label="Delete"><TrashIcon /></Button>
    </div>
  </div>
</template>
