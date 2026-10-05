<script setup lang="ts">
import { ref } from 'vue'
import { Button, GroupBox, Radio } from 'rowkit'

const size = ref<string>()
const sent = ref('')
</script>

<template>
  <!--
    No default choice: nothing is picked until the person picks. `required`
    on the group's radios makes the browser ask before submitting.
  -->
  <form class="flex flex-wrap items-end gap-3" @submit.prevent="sent = size ?? ''">
    <GroupBox legend="Size">
      <Radio v-model="size" name="size" value="s" label="Small" required />
      <Radio v-model="size" name="size" value="m" label="Medium" required />
      <Radio v-model="size" name="size" value="l" label="Large" required />
      <Radio v-model="size" name="size" value="xl" label="Extra large (sold out)" disabled />
    </GroupBox>
    <div class="flex flex-col gap-1">
      <Button type="submit">Add to basket</Button>
      <span v-if="sent" role="status" class="text-ui">Added size {{ sent.toUpperCase() }}.</span>
    </div>
  </form>
</template>
