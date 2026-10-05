<script setup lang="ts">
import { Button, EmptyState, GroupBox } from 'rowkit'
</script>

<template>
  <div class="flex flex-wrap items-start gap-3">
    <!-- md fills a page or a window. -->
    <GroupBox legend='size="md"' class="w-72">
      <EmptyState title="Inbox is empty" description="New messages arrive here." :level="3">
        <template #actions><Button>Compose</Button></template>
      </EmptyState>
    </GroupBox>
    <!-- sm fits a side panel, a card or a small table; pair it with sm buttons. -->
    <GroupBox legend='size="sm"' class="w-56">
      <EmptyState size="sm" title="No comments" description="Start the discussion." :level="3">
        <template #actions><Button size="sm">Add a comment</Button></template>
      </EmptyState>
    </GroupBox>
  </div>
</template>
