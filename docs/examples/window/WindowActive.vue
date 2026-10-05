<script setup lang="ts">
import { ref } from 'vue'
import { Window, WindowBody, WindowButton, WindowTitleBar } from 'rowkit'

// The window in use has the blue title bar; the others turn grey.
const active = ref('Inbox')
const names = ['Inbox', 'Calendar']
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <Window
      v-for="name in names"
      :key="name"
      :active="active === name"
      class="w-56"
      @pointerdown="active = name"
      @focusin="active = name"
    >
      <WindowTitleBar :title="name">
        <template #controls>
          <WindowButton glyph="close" :label="`Close ${name}`" />
        </template>
      </WindowTitleBar>
      <WindowBody class="h-20 p-2 text-ui">
        {{ active === name ? 'Active.' : 'Click to activate.' }}
      </WindowBody>
    </Window>
  </div>
</template>
