<script setup lang="ts">
import { ref } from 'vue'
import { Button, Info32Icon, Window, WindowBody, WindowButton, WindowTitleBar } from 'rowkit'

const open = ref(true)
</script>

<template>
  <Window v-if="open" class="w-80">
    <WindowTitleBar title="About Ledger">
      <template #controls>
        <WindowButton glyph="close" label="Close About Ledger" @click="open = false" />
      </template>
    </WindowTitleBar>
    <WindowBody class="flex items-start gap-3 p-3">
      <Info32Icon class="shrink-0" />
      <p class="m-0 text-ui">
        Ledger 4.2. A window is part of the page, not modal — for that, use Dialog.
      </p>
    </WindowBody>
  </Window>
  <Button v-else variant="secondary" @click="open = true">Open About</Button>
</template>
