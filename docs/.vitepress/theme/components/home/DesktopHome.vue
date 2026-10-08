<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { withBase } from 'vitepress'
import {
  Badge,
  Button,
  CopyIcon,
  EditIcon,
  PlusIcon,
  DataTable,
  FilterBar,
  GroupBox,
  Pagination,
  ScrollArea,
  Separator,
  StatusBar,
  StatusBarSection,
  TrashIcon,
  Input,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import SiteDock from '../site/SiteDock.vue'
import SiteTaskbar from '../site/SiteTaskbar.vue'
import SiteWallpaper from '../site/SiteWallpaper.vue'
import AboutWindow from './AboutWindow.vue'
import CommandPrompt from './CommandPrompt.vue'
import EditUserDialog from './EditUserDialog.vue'
import DesktopIcon from './DesktopIcon.vue'
import { shortcuts } from './shortcuts'
import type { HomeUser } from '../home-users'
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

// The row the pencil opened, in the Edit dialog; or a new one, from New user.
const editing = ref<HomeUser>()
const adding = ref(false)

function newUser(): void {
  adding.value = true
  editing.value = demo.blank()
}

function editSelected(): void {
  editing.value = demo.pageRows.value.find((row) => demo.selected.value.includes(row.id))
}

function save(user: HomeUser): void {
  if (adding.value) demo.add(user)
  else demo.update(user)
  closeEditor()
}

function closeEditor(): void {
  editing.value = undefined
  adding.value = false
}

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
// The phone's live demo (Figma Home, 390): name, status, role.
const phoneColumns = (['name', 'status', 'role'] as const).flatMap((key) =>
  columns.filter((column) => 'key' in column && column.key === key)
)
</script>

<template>
  <div
    class="rk-desktop relative isolate flex h-dvh flex-col overflow-hidden bg-desktop font-sans text-ui"
  >
    <SiteWallpaper />
    <h1 class="sr-only">rowkit — a professional Vue 3 toolkit</h1>

    <!-- The desktop, at 1280px and up. -->
    <!-- Isolated in modern, so a sticky table header stays under the menu bar's menus. -->
    <main class="relative min-h-0 flex-1 max-xl:hidden modern:isolate">
      <!-- Icons down the left in Windows 98; the Dock along the bottom in the modern theme. -->
      <nav aria-label="Shortcuts" class="absolute top-4 left-4 flex flex-col gap-3 modern:hidden">
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

        <div
          role="toolbar"
          aria-label="Users"
          class="flex items-center gap-1 p-0.5 modern:gap-2 modern:px-3 modern:py-2"
        >
          <!-- Windows 98: Export and Delete with the count. Modern: New user, Edit and Delete. -->
          <Button variant="ghost" class="win98:hidden" @click="newUser">
            <template #leading><PlusIcon /></template>
            New user
          </Button>
          <Button
            variant="ghost"
            :disabled="count === 0"
            class="win98:hidden"
            @click="editSelected"
          >
            <template #leading><EditIcon /></template>
            Edit
          </Button>
          <Button
            variant="ghost"
            :disabled="count === 0"
            class="modern:hidden"
            @click="demo.exportSelected"
          >
            <template #leading><CopyIcon /></template>
            Export {{ count }}
          </Button>
          <Button variant="ghost" :disabled="count === 0" @click="demo.remove(demo.selected.value)">
            <template #leading><TrashIcon /></template>
            Delete<span class="modern:hidden">&nbsp;{{ count }}</span>
          </Button>
          <Separator
            orientation="vertical"
            decorative
            class="mx-0.5 h-[33px] modern:mx-0 modern:h-[31px]"
          />
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

        <WindowBody class="flex min-h-0 flex-col px-0.5 modern:px-3 modern:pb-3">
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
            <!-- Modern: an address longer than its column ends in an ellipsis, so the actions fit. -->
            <template #[`cell:email`]="{ row }">
              <span class="modern:block modern:max-w-[154px] modern:truncate" :title="row.email">{{
                row.email
              }}</span>
            </template>
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
                  @click="demo.remove([row.id])"
                >
                  <TrashIcon />
                </Button>
              </div>
            </template>
          </DataTable>
        </WindowBody>

        <StatusBar>
          <StatusBarSection>{{ demo.range.value }} · {{ count }} selected</StatusBarSection>
          <StatusBarSection class="w-auto win98:hidden">
            Rows per page: {{ demo.pageSize }}
          </StatusBarSection>
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

      <SiteDock
        :running="open"
        class="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 win98:hidden"
        @open="(name) => (open[name] = true)"
      />

      <div class="absolute top-6 right-6 flex w-[400px] flex-col gap-12 modern:gap-6">
        <AboutWindow v-show="open.about" @close="open.about = false" />

        <CommandPrompt v-show="open.prompt" closable @close="open.prompt = false" />
      </div>
    </main>

    <!--
      Modern below 1280px (Figma Home, 390): the windows stacked, 12px in and
      14px apart, scrolling under the menu bar, with the Dock over the bottom.
    -->
    <div class="hidden min-h-0 flex-1 overflow-y-auto max-xl:modern:block">
      <div class="mx-auto flex w-full max-w-[560px] flex-col gap-3.5 px-3 pt-3 pb-24">
        <AboutWindow v-show="open.about" @close="open.about = false" />
        <CommandPrompt v-show="open.prompt" closable @close="open.prompt = false" />
        <Window v-show="open.demo">
          <WindowTitleBar title="Live demo">
            <template #controls>
              <WindowButton glyph="close" label="Close Live demo" @click="open.demo = false" />
            </template>
          </WindowTitleBar>
          <div role="toolbar" aria-label="Users" class="flex items-center gap-2 px-3 py-2">
            <Button variant="ghost" size="icon-lg" aria-label="New user" @click="newUser">
              <PlusIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Edit"
              :disabled="count === 0"
              @click="editSelected"
            >
              <EditIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Delete"
              :disabled="count === 0"
              @click="demo.remove(demo.selected.value)"
            >
              <TrashIcon />
            </Button>
            <Input
              v-model="demo.search.value"
              type="search"
              size="lg"
              aria-label="Search name or email"
              placeholder="Search name or email…"
              class="min-w-0 flex-1"
            />
          </div>
          <FilterBar
            label="User filters"
            :searchable="false"
            :filters="demo.chips.value"
            :result-count="demo.filtered.value.length"
            clear-label="Clear"
            class="px-1 pb-1"
            @remove="demo.removeFilter"
            @clear="demo.clearFilters"
          >
            <template #summary="{ count: users }">{{ users }} users</template>
          </FilterBar>
          <WindowBody class="flex min-h-0 flex-col">
            <DataTable
              v-model:sort="demo.sort.value"
              v-model:selected="demo.selected.value"
              :rows="compactRows"
              :columns="phoneColumns"
              caption="Users"
              selectable="multiple"
              :row-label="(row) => row.name"
            >
              <template #[`cell:status`]="{ row }">
                <Badge :variant="tone[row.status]" size="sm">{{ label[row.status] }}</Badge>
              </template>
            </DataTable>
          </WindowBody>
          <StatusBar>
            <StatusBarSection class="w-auto">
              <Pagination
                v-model:page="demo.page.value"
                :page-size="demo.pageSize"
                :total="demo.filtered.value.length"
                compact
                hide-page-size
                label="Users pages"
                class="w-full"
              />
            </StatusBarSection>
          </StatusBar>
        </Window>
      </div>
      <SiteDock
        :running="open"
        compact
        class="fixed bottom-4 left-1/2 z-10 -translate-x-1/2"
        @open="(name) => (open[name] = true)"
      />
    </div>

    <!-- One maximized window, below 1280px. -->
    <Window class="min-h-0 flex-1 xl:hidden modern:hidden">
      <WindowTitleBar title="rowkit">
        <template #icon>
          <img :src="withBase('/mark-16.svg')" alt="" width="16" height="16" />
        </template>
      </WindowTitleBar>
      <WindowBody class="flex min-h-0 flex-col">
        <ScrollArea label="rowkit" class="min-h-0 flex-auto">
          <main class="flex flex-col gap-4 p-3">
            <img :src="withBase('/logo.svg')" alt="rowkit" width="160" height="32" />
            <p class="m-0 text-doc text-foreground">
              A professional Vue 3 toolkit — the components a product interface is built from.
            </p>
            <div class="flex gap-1.5">
              <Button as="a" :href="withBase('/installation')" size="lg">Get started</Button>
              <Button as="a" :href="withBase('/components/')" variant="secondary" size="lg">
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

    <EditUserDialog :user="editing" :is-new="adding" @save="save" @close="closeEditor" />

    <SiteTaskbar :task="task" task-button @task="restore" />
  </div>
</template>
