<script setup lang="ts">
import { Button, ButtonGroup, Separator } from 'rowkit'
</script>

<template>
  <!-- Vertical, between toolbar groups: it stretches to their height. -->
  <ButtonGroup aria-label="Edit">
    <ButtonGroup>
      <Button variant="ghost">Cut</Button>
      <Button variant="ghost">Copy</Button>
    </ButtonGroup>
    <Separator orientation="vertical" />
    <ButtonGroup>
      <Button variant="ghost">Undo</Button>
    </ButtonGroup>
  </ButtonGroup>
</template>
