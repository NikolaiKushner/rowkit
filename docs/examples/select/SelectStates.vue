<script setup lang="ts">
import { computed, ref } from 'vue'
import { Field, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

const plan = ref('team')
const region = ref<string>()
const regionError = computed(() =>
  region.value === undefined ? 'Choose where your data is stored.' : undefined
)
</script>

<template>
  <div class="flex flex-wrap items-start gap-3">
    <!-- An option can be unavailable without leaving the list. -->
    <Field label="Plan" hint="Enterprise needs a contract." class="w-52">
      <Select v-model="plan">
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="free" label="Free" />
          <SelectItem value="team" label="Team" />
          <SelectItem value="enterprise" label="Enterprise" disabled />
        </SelectContent>
      </Select>
    </Field>

    <!-- Required, with an error from the Field. -->
    <Field label="Data region" :error="regionError" required class="w-52">
      <Select v-model="region">
        <SelectTrigger placeholder="Choose a region" />
        <SelectContent>
          <SelectItem value="eu" label="European Union" />
          <SelectItem value="us" label="United States" />
        </SelectContent>
      </Select>
    </Field>

    <!-- Disabled on the Field, like any other control. -->
    <Field label="Currency" hint="Fixed by your region." disabled class="w-40">
      <Select model-value="eur">
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="eur" label="Euro (€)" />
        </SelectContent>
      </Select>
    </Field>
  </div>
</template>
