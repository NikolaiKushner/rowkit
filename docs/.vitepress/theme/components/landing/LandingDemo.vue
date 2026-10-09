<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, DataTable, EditIcon, FilterBar, Pagination, TrashIcon } from 'rowkit'
import type { HomeUser } from '../home-users'
import EditUserDialog from './EditUserDialog.vue'
import { columns, label, phoneColumns, tone, useLandingDemo } from './useLandingDemo'

/**
 * The live table in the hero: FilterBar, DataTable and Pagination on one
 * Users list — the same code «A data table page in twenty lines» shows. On a
 * phone, two columns and a page of five, as the 390 Figma frame draws it.
 *
 * Both layouts are in the markup and CSS shows one, so the server and the
 * first paint agree at every width.
 */
const demo = useLandingDemo()
const { search, sort, selected, page, pageSize, filtered, chips, pageRows } = demo

const editing = ref<HomeUser>()

function save(user: HomeUser): void {
  demo.update(user)
  editing.value = undefined
}

const phoneRows = computed(() => pageRows.value.slice(0, 5))
</script>

<template>
  <div
    class="isolate flex flex-col gap-3 bg-card p-4 text-left font-sans text-ui text-foreground modern:rounded-xl modern:border modern:border-border-subtle modern-dark:border-border modern:shadow-[0_24px_48px_-16px_rgb(0_0_0/0.18),0_2px_6px_rgb(0_0_0/0.06)] win98:shadow-window max-md:p-3"
  >
    <FilterBar
      v-model:search="search"
      label="User filters"
      search-placeholder="Search name or email…"
      :filters="chips"
      :result-count="filtered.length"
      class="max-md:hidden"
      @remove="demo.removeFilter"
      @clear="demo.clearFilters"
    >
      <template #summary="{ count }">{{ count }} users</template>
    </FilterBar>
    <FilterBar
      label="User filters"
      :searchable="false"
      :filters="chips"
      :result-count="filtered.length"
      class="md:hidden"
      @remove="demo.removeFilter"
      @clear="demo.clearFilters"
    >
      <template #summary="{ count }">{{ count }} users</template>
    </FilterBar>

    <DataTable
      v-model:sort="sort"
      v-model:selected="selected"
      :rows="pageRows"
      :columns="columns"
      caption="Users"
      caption-visible
      selectable="multiple"
      :row-label="(row) => row.name"
      class="h-[340px] max-md:hidden"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
      </template>
      <template #[`cell:actions`]="{ row }">
        <div class="flex">
          <Button
            variant="ghost"
            size="icon-xs"
            :aria-label="`Edit ${row.name}`"
            @click="editing = row"
          >
            <EditIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            :aria-label="`Delete ${row.name}`"
            @click="demo.remove(row.id)"
          >
            <TrashIcon />
          </Button>
        </div>
      </template>
    </DataTable>
    <DataTable
      v-model:sort="sort"
      :rows="phoneRows"
      :columns="phoneColumns"
      caption="Users"
      class="md:hidden"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
      </template>
    </DataTable>

    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="filtered.length"
      :page-size-options="[10, 25, 50]"
      label="Users pages"
      class="max-md:hidden"
    />
    <Pagination
      v-model:page="page"
      :page-size="pageSize"
      :total="filtered.length"
      compact
      hide-page-size
      label="Users pages"
      class="md:hidden"
    />

    <EditUserDialog :user="editing" @save="save" @close="editing = undefined" />
  </div>
</template>
