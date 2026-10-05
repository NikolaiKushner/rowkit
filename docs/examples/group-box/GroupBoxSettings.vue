<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, GroupBox, Radio } from 'rowkit'

const theme = ref('windows')
const sounds = ref(true)
const animate = ref(false)
</script>

<template>
  <!-- A settings page in groups, side by side, as Windows 98 Display Properties lays them out. -->
  <div class="flex flex-wrap items-start gap-3">
    <GroupBox legend="Scheme" class="w-44">
      <Radio v-model="theme" name="scheme" value="windows" label="Windows Standard" />
      <Radio v-model="theme" name="scheme" value="high" label="High Contrast" />
      <Radio v-model="theme" name="scheme" value="desert" label="Desert" />
    </GroupBox>
    <GroupBox legend="Effects" class="w-44">
      <Checkbox v-model="sounds" label="Play sounds" />
      <Checkbox v-model="animate" label="Animate windows" />
    </GroupBox>
  </div>
</template>
