<script setup lang="ts">
import { ref } from 'vue'
import { Field, GroupBox, Input, Radio } from 'rowkit'

const schedule = ref('weekly')
const days = ref(10)
</script>

<template>
  <!-- A choice that needs more detail enables its own field. -->
  <GroupBox legend="Back up" class="w-72">
    <Radio v-model="schedule" name="schedule" value="daily" label="Every day" />
    <Radio v-model="schedule" name="schedule" value="weekly" label="Every week" />
    <Radio v-model="schedule" name="schedule" value="custom" label="Every few days" />
    <Field
      label="Days between backups"
      :disabled="schedule !== 'custom'"
      size="sm"
      class="mt-1 ml-5 w-44"
    >
      <Input v-model="days" type="number" />
    </Field>
  </GroupBox>
</template>
