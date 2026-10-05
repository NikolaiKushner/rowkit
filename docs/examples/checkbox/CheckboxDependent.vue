<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, GroupBox } from 'rowkit'

const email = ref(true)
const digest = ref(false)
const mentions = ref(true)
</script>

<template>
  <!-- An option that only means something when another is on is disabled, not hidden. -->
  <GroupBox legend="Notifications" class="w-72">
    <Checkbox v-model="email" label="Send me email" />
    <div class="flex flex-col gap-2 pl-5">
      <Checkbox v-model="digest" :disabled="!email" label="As one daily digest" />
      <Checkbox v-model="mentions" :disabled="!email" label="When someone mentions me" />
    </div>
  </GroupBox>
</template>
