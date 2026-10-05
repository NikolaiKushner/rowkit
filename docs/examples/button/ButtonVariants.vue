<script setup lang="ts">
import { Button } from 'rowkit'
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- One per view: the action the form or dialog is for. -->
    <Button>Default</Button>
    <!-- Every other command. -->
    <Button variant="secondary">Secondary</Button>
    <!-- Flat until hovered: toolbars. -->
    <Button variant="ghost">Ghost</Button>
    <!-- An action that loses data, behind a confirmation. -->
    <Button variant="destructive">Destructive</Button>
    <!-- Text that acts, on the same page. -->
    <Button variant="link">Link</Button>
  </div>
</template>
