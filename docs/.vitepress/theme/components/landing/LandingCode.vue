<script setup lang="ts">
import { withBase } from 'vitepress'
import CodeBlock from './CodeBlock.vue'
import SectionHeading from './SectionHeading.vue'

/** «A data table page in twenty lines»: the hero's table, as code. */
// Spelt in two: the tag written whole would end this block for the SFC parser.
const END_SCRIPT = '</' + 'script>'
const SAMPLE = `<script setup lang="ts">
import { DataTable, FilterBar, Pagination } from 'rowkit'
import { columns, useUsers } from './users'

const { rows, total, filters, search, sort, selected, page } = useUsers()
${END_SCRIPT}

<template>
  <FilterBar v-model:search="search" :filters="filters" />
  <DataTable
    v-model:sort="sort"
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    caption="Users"
    selectable="multiple"
  />
  <Pagination v-model:page="page" :total="total" />
</template>`

const POINTS = [
  'Sort, selection, page and filters are v-model',
  'Loading and empty states built in',
  'Pinned columns, a summary row, drawn scroll bars',
]
</script>

<template>
  <section aria-labelledby="lp-code" class="px-5 py-16 md:px-6 md:py-28">
    <div
      class="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-16"
    >
      <div class="flex flex-col gap-5">
        <SectionHeading
          id="lp-code"
          label="In code"
          title="A data table page in twenty lines"
          align="start"
        >
          The table at the top of this page is this code. Your rows are typed, state is yours
          through v-model, and every part takes your classes.
        </SectionHeading>
        <ul class="flex flex-col gap-3">
          <li
            v-for="point in POINTS"
            :key="point"
            class="flex items-start gap-3 text-[16px] leading-6 text-foreground"
          >
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              class="mt-1 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8.5l3.25 3.25L13 5" />
            </svg>
            {{ point }}
          </li>
        </ul>
        <a
          :href="withBase('/patterns/data-table-page')"
          class="self-start text-[16px] leading-6 font-semibold text-(--lp-link) hover:underline win98:underline"
          >Read the pattern →</a
        >
      </div>
      <CodeBlock :code="SAMPLE" label="A data table page" class="min-w-0" />
    </div>
  </section>
</template>
