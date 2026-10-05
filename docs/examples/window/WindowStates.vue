<script setup lang="ts">
import { ref } from 'vue'
import { Button, Window, WindowBody, WindowButton, WindowTitleBar } from 'rowkit'

const state = ref<'normal' | 'maximized' | 'minimized'>('normal')
</script>

<template>
  <!--
    The caption buttons do what they say. Maximized, the middle one becomes
    Restore; minimized, the window leaves a button behind to bring it back.
  -->
  <div class="flex h-44 w-full flex-col items-start bg-desktop p-2">
    <Window v-if="state !== 'minimized'" :class="state === 'maximized' ? 'h-full w-full' : 'w-60'">
      <WindowTitleBar title="Notepad">
        <template #controls>
          <WindowButton glyph="minimize" label="Minimize" @click="state = 'minimized'" />
          <WindowButton
            :glyph="state === 'maximized' ? 'restore' : 'maximize'"
            :label="state === 'maximized' ? 'Restore' : 'Maximize'"
            @click="state = state === 'maximized' ? 'normal' : 'maximized'"
          />
          <WindowButton glyph="close" label="Close" disabled />
        </template>
      </WindowTitleBar>
      <WindowBody class="min-h-16 bg-input p-1 font-mono text-[16px] leading-4 shadow-sunken">
        Shopping: milk, floppy disks.
      </WindowBody>
    </Window>
    <Button v-else class="mt-auto" @click="state = 'normal'">Notepad</Button>
  </div>
</template>
