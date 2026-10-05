<script setup lang="ts">
import { ref } from 'vue'
import { GroupBox, Radio } from 'rowkit'

const plan = ref<'free' | 'team' | 'business'>('team')
</script>

<template>
  <!-- One name per group: the arrow keys move the choice, and only one can be on. -->
  <GroupBox legend="Plan" class="w-48">
    <Radio v-model="plan" name="plan" value="free" label="Free" />
    <Radio v-model="plan" name="plan" value="team" label="Team" />
    <Radio v-model="plan" name="plan" value="business" label="Business" />
  </GroupBox>
</template>
