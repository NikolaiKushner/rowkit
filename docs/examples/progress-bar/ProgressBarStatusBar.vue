<script setup lang="ts">
import { ProgressBar, StatusBar, StatusBarSection } from 'rowkit'
</script>

<template>
  <!-- In a window's status bar, beside what it is doing. -->
  <StatusBar class="w-full max-w-[460px]">
    <StatusBarSection>Downloading updates…</StatusBarSection>
    <StatusBarSection class="w-36 px-0.5">
      <ProgressBar :value="70" aria-label="Downloading updates" class="h-[14px] w-full" />
    </StatusBarSection>
  </StatusBar>
</template>
