<script setup lang="ts">
import { ref } from 'vue'
import { Button, ButtonGroup } from 'rowkit'

const zoom = ref(100)
</script>

<template>
  <!-- Raised buttons edge to edge, each keeping its own bevel: − 100% + -->
  <ButtonGroup aria-label="Zoom">
    <Button
      variant="secondary"
      size="sm"
      aria-label="Zoom out"
      :disabled="zoom <= 25"
      @click="zoom -= 25"
    >
      −
    </Button>
    <Button variant="secondary" size="sm" class="min-w-14 tabular-nums" @click="zoom = 100">
      {{ zoom }}%
    </Button>
    <Button
      variant="secondary"
      size="sm"
      aria-label="Zoom in"
      :disabled="zoom >= 400"
      @click="zoom += 25"
    >
      +
    </Button>
  </ButtonGroup>
</template>
