<script setup lang="ts">
import { ref } from 'vue'
import { Button, ButtonGroup, Separator } from 'rowkit'

// Independent toggles: each latches on its own.
const bold = ref(true)
const italic = ref(false)
const underline = ref(false)

// One of several: a view switch.
const views = ['Icons', 'List', 'Details'] as const
const view = ref<(typeof views)[number]>('Details')
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <ButtonGroup aria-label="Text style">
      <Button variant="ghost" size="sm" :pressed="bold" @click="bold = !bold">
        <b>Bold</b>
      </Button>
      <Button variant="ghost" size="sm" :pressed="italic" @click="italic = !italic">
        <i>Italic</i>
      </Button>
      <Button variant="ghost" size="sm" :pressed="underline" @click="underline = !underline">
        <u>Underline</u>
      </Button>
    </ButtonGroup>

    <Separator orientation="vertical" decorative class="h-6" />

    <ButtonGroup aria-label="View">
      <Button
        v-for="item in views"
        :key="item"
        variant="secondary"
        size="sm"
        :pressed="view === item"
        @click="view = item"
      >
        {{ item }}
      </Button>
    </ButtonGroup>
  </div>
</template>
