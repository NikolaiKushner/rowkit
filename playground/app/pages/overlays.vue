<script setup lang="ts">
import {
  Badge,
  Button,
  Dialog,
  Field,
  Input,
  Select,
  Toaster,
  Tooltip,
  useToast,
  type SelectOption,
} from 'rowkit'
import { ref } from 'vue'

/**
 * Phase 4's stacking scene: dialog, toast and tooltip on screen together.
 *
 * This is the z-index integration test. Each overlay is fine in isolation — the
 * ordering only fails when they overlap, and the combination that catches it is
 * a toast firing over an open dialog, a select opening inside that dialog, and a
 * tooltip on a button inside the toast.
 */

const { success, danger, warning, dismissAll } = useToast()

const dialogOpen = ref(false)
const confirmOpen = ref(false)
const projectName = ref('Platform')
const visibility = ref<string>()

const visibilityOptions: SelectOption<string>[] = [
  { label: 'Private', value: 'private' },
  { label: 'Team', value: 'team' },
  { label: 'Public', value: 'public' },
]

function save() {
  dialogOpen.value = false
  success(`Saved “${projectName.value}”`)
}

function deleteProject() {
  confirmOpen.value = false
  danger('Project deleted', {
    duration: 0,
    action: { label: 'Undo', onClick: () => success('Project restored') },
  })
}

/** The whole point of the page: fire a toast while the dialog is still open. */
function toastOverDialog() {
  warning('This toast is over an open dialog')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <header>
      <h1 class="text-2xl font-semibold">Overlays</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Dialog, Toast and Tooltip together — the stacking order only fails when they overlap.
      </p>
    </header>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        The stacking test
      </h2>
      <p class="max-w-2xl text-sm text-muted-foreground">
        Open the dialog, then fire a toast from inside it. The toast must sit
        <strong>above</strong> the dialog — a confirmation you cannot read is worse than none. The
        select inside the dialog must open above it too.
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Button @click="dialogOpen = true">Open dialog</Button>
        <Tooltip content="Fires without opening anything">
          <Button variant="secondary" @click="toastOverDialog">Toast on its own</Button>
        </Tooltip>
        <Button variant="ghost" @click="dismissAll">Clear toasts</Button>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">Tooltips</h2>
      <p class="max-w-2xl text-sm text-muted-foreground">
        Tab through these — every one opens on focus, not hover alone. The last is
        <code>aria-disabled</code> rather than <code>disabled</code>, which is why its tooltip works
        at all.
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Tooltip content="Archive this project" placement="top">
          <Button variant="secondary">Archive</Button>
        </Tooltip>
        <Tooltip content="Duplicate into a new project" placement="right">
          <Button variant="secondary">Duplicate</Button>
        </Tooltip>
        <Tooltip content="Export as CSV" placement="bottom">
          <Button variant="secondary">Export</Button>
        </Tooltip>
        <Tooltip content="Upgrade your plan to transfer projects" placement="left">
          <Button variant="secondary" aria-disabled="true">Transfer</Button>
        </Tooltip>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">Toast tones</h2>
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="secondary" @click="success('Project archived')">Success</Button>
        <Button variant="secondary" @click="warning('Two seats remaining')">Warning</Button>
        <Button variant="secondary" @click="confirmOpen = true">Delete, with undo</Button>
        <Badge variant="neutral">Three visible at a time</Badge>
      </div>
    </section>

    <!--
      A form dialog containing a Select. The listbox is a popover, which sits
      above the modal — a select trapped under its own dialog is the classic
      stacking bug this scene exists to catch.
    -->
    <Dialog
      v-model:open="dialogOpen"
      title="Project settings"
      description="Changes apply the moment you save."
      size="sm"
    >
      <div class="flex flex-col gap-4">
        <Field label="Project name" hint="Shown everywhere the project appears.">
          <Input v-model="projectName" />
        </Field>
        <Field label="Visibility" hint="Its listbox has to open above the dialog.">
          <Select v-model="visibility" :options="visibilityOptions" placeholder="Choose" />
        </Field>
        <Button variant="secondary" @click="toastOverDialog">Fire a toast from in here</Button>
      </div>
      <template #footer>
        <Button variant="ghost" @click="dialogOpen = false">Cancel</Button>
        <Tooltip content="Saves and closes">
          <Button @click="save">Save</Button>
        </Tooltip>
      </template>
    </Dialog>

    <!-- preventClose: dismissing by accident would lose the decision. -->
    <Dialog
      v-model:open="confirmOpen"
      title="Delete this project?"
      description="Everything in it goes too. You will get one chance to undo."
      size="sm"
      prevent-close
    >
      Escape and clicking outside do nothing here. The close button still works.
      <template #footer>
        <Button variant="ghost" @click="confirmOpen = false">Cancel</Button>
        <Button variant="danger" @click="deleteProject">Delete</Button>
      </template>
    </Dialog>

    <!--
      Client-only: the toast queue is module-level, and module state on a server
      is shared between requests.
    -->
    <ClientOnly>
      <Toaster />
    </ClientOnly>
  </div>
</template>
