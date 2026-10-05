<script setup lang="ts">
import { ref } from 'vue'
import { Field, GroupBox, Input } from 'rowkit'

const street = ref('12 Analytical Row')
const city = ref('London')
</script>

<template>
  <!-- A fieldset by default: the legend names the controls inside for a screen reader. -->
  <GroupBox legend="Shipping address" class="w-full max-w-80 [--rk-field-label-width:3.5rem]">
    <Field layout="left" label="Street"><Input v-model="street" /></Field>
    <Field layout="left" label="City"><Input v-model="city" /></Field>
  </GroupBox>
</template>
