<script setup lang="ts">
import { ref } from 'vue'
import { GroupBox, Radio } from 'rowkit'

const options = [
  { value: 'standard', title: 'Standard', detail: '3–5 working days', price: 'Free' },
  { value: 'express', title: 'Express', detail: 'Next working day', price: '€9.00' },
  { value: 'collect', title: 'Collect in store', detail: 'Ready in 2 hours', price: 'Free' },
]
const delivery = ref('standard')
</script>

<template>
  <!-- The default slot takes markup: a title, a line of detail, a price. -->
  <GroupBox legend="Delivery" class="max-w-80">
    <div class="flex flex-col gap-1">
      <Radio
        v-for="option in options"
        :key="option.value"
        v-model="delivery"
        name="delivery"
        :value="option.value"
      >
        <span class="flex w-60 justify-between gap-2">
          <span>
            <b>{{ option.title }}</b>
            <span class="text-text-subtle"> — {{ option.detail }}</span>
          </span>
          <span>{{ option.price }}</span>
        </span>
      </Radio>
    </div>
  </GroupBox>
</template>
