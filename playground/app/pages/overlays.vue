<script setup lang="ts">
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline" @click="toastOverDialog">Toast on its own</Button>
          </TooltipTrigger>
          <TooltipContent>Fires without opening anything</TooltipContent>
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
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline">Archive</Button>
          </TooltipTrigger>
          <TooltipContent placement="top">Archive this project</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline">Duplicate</Button>
          </TooltipTrigger>
          <TooltipContent placement="right">Duplicate into a new project</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline">Export</Button>
          </TooltipTrigger>
          <TooltipContent placement="bottom">Export as CSV</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline" aria-disabled="true">Transfer</Button>
          </TooltipTrigger>
          <TooltipContent placement="left">Upgrade your plan to transfer projects</TooltipContent>
        </Tooltip>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">Toast tones</h2>
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" @click="success('Project archived')">Success</Button>
        <Button variant="outline" @click="warning('Two seats remaining')">Warning</Button>
        <Button variant="outline" @click="confirmOpen = true">Delete, with undo</Button>
        <Badge variant="neutral">Three visible at a time</Badge>
      </div>
    </section>

    <!--
      A form dialog containing a Select. The listbox is a popover, which sits
      above the modal — a select trapped under its own dialog is the classic
      stacking bug this scene exists to catch.
    -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>
          <DialogDescription>Changes apply the moment you save.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div class="flex flex-col gap-4">
            <Field label="Project name" hint="Shown everywhere the project appears.">
              <Input v-model="projectName" />
            </Field>
            <Field label="Visibility" hint="Its listbox has to open above the dialog.">
              <Select v-model="visibility">
                <SelectTrigger placeholder="Choose" />
                <SelectContent>
                  <SelectItem
                    v-for="option in visibilityOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  />
                </SelectContent>
              </Select>
            </Field>
            <Button variant="outline" @click="toastOverDialog">Fire a toast from in here</Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" @click="dialogOpen = false">Cancel</Button>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button @click="save">Save</Button>
            </TooltipTrigger>
            <TooltipContent>Saves and closes</TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- preventClose: dismissing by accident would lose the decision. -->
    <Dialog v-model:open="confirmOpen">
      <DialogContent size="sm" prevent-close>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription
            >Everything in it goes too. You will get one chance to undo.</DialogDescription
          >
        </DialogHeader>
        <DialogBody
          >Escape and clicking outside do nothing here. The close button still works.</DialogBody
        >
        <DialogFooter>
          <Button variant="ghost" @click="confirmOpen = false">Cancel</Button>
          <Button variant="destructive" @click="deleteProject">Delete</Button>
        </DialogFooter>
      </DialogContent>
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
