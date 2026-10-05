<script setup lang="ts">
import { Button } from 'rowkit'
</script>

<template>
  <!-- `block` fills the width: a narrow panel, a phone layout. -->
  <div class="flex w-full max-w-64 flex-col gap-1.5">
    <Button block size="lg">Sign in</Button>
    <Button block size="lg" variant="secondary">Create an account</Button>
  </div>
</template>
