<script setup lang="ts">
import { ref } from 'vue'
import { Field, GroupBox, Input } from 'rowkit'

const user = ref({ name: 'Ada Lovelace', email: 'ada@example.com', title: 'Analyst' })
</script>

<template>
  <!--
    The Windows 98 property-sheet layout: labels beside the controls.
    --rk-field-label-width lines the labels up in one column.
  -->
  <GroupBox legend="User" class="max-w-96">
    <div class="flex flex-col gap-2 [--rk-field-label-width:4.5rem]">
      <Field layout="left" label="Name">
        <Input v-model="user.name" />
      </Field>
      <Field layout="left" label="Email" hint="Sign-in and notifications.">
        <Input v-model="user.email" type="email" />
      </Field>
      <Field layout="left" label="Job title">
        <Input v-model="user.title" />
      </Field>
    </div>
  </GroupBox>
</template>
