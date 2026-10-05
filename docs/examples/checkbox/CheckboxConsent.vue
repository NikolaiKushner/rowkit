<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox } from 'rowkit'

const agreed = ref(false)
const done = ref(false)
</script>

<template>
  <form class="flex max-w-80 flex-col gap-3" @submit.prevent="done = true">
    <!-- The default slot takes markup: a link inside the label. -->
    <Checkbox v-model="agreed" required>
      I have read the
      <a href="/contributing" target="_blank" class="text-link underline">terms of service</a>
    </Checkbox>
    <div class="flex items-center gap-2">
      <Button type="submit" :disabled="!agreed">Continue</Button>
      <span v-if="done" role="status" class="text-ui">Thanks — you are in.</span>
    </div>
  </form>
</template>
