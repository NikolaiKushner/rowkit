<script setup lang="ts">
import { ref } from 'vue'
import { Button, ButtonGroup, CopyIcon, EditIcon, PlusIcon, Separator, TrashIcon } from 'rowkit'

const selected = ref(2)
</script>

<template>
  <!-- An application toolbar: flat buttons, groups split by an etched line. -->
  <div role="toolbar" aria-label="Users" class="flex flex-wrap items-center gap-1 bg-card p-0.5">
    <Button variant="ghost">
      <template #leading><PlusIcon /></template>
      New
    </Button>
    <Separator orientation="vertical" decorative class="mx-0.5 h-[27px]" />
    <ButtonGroup aria-label="Selection">
      <Button variant="ghost" :disabled="selected !== 1">
        <template #leading><EditIcon /></template>
        Edit
      </Button>
      <Button variant="ghost" :disabled="selected === 0">
        <template #leading><CopyIcon /></template>
        Copy {{ selected }}
      </Button>
      <Button variant="ghost" :disabled="selected === 0" @click="selected = 0">
        <template #leading><TrashIcon /></template>
        Delete {{ selected }}
      </Button>
    </ButtonGroup>
  </div>
</template>
