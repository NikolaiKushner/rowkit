<script setup lang="ts">
import { GroupBox } from 'rowkit'
</script>

<template>
  <!-- Not a form? as="section" frames read-only content, named by its legend. -->
  <GroupBox as="section" legend="Summary" class="w-full max-w-80">
    <dl class="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ui">
      <dt class="text-text-subtle">Plan</dt>
      <dd class="m-0">Team, 25 seats</dd>
      <dt class="text-text-subtle">Renews</dt>
      <dd class="m-0">1 November 2026</dd>
      <dt class="text-text-subtle">Total</dt>
      <dd class="m-0 font-bold">€49.00 a month</dd>
    </dl>
  </GroupBox>
</template>
