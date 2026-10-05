<script setup lang="ts">
import { Button, useToast } from 'rowkit'

// <Toaster /> is mounted once at the app root; any component can call useToast().
const { success } = useToast()
</script>

<template>
  <Button variant="secondary" @click="success('Project archived')">Archive project</Button>
</template>
