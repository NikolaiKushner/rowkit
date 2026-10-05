<script setup lang="ts">
import { Badge } from 'rowkit'

const variants = ['neutral', 'primary', 'success', 'warning', 'danger'] as const
const appearances = ['subtle', 'solid', 'outline'] as const
</script>

<template>
  <!-- Five variants, three appearances. Subtle is the quiet default for repeated values. -->
  <div
    class="grid grid-cols-[auto_repeat(3,auto)] items-center justify-start gap-x-4 gap-y-2 text-ui"
  >
    <span />
    <span v-for="appearance in appearances" :key="appearance" class="text-text-subtle">{{
      appearance
    }}</span>
    <template v-for="variant in variants" :key="variant">
      <span class="text-text-subtle">{{ variant }}</span>
      <span v-for="appearance in appearances" :key="appearance">
        <Badge :variant="variant" :appearance="appearance">{{ variant }}</Badge>
      </span>
    </template>
  </div>
</template>
