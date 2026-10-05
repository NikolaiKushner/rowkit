<script setup lang="ts">
import { Button } from 'rowkit'
</script>

<template>
  <!-- The default button is the one Enter presses; every other command is secondary. -->
  <div class="flex gap-1.5">
    <Button>OK</Button>
    <Button variant="secondary">Cancel</Button>
  </div>
</template>
