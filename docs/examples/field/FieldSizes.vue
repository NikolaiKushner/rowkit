<script setup lang="ts">
import { Field, Input } from 'rowkit'
</script>

<template>
  <!-- The size on Field reaches the control inside and sets the gaps around it. -->
  <div class="flex flex-wrap items-end gap-3">
    <Field label="Small" size="sm" class="w-40">
      <Input placeholder="21px" />
    </Field>
    <Field label="Medium" class="w-40">
      <Input placeholder="23px" />
    </Field>
    <Field label="Large" size="lg" class="w-40">
      <Input placeholder="27px" />
    </Field>
  </div>
</template>
