<script setup lang="ts">
import { ref } from 'vue'
import { Button, CloseGlyphIcon, Field, Input, SearchIcon, UserIcon } from 'rowkit'

const query = ref('invoices')
const weight = ref(12)
const owner = ref('ada')
</script>

<template>
  <div class="flex flex-wrap items-end gap-3">
    <!-- An icon before the text, and a clear button after it while there is text. -->
    <Field label="Search" class="w-56">
      <Input v-model="query" type="text" placeholder="Search files">
        <template #leading><SearchIcon /></template>
        <template v-if="query" #trailing>
          <Button variant="ghost" size="icon-xs" aria-label="Clear search" @click="query = ''">
            <CloseGlyphIcon class="size-auto" />
          </Button>
        </template>
      </Input>
    </Field>

    <!-- A unit after the number. -->
    <Field label="Weight" class="w-32">
      <Input v-model="weight" type="number">
        <template #trailing><span class="text-text-subtle">kg</span></template>
      </Input>
    </Field>

    <Field label="Owner" class="w-44">
      <Input v-model="owner">
        <template #leading><UserIcon /></template>
      </Input>
    </Field>
  </div>
</template>
