<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'rowkit'

const remember = ref(true)
</script>

<template>
  <Checkbox v-model="remember" label="Remember me on this computer" />
</template>
