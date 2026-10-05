<script setup lang="ts">
import { computed, ref } from 'vue'
import { StatusBar, StatusBarSection } from 'rowkit'

const text = ref('Dear Ada,\nThe analytical engine arrived today.')
const caret = ref(0)

const words = computed(() => text.value.trim().split(/\s+/).filter(Boolean).length)
// Line and column of the caret, as a text editor's status bar shows them.
const position = computed(() => {
  const before = text.value.slice(0, caret.value).split('\n')
  return { line: before.length, column: (before[before.length - 1]?.length ?? 0) + 1 }
})

function track(event: Event): void {
  caret.value = (event.target as HTMLTextAreaElement).selectionStart
}
</script>

<template>
  <div class="flex w-full max-w-[460px] flex-col bg-card p-0.5 shadow-window">
    <textarea
      v-model="text"
      aria-label="Letter"
      class="h-28 resize-none border-0 bg-input p-1 font-mono text-[16px] leading-4 shadow-sunken outline-none"
      @keyup="track"
      @click="track"
      @input="track"
    />
    <!-- Status that follows what the person is doing, section by section. -->
    <StatusBar class="pt-0.5">
      <StatusBarSection>{{ words }} words</StatusBarSection>
      <StatusBarSection class="w-28"
        >Ln {{ position.line }}, Col {{ position.column }}</StatusBarSection
      >
      <StatusBarSection class="w-14">UTF-8</StatusBarSection>
    </StatusBar>
  </div>
</template>
