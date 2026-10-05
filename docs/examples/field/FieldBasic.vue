<script setup lang="ts">
import { ref } from 'vue'
import { Field, Input } from 'rowkit'

const name = ref('')
</script>

<template>
  <!-- Field gives the label, the hint and the ids that tie them to the control. -->
  <Field label="Display name" hint="Shown to your team, next to your comments." class="max-w-80">
    <Input v-model="name" placeholder="Ada Lovelace" />
  </Field>
</template>
