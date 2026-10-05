<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { withBase } from 'vitepress'
import {
  Badge,
  Button,
  CopyIcon,
  DataTable,
  FilterBar,
  GroupBox,
  Pagination,
  ScrollArea,
  Separator,
  StatusBar,
  StatusBarSection,
  TrashIcon,
  version,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import SiteTaskbar from '../site/SiteTaskbar.vue'
import CommandPrompt from './CommandPrompt.vue'
import DesktopIcon from './DesktopIcon.vue'
import { shortcuts } from './shortcuts'
import { columns, label, tone, useHomeDemo } from './useHomeDemo'

/**
 * The home page as a Windows 98 desktop (Figma Site, template 1): shortcuts
 * down the left, a live demo window, About and a Command Prompt, and the
 * taskbar. Below 1280px it becomes one maximized «rowkit» window, as the
 * 390px template draws it.
 *
 * The windows' buttons do what they say: minimize and close put a window
 * away, and the task on the taskbar brings every window back.
 */
const demo = useHomeDemo()

const open = reactive({ demo: true, about: true, prompt: true })
const restore = () => Object.assign(open, { demo: true, about: true, prompt: true })

/*
 * The one task names the window on screen: the live demo on the desktop, the
 * maximized «rowkit» window below 1280px. The server renders the desktop's.
 */
const wide = ref(true)
let query: MediaQueryList | undefined
const onWidth = () => (wide.value = query?.matches ?? true)
onMounted(() => {
  query = window.matchMedia('(min-width: 1280px)')
  onWidth()
  query.addEventListener('change', onWidth)
})
onBeforeUnmount(() => query?.removeEventListener('change', onWidth))
const task = computed(() => (wide.value && open.demo ? 'Live demo — rowkit' : 'rowkit'))

const count = computed(() => demo.selected.value.length)
const compactColumns = columns.filter(
  (column) => 'key' in column && (column.key === 'name' || column.key === 'status')
)
const compactRows = computed(() => demo.pageRows.value.slice(0, 6))
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-desktop font-sans text-ui">
    <h1 class="sr-only">rowkit — a professional Vue 3 toolkit</h1>

    <!-- The desktop, at 1280px and up. -->
    <main class="relative min-h-0 flex-1 max-xl:hidden">
      <nav aria-label="Shortcuts" class="absolute top-4 left-4 flex flex-col gap-3">
        <DesktopIcon
          v-for="item in shortcuts"
          :key="item.label"
          :label="item.label"
          :href="item.href"
        >
          <component :is="item.icon" />
        </DesktopIcon>
      </nav>

      <Window
        v-show="open.demo"
        class="absolute top-6 right-[452px] left-32 h-[600px] max-w-[860px]"
      >
        <WindowTitleBar title="Live demo — DataTable, FilterBar, Pagination">
          <template #icon>
            <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
          </template>
          <template #controls>
            <WindowButton glyph="minimize" label="Minimize Live demo" @click="open.demo = false" />
            <WindowButton glyph="maximize" label="Maximize" disabled />
            <WindowButton glyph="close" label="Close Live demo" @click="open.demo = false" />
          </template>
        </WindowTitleBar>

        <div role="toolbar" aria-label="Users" class="flex items-center gap-1 p-0.5">
          <Button variant="ghost" :disabled="count === 0" @click="demo.exportSelected">
            <template #leading><CopyIcon /></template>
            Export {{ count }}
          </Button>
          <Button variant="ghost" :disabled="count === 0" @click="demo.remove(demo.selected.value)">
            <template #leading><TrashIcon /></template>
            Delete {{ count }}
          </Button>
          <Separator orientation="vertical" decorative class="mx-0.5 h-[27px]" />
          <FilterBar
            v-model:search="demo.search.value"
            label="User filters"
            search-placeholder="Search name or email…"
            :filters="demo.chips.value"
            :result-count="demo.filtered.value.length"
            class="min-w-0 flex-1"
            @remove="demo.removeFilter"
            @clear="demo.clearFilters"
          >
            <template #summary="{ count: users }">{{ users }} users</template>
          </FilterBar>
        </div>

        <WindowBody class="flex min-h-0 flex-col px-0.5">
          <DataTable
            v-model:sort="demo.sort.value"
            v-model:selected="demo.selected.value"
            :rows="demo.pageRows.value"
            :columns="columns"
            caption="Users"
            selectable="multiple"
            :row-label="(row) => row.name"
            class="min-h-0 flex-1"
          >
            <template #[`cell:status`]="{ row }">
              <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
            </template>
            <template #[`cell:actions`]="{ row }">
              <Button
                variant="ghost"
                size="icon-xs"
                :aria-label="`Delete ${row.name}`"
                @click="demo.remove([row.id])"
              >
                <TrashIcon />
              </Button>
            </template>
          </DataTable>
        </WindowBody>

        <StatusBar>
          <StatusBarSection>{{ demo.range.value }} · {{ count }} selected</StatusBarSection>
          <StatusBarSection class="w-auto py-0 pr-1">
            <Pagination
              v-model:page="demo.page.value"
              :page-size="demo.pageSize"
              :total="demo.filtered.value.length"
              size="sm"
              hide-page-size
              hide-summary
              label="Users pages"
            />
          </StatusBarSection>
        </StatusBar>
      </Window>

      <div class="absolute top-6 right-6 flex w-[400px] flex-col gap-12">
        <Window v-show="open.about">
          <WindowTitleBar title="About rowkit">
            <template #icon>
              <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
            </template>
            <template #controls>
              <WindowButton glyph="close" label="Close About rowkit" @click="open.about = false" />
            </template>
          </WindowTitleBar>
          <WindowBody class="flex items-start gap-4 p-4">
            <img :src="withBase('/mark-48.svg')" alt="" width="48" height="48" class="shrink-0" />
            <div class="flex flex-col gap-2">
              <img :src="withBase('/logo.svg')" alt="rowkit" width="160" height="32" />
              <p class="m-0 text-[15px] leading-[24px] text-foreground">
                A professional Vue 3 toolkit — the components a product interface is built from.
              </p>
              <p class="m-0 text-muted-foreground">Version {{ version }} on npm · MIT licence</p>
              <div class="flex gap-1.5">
                <Button as="a" :href="withBase('/installation')">Get started</Button>
                <Button as="a" :href="withBase('/components/button')" variant="secondary">
                  Components
                </Button>
              </div>
            </div>
          </WindowBody>
        </Window>

        <CommandPrompt v-show="open.prompt" closable @close="open.prompt = false" />
      </div>
    </main>

    <!-- One maximized window, below 1280px. -->
    <Window class="min-h-0 flex-1 xl:hidden">
      <WindowTitleBar title="rowkit">
        <template #icon>
          <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
        </template>
      </WindowTitleBar>
      <WindowBody class="flex min-h-0 flex-col">
        <ScrollArea label="rowkit" class="min-h-0 flex-auto">
          <main class="flex flex-col gap-4 p-3">
            <img :src="withBase('/logo.svg')" alt="rowkit" width="160" height="32" />
            <p class="m-0 text-[15px] leading-[24px] text-foreground">
              A professional Vue 3 toolkit — the components a product interface is built from.
            </p>
            <div class="flex gap-1.5">
              <Button as="a" :href="withBase('/installation')" size="lg">Get started</Button>
              <Button as="a" :href="withBase('/components/button')" variant="secondary" size="lg">
                Components
              </Button>
            </div>
            <CommandPrompt />
            <GroupBox as="section" legend="Live demo">
              <DataTable
                v-model:sort="demo.sort.value"
                v-model:selected="demo.selected.value"
                :rows="compactRows"
                :columns="compactColumns"
                caption="Users"
                selectable="multiple"
                :row-label="(row) => row.name"
              >
                <template #[`cell:status`]="{ row }">
                  <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
                </template>
              </DataTable>
            </GroupBox>
            <nav
              aria-label="Sections"
              class="grid grid-cols-3 justify-items-center gap-2 bg-desktop p-2"
            >
              <DesktopIcon
                v-for="item in shortcuts.slice(0, 6)"
                :key="item.label"
                :label="item.label"
                :href="item.href"
                class="w-24"
              >
                <component :is="item.icon" />
              </DesktopIcon>
            </nav>
          </main>
        </ScrollArea>
      </WindowBody>
    </Window>

    <SiteTaskbar :task="task" task-button @task="restore" />
  </div>
</template>
