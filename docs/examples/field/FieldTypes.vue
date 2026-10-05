<script setup lang="ts">
import { ref } from 'vue'
import { Field, Input } from 'rowkit'

const form = ref({
  password: 'correct horse',
  seats: 5,
  start: '2026-10-05',
  phone: '',
  site: '',
})
</script>

<template>
  <div class="grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2">
    <Field label="Password">
      <Input v-model="form.password" type="password" />
    </Field>
    <!-- number gets Windows 98 spin buttons; ↑ ↓ step too. -->
    <Field label="Seats" hint="1 to 250.">
      <Input v-model="form.seats" type="number" />
    </Field>
    <!-- date gets a calendar button. -->
    <Field label="Start date">
      <Input v-model="form.start" type="date" />
    </Field>
    <Field label="Phone">
      <Input v-model="form.phone" type="tel" placeholder="+44 20 7946 0000" />
    </Field>
    <Field label="Website" class="sm:col-span-2">
      <Input v-model="form.site" type="url" placeholder="https://" />
    </Field>
  </div>
</template>
