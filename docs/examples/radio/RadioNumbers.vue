<script setup lang="ts">
import { ref } from 'vue'
import { GroupBox, Radio } from 'rowkit'

// Values do not have to be strings: the model stays a number.
const copies = ref(2)
</script>

<template>
  <div class="flex items-center gap-3">
    <GroupBox legend="Copies">
      <div class="flex gap-3">
        <Radio
          v-for="n in [1, 2, 3, 4]"
          :key="n"
          v-model="copies"
          name="copies"
          :value="n"
          :label="String(n)"
        />
      </div>
    </GroupBox>
    <span class="text-ui">{{ typeof copies }} {{ copies }}</span>
  </div>
</template>
