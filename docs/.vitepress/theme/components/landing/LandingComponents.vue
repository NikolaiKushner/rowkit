<script setup lang="ts">
import { withBase } from 'vitepress'
import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  FilterBar,
  Pagination,
  ProgressBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'rowkit'
import type { DataTableColumn } from 'rowkit'
import { homeUsers, type HomeUser } from '../home-users'
import SectionHeading from './SectionHeading.vue'
import { label, tone } from './useLandingDemo'

/**
 * «Everything a product interface is built from»: eight components, each a
 * small live preview in the site's theme, with what it is for, and a row of
 * what is planned next. On a phone, four of them.
 *
 * The previews are pictures, not controls: inert, so a card is one link and
 * one tab stop, to the component's page.
 */
/** `desktopOnly`: left out of the phone's four. */
const CARDS: { name: string; page: string; text: string; desktopOnly?: boolean }[] = [
  {
    name: 'Button',
    page: 'button',
    text: 'Actions, from the default one Enter takes to a quiet link.',
  },
  {
    name: 'Select',
    page: 'select',
    text: 'One value from a list, with search for long ones.',
    desktopOnly: true,
  },
  { name: 'Badge', page: 'badge', text: 'Status at a glance, in the colour and the word.' },
  {
    name: 'ProgressBar',
    page: 'progress-bar',
    text: 'Progress you can measure, and work you cannot.',
    desktopOnly: true,
  },
  {
    name: 'FilterBar',
    page: 'filter-bar',
    text: 'Search and the filters applied to a list.',
    desktopOnly: true,
  },
  { name: 'Pagination', page: 'pagination', text: 'Pages and page size for a long list.' },
  { name: 'Checkbox', page: 'checkbox', text: 'On or off, with a label you can click.' },
  {
    name: 'DataTable',
    page: 'data-table',
    text: 'Sort, select, load and empty — typed rows.',
    desktopOnly: true,
  },
]

const NEXT = [
  'DropdownMenu',
  'Popover',
  'Sheet',
  'Date picker',
  'Command palette',
  'Tabs',
  'Switch',
  'Combobox',
]

const miniColumns: DataTableColumn<HomeUser>[] = [
  { key: 'name', header: 'Name', width: '150px' },
  { key: 'email', header: 'Email', width: '200px' },
  { key: 'status', header: 'Status', width: '90px' },
]
const miniRows = homeUsers.slice(0, 7)
</script>

<template>
  <section aria-labelledby="lp-components" class="px-5 py-16 md:px-6 md:py-28">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-12">
      <SectionHeading
        id="lp-components"
        label="Components"
        title="Everything a product interface is built from"
      >
        21 components today — controls, data, overlays and the window around them. Each with
        keyboard support, a docs page and stories in both themes.
      </SectionHeading>

      <ul class="grid grid-cols-2 gap-3 md:gap-8 lg:grid-cols-4">
        <li
          v-for="card in CARDS"
          :key="card.name"
          class="relative flex flex-col overflow-hidden bg-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-(--lp-accent) modern:rounded-xl modern:border modern:border-border-subtle modern-dark:border-border modern:hover:border-border win98:shadow-window"
          :class="card.desktopOnly && 'max-md:hidden'"
        >
          <div
            inert
            aria-hidden="true"
            class="flex h-[110px] items-center justify-center overflow-hidden px-4 font-sans text-ui text-foreground md:h-[150px] modern:bg-background"
          >
            <Button v-if="card.name === 'Button'">Button</Button>
            <Select v-else-if="card.name === 'Select'" model-value="Administrator">
              <SelectTrigger class="w-[180px]" aria-label="Role" />
              <SelectContent>
                <SelectItem value="Administrator" label="Administrator" />
              </SelectContent>
            </Select>
            <Badge v-else-if="card.name === 'Badge'" variant="success">Badge</Badge>
            <ProgressBar
              v-else-if="card.name === 'ProgressBar'"
              :value="58"
              aria-label="Progress"
              class="w-[180px]"
            />
            <FilterBar
              v-else-if="card.name === 'FilterBar'"
              label="Filters"
              :searchable="false"
              :filters="[{ id: 'status', label: 'Status', value: 'Active' }]"
            />
            <Pagination
              v-else-if="card.name === 'Pagination'"
              :page="2"
              :page-size="10"
              :total="30"
              hide-page-size
              hide-summary
              size="sm"
              label="Pages"
            />
            <Checkbox v-else-if="card.name === 'Checkbox'" :model-value="true" label="Label" />
            <div v-else-if="card.name === 'DataTable'" class="h-[260px] w-[200%] shrink-0 scale-50">
              <DataTable
                :rows="miniRows"
                :columns="miniColumns"
                caption="Users"
                caption-visible
                selectable="multiple"
                :selected="[3, 5]"
              >
                <template #[`cell:status`]="{ row }">
                  <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
                </template>
              </DataTable>
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
            <h3 class="text-[16px] leading-6 font-semibold text-foreground win98:font-bold">
              <a
                :href="withBase(`/components/${card.page}`)"
                class="outline-none after:absolute after:inset-0"
                >{{ card.name }}</a
              >
            </h3>
            <p class="text-[14px] leading-5 text-muted-foreground">{{ card.text }}</p>
          </div>
        </li>
      </ul>

      <div class="flex flex-col gap-8 md:items-center">
        <Button as="a" :href="withBase('/components/')" variant="secondary" size="lg">
          See all 21 components
        </Button>
        <div class="flex flex-wrap items-center gap-2.5 md:justify-center">
          <span class="text-[14px] leading-5 font-semibold text-muted-foreground win98:font-bold">
            Coming next
          </span>
          <ul class="contents">
            <li
              v-for="name in NEXT"
              :key="name"
              class="px-3 py-1.5 text-[14px] leading-5 text-muted-foreground modern:rounded-full modern:border modern:border-border win98:shadow-raised"
            >
              {{ name }}
            </li>
          </ul>
          <a
            :href="withBase('/roadmap')"
            class="text-[14px] leading-5 font-semibold text-(--lp-link) hover:underline win98:underline"
            >Roadmap →</a
          >
        </div>
      </div>
    </div>
  </section>
</template>
