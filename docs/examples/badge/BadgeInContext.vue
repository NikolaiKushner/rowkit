<script setup lang="ts">
import { Badge, Button } from 'rowkit'
</script>

<template>
  <div class="flex flex-col gap-3 text-ui">
    <!-- Next to a heading: the state of the thing it names. -->
    <h3 class="m-0 flex items-center gap-2 text-[13px] font-bold">
      Billing API
      <Badge variant="primary" appearance="solid" size="sm">Beta</Badge>
    </h3>
    <!-- A count inside a button, read with the label: «Inbox 12». -->
    <Button variant="secondary" class="self-start">
      Inbox
      <template #trailing><Badge variant="danger" appearance="solid" size="sm">12</Badge></template>
    </Button>
    <!-- A version beside a package name. -->
    <span class="flex items-center gap-2">
      rowkit <Badge appearance="outline" size="sm">v2.0.0</Badge>
    </span>
  </div>
</template>
