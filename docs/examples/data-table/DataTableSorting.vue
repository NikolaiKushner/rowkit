<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, useClientSort, type DataTableColumn, type DataTableSort } from 'rowkit'

interface Release {
  id: number
  version: string
  status: 'draft' | 'beta' | 'stable'
  downloads: number
  published: string
}

const columns: DataTableColumn<Release>[] = [
  { key: 'version', header: 'Version', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    // Sort by meaning, not by the alphabet: stable, then beta, then draft.
    sortValue: (row) => ({ stable: 0, beta: 1, draft: 2 })[row.status],
  },
  { key: 'downloads', header: 'Downloads', sortable: true, numeric: true },
  { key: 'published', header: 'Published', sortable: true },
]

const releases: Release[] = [
  { id: 1, version: '2.0.0', status: 'stable', downloads: 18240, published: '2026-09-30' },
  { id: 2, version: '2.1.0-beta.1', status: 'beta', downloads: 640, published: '2026-10-02' },
  { id: 3, version: '1.4.2', status: 'stable', downloads: 52031, published: '2026-06-11' },
  { id: 4, version: '2.2.0', status: 'draft', downloads: 0, published: '2026-10-05' },
]

// The table reports the sort; the page applies it. Start newest first.
const sort = ref<DataTableSort<Release>>({ key: 'published', direction: 'desc' })
const sorted = useClientSort(releases, sort, columns)
</script>

<template>
  <DataTable v-model:sort="sort" :rows="sorted" :columns="columns" caption="Releases" />
</template>
