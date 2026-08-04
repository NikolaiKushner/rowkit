<script setup lang="ts">
import { Badge, Button, Field, Input, Select, type SelectOption } from 'rowkit'
import { computed, ref } from 'vue'

/**
 * Phase 2's acceptance criterion: a working form built only from rowkit
 * components. Deliberately a real one — validation, a pending state, and a
 * result — rather than a row of controls with nothing behind them.
 */

interface InviteForm {
  email: string
  name: string
  role: string | undefined
  team: string | undefined
}

const roles: SelectOption<string>[] = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Billing only', value: 'billing' },
  { label: 'Read-only (legacy)', value: 'legacy', disabled: true },
]

const teams: SelectOption<string>[] = [
  'Platform',
  'Growth',
  'Data',
  'Design',
  'Support',
  'Security',
  'Infrastructure',
  'Marketing',
  'Finance',
  'People',
  'Research',
  'Partnerships',
  'Docs',
  'Mobile',
  'Payments',
  'Search',
  'Identity',
  'Billing',
  'Trust & Safety',
  'Developer Relations',
  'Analytics',
  'Localisation',
].map((label) => ({ label, value: label.toLowerCase().replace(/[^a-z]+/g, '-') }))

const form = ref<InviteForm>({ email: '', name: '', role: undefined, team: undefined })

const submitting = ref(false)
const submitted = ref(false)
/** Errors only appear after a submit attempt — not while the user is still typing. */
const showErrors = ref(false)

const errors = computed(() => ({
  email: !form.value.email
    ? 'Enter an email address.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
      ? 'That does not look like an email address.'
      : undefined,
  role: form.value.role ? undefined : 'Choose a role for this person.',
}))

const isValid = computed(() => !errors.value.email && !errors.value.role)

const roleLabel = computed(() => roles.find((role) => role.value === form.value.role)?.label)

async function onSubmit() {
  showErrors.value = true
  if (!isValid.value) return

  submitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 900))
  submitting.value = false
  submitted.value = true
}

function reset() {
  form.value = { email: '', name: '', role: undefined, team: undefined }
  showErrors.value = false
  submitted.value = false
}
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col gap-6">
    <header>
      <h1 class="text-2xl font-semibold">Invite a teammate</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Built entirely from rowkit components, running inside Nuxt.
      </p>
    </header>

    <form
      class="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm"
      novalidate
      @submit.prevent="onSubmit"
    >
      <Field
        label="Work email"
        hint="They will receive the invitation here."
        required
        :error="showErrors ? errors.email : undefined"
      >
        <Input v-model="form.email" type="email" placeholder="ada@example.com" />
      </Field>

      <Field label="Full name" hint="Optional — shown in the members list.">
        <Input v-model="form.name" placeholder="Ada Lovelace" />
      </Field>

      <Field
        label="Role"
        hint="Controls what they can change."
        required
        :error="showErrors ? errors.role : undefined"
      >
        <Select v-model="form.role" :options="roles" placeholder="Choose a role" />
      </Field>

      <Field label="Team" hint="Long list, so this one searches.">
        <Select
          v-model="form.team"
          :options="teams"
          searchable
          placeholder="Choose a team"
          empty-text="No teams match"
        />
      </Field>

      <div class="flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
        <Button variant="ghost" type="button" @click="reset">Reset</Button>
        <Button type="submit" :loading="submitting" loading-label="Sending invitation">
          Send invitation
        </Button>
      </div>
    </form>

    <section
      v-if="submitted"
      class="flex flex-col gap-3 rounded-lg border border-success-border bg-success-subtle p-4"
      aria-live="polite"
    >
      <div class="flex items-center gap-2">
        <Badge variant="success" dot>Invited</Badge>
        <span class="text-sm font-medium text-success-on-subtle">Invitation sent</span>
      </div>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-foreground">
        <dt class="text-muted-foreground">Email</dt>
        <dd>{{ form.email }}</dd>
        <dt class="text-muted-foreground">Name</dt>
        <dd>{{ form.name || '—' }}</dd>
        <dt class="text-muted-foreground">Role</dt>
        <dd>{{ roleLabel }}</dd>
        <dt class="text-muted-foreground">Team</dt>
        <dd>{{ teams.find((team) => team.value === form.team)?.label ?? '—' }}</dd>
      </dl>
    </section>
  </div>
</template>
