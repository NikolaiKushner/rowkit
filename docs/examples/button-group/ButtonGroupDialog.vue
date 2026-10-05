<script setup lang="ts">
import { ref } from 'vue'
import { Button, ButtonGroup } from 'rowkit'

const last = ref('')
</script>

<template>
  <!-- A dialog's command row: the default first, the rest after it. -->
  <div class="flex flex-col items-end gap-2">
    <ButtonGroup aria-label="Dialog" class="gap-1.5">
      <Button @click="last = 'OK'">OK</Button>
      <Button variant="secondary" @click="last = 'Cancel'">Cancel</Button>
      <Button variant="secondary" @click="last = 'Apply'">Apply</Button>
    </ButtonGroup>
    <span class="text-ui" role="status">{{ last ? `Pressed ${last}.` : '' }}</span>
  </div>
</template>
