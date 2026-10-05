<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Field, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

const cities: Record<string, string[]> = {
  'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
  Germany: ['Berlin', 'Hamburg', 'Munich'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto'],
}

const country = ref<string>()
const city = ref<string>()
const options = computed(() => (country.value ? (cities[country.value] ?? []) : []))

// A new country empties the city, which may not exist there.
watch(country, () => (city.value = undefined))
</script>

<template>
  <div class="flex flex-wrap items-start gap-3">
    <Field label="Country" class="w-48">
      <Select v-model="country">
        <SelectTrigger placeholder="Choose a country" />
        <SelectContent>
          <SelectItem v-for="name in Object.keys(cities)" :key="name" :value="name" :label="name" />
        </SelectContent>
      </Select>
    </Field>
    <Field
      label="City"
      :hint="country ? undefined : 'Choose a country first.'"
      :disabled="!country"
      class="w-48"
    >
      <Select v-model="city">
        <SelectTrigger placeholder="Choose a city" />
        <SelectContent>
          <SelectItem v-for="name in options" :key="name" :value="name" :label="name" />
        </SelectContent>
      </Select>
    </Field>
  </div>
</template>
