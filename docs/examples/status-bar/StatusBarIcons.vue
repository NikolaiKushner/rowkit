<script setup lang="ts">
import { ref } from 'vue'
import { Button, HourglassIcon, StatusBar, StatusBarSection, SuccessIcon } from 'rowkit'

const saving = ref(false)

function save(): void {
  saving.value = true
  setTimeout(() => (saving.value = false), 1200)
}
</script>

<template>
  <div class="flex w-full max-w-[460px] flex-col gap-2">
    <Button class="self-start" :loading="saving" @click="save">Save</Button>
    <!-- A section holds an icon and text; aria-live reads the change out. -->
    <StatusBar>
      <StatusBarSection aria-live="polite">
        <template v-if="saving"><HourglassIcon /> Saving…</template>
        <template v-else><SuccessIcon /> All changes saved</template>
      </StatusBarSection>
      <StatusBarSection class="w-24">
        <a href="/components/status-bar" class="text-foreground">Help</a>
      </StatusBarSection>
    </StatusBar>
  </div>
</template>
