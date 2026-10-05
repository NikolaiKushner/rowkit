<script setup lang="ts">
import { Button, EmptyState, PlusIcon } from 'rowkit'
</script>

<template>
  <!-- A title, what the place is for, and the one thing to do next. -->
  <EmptyState
    title="No projects yet"
    description="Projects group your work and control who can see it."
    :level="3"
  >
    <template #actions>
      <Button>
        <template #leading><PlusIcon /></template>
        Create a project
      </Button>
    </template>
  </EmptyState>
</template>
