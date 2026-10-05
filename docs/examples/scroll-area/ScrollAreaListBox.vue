<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea } from 'rowkit'

const fonts = [
  'Arial',
  'Book Antiqua',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Impact',
  'Lucida Console',
  'PT Sans',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  'VT323',
  'Wingdings',
]
const chosen = ref('PT Sans')
</script>

<template>
  <!-- A Windows 98 list box: a list longer than its box gets the vertical bar only. -->
  <ScrollArea label="Fonts" class="h-32 w-48 bg-input p-0.5 shadow-sunken">
    <ul role="listbox" aria-label="Fonts" class="m-0 list-none p-0 text-ui">
      <li
        v-for="font in fonts"
        :key="font"
        role="option"
        :aria-selected="font === chosen"
        class="cursor-default px-1"
        :class="font === chosen ? 'bg-surface-selected text-on-selected' : ''"
        @click="chosen = font"
      >
        {{ font }}
      </li>
    </ul>
  </ScrollArea>
</template>
