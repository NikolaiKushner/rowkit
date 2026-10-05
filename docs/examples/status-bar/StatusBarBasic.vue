<script setup lang="ts">
import { StatusBar, StatusBarSection } from 'rowkit'
</script>

<template>
  <!-- The first section takes the width the others leave; give the rest a width. -->
  <StatusBar>
    <StatusBarSection>Users 1–25 of 312</StatusBarSection>
    <StatusBarSection class="w-24">3 selected</StatusBarSection>
    <StatusBarSection class="w-24">Page 1 of 13</StatusBarSection>
  </StatusBar>
</template>
