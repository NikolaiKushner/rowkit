<script setup lang="ts">
import { ref } from 'vue'
import { Field, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

// Long lists: let people type. Worth it from about twenty options.
const timezones = [
  'Africa/Cairo',
  'Africa/Lagos',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Sao_Paulo',
  'America/Toronto',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/Kyiv',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Paris',
  'Europe/Warsaw',
  'Pacific/Auckland',
]

const timezone = ref('Europe/London')
</script>

<template>
  <Field label="Timezone" hint="Type to filter." class="w-60">
    <Select v-model="timezone" searchable>
      <SelectTrigger placeholder="Choose a timezone" />
      <SelectContent empty-text="No timezone matches.">
        <SelectItem v-for="zone in timezones" :key="zone" :value="zone" :label="zone" />
      </SelectContent>
    </Select>
  </Field>
</template>
