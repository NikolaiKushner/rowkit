<script setup lang="ts">
import { ref } from 'vue'
import { GroupBox, Radio } from 'rowkit'

const align = ref('left')
const orientation = ref('portrait')
</script>

<template>
  <!-- Short choices sit side by side. -->
  <div class="flex flex-wrap gap-3">
    <GroupBox legend="Alignment">
      <div class="flex gap-3">
        <Radio v-model="align" name="align" value="left" label="Left" />
        <Radio v-model="align" name="align" value="center" label="Center" />
        <Radio v-model="align" name="align" value="right" label="Right" />
      </div>
    </GroupBox>
    <GroupBox legend="Orientation">
      <div class="flex gap-3">
        <Radio v-model="orientation" name="orientation" value="portrait" label="Portrait" />
        <Radio v-model="orientation" name="orientation" value="landscape" label="Landscape" />
      </div>
    </GroupBox>
  </div>
</template>
