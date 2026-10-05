<script setup lang="ts">
import { Field, Input } from 'rowkit'
</script>

<template>
  <div class="grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2">
    <!-- Disabled on the Field: the label greys too, and the state reaches the control. -->
    <Field label="Team" hint="Set by your administrator." disabled>
      <Input model-value="Platform" />
    </Field>
    <!-- Read-only: it can be selected and copied, not changed. -->
    <Field label="Account ID" hint="Quote this when you contact support.">
      <Input model-value="acc_7Q2K9X" readonly />
    </Field>
    <Field label="Coupon" error="This coupon expired on 30 September.">
      <Input model-value="AUTUMN25" />
    </Field>
    <Field label="Company" required hint="Required fields are marked with an asterisk.">
      <Input placeholder="Lovelace Ltd" />
    </Field>
  </div>
</template>
