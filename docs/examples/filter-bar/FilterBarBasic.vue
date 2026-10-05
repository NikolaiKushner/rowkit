<script setup lang="ts">
import { computed, ref } from 'vue'
import { FilterBar, type FilterChip } from 'rowkit'

const people = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']
const search = ref('')

// A chip for every filter that is on.
const chips = computed<FilterChip[]>(() =>
  search.value ? [{ id: 'search', label: 'Search', value: search.value }] : []
)
const results = computed(() =>
  people.filter((name) => name.toLowerCase().includes(search.value.trim().toLowerCase()))
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <FilterBar
      v-model:search="search"
      :filters="chips"
      :result-count="results.length"
      label="People filters"
      search-placeholder="Search people"
      @remove="search = ''"
      @clear="search = ''"
    />
    <ul class="m-0 list-none p-0 text-ui">
      <li v-for="name in results" :key="name">{{ name }}</li>
    </ul>
  </div>
</template>
