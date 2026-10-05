<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { DataTable, DocumentIcon, type DataTableColumn } from 'rowkit'
import { folder } from './site/menu'
import { useSiteNav } from './site/useSiteNav'
import type { ComponentSummary } from '../data/components.data'

/**
 * The Components folder as Explorer's «Details» view: a list per subfolder,
 * name and description, every name a link. Built from the docs tree, so a
 * page added to the sidebar appears here without anyone remembering to.
 */
const props = defineProps<{
  /** Each component page's opening paragraph, from `components.data.ts`. */
  summaries: ComponentSummary[]
}>()

interface Row {
  id: string
  name: string
  href: string
  description: string
}

const { tree } = useSiteNav()

const groups = computed(() =>
  (folder(tree.value, 'Components')?.children ?? []).map((group) => ({
    name: group.text,
    rows: group.children.flatMap<Row>((page) =>
      page.link === undefined
        ? []
        : [
            {
              id: page.id,
              name: page.text,
              href: withBase(page.link),
              description:
                props.summaries.find((summary) => summary.url === page.link)?.description ?? '',
            },
          ]
    ),
  }))
)

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', width: '10rem' },
  { key: 'description', header: 'Description' },
]
</script>

<template>
  <section v-for="group in groups" :key="group.name" class="rk-demo mt-6 flex flex-col gap-2">
    <h2 :id="group.name.toLowerCase()" class="m-0 text-doc-h2 font-bold">
      {{ group.name }}
    </h2>
    <DataTable :rows="group.rows" :columns="columns" :caption="`${group.name} components`">
      <template #[`cell:name`]="{ row }">
        <a :href="row.href" class="flex items-center gap-1 text-link underline">
          <DocumentIcon class="shrink-0" />
          {{ row.name }}
        </a>
      </template>
    </DataTable>
  </section>
</template>
