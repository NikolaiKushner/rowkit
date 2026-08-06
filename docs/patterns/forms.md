# Forms

`Field` owns the label, the hint, the error and the ARIA wiring between them.
Your application owns what is valid and when to say so. rowkit deliberately
ships no validation layer — that decision, and how to wire any validation
library to it, is what this page is about.

<script setup>
import { computed, reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', role: undefined, seats: '1' })
const touched = reactive({ name: false, email: false, role: false, seats: false })
const submitted = ref(false)
const saving = ref(false)
const saved = ref(false)

const roleOptions = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
]

const errors = computed(() => ({
  name: form.name.trim() ? undefined : 'Enter a name.',
  email: /^[^@\s]+@[^@\s.]+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.',
  role: form.role ? undefined : 'Choose a role.',
  seats: Number(form.seats) >= 1 ? undefined : 'At least one seat.',
}))

// An error is shown once the user has left the field, or once they have tried
// to submit — never while they are still typing into it for the first time.
const shown = computed(() =>
  Object.fromEntries(
    Object.entries(errors.value).map(([key, message]) => [
      key,
      touched[key] || submitted.value ? message : undefined,
    ])
  )
)

const isValid = computed(() => Object.values(errors.value).every((e) => e === undefined))

function submit() {
  submitted.value = true
  saved.value = false
  if (!isValid.value) return
  saving.value = true
  setTimeout(() => {
    saving.value = false
    saved.value = true
  }, 900)
}
</script>

<!-- prettier-ignore -->
<DemoBox layout="stack">
  <form class="flex w-full max-w-md flex-col gap-4" novalidate @submit.prevent="submit">
    <Field label="Full name" :error="shown.name" required><Input v-model="form.name" @blur="touched.name = true" /></Field>
    <Field label="Work email" hint="Used for the invitation and for billing receipts." :error="shown.email" required><Input v-model="form.email" type="email" placeholder="ada@example.com" @blur="touched.email = true" /></Field>
    <Field label="Role" hint="Determines what they can change." :error="shown.role" required><Select v-model="form.role" :options="roleOptions" placeholder="Choose a role" /></Field>
    <Field label="Seats" :error="shown.seats" required><Input v-model="form.seats" type="number" @blur="touched.seats = true" /></Field>
    <div class="flex items-center gap-3">
      <Button type="submit" :loading="saving">Send invitation</Button>
      <span v-if="saved" class="text-sm text-muted-foreground">Invitation sent.</span>
    </div>
  </form>
</DemoBox>

Press **Send invitation** with the form empty: every field reports at once and
focus stays where it is. Then fix one and watch its error go while its hint
stays.

## The code

```vue
<script setup lang="ts">
import { Button, Field, Input, Select } from 'rowkit'
import { computed, reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', role: undefined, seats: '1' })
const touched = reactive({ name: false, email: false, role: false, seats: false })
const submitted = ref(false)

const errors = computed(() => ({
  name: form.name.trim() ? undefined : 'Enter a name.',
  email: /^[^@\s]+@[^@\s.]+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.',
  role: form.role ? undefined : 'Choose a role.',
  seats: Number(form.seats) >= 1 ? undefined : 'At least one seat.',
}))

/** Shown after blur, or after a submit attempt — never mid-first-keystroke. */
const shown = computed(() =>
  Object.fromEntries(
    Object.entries(errors.value).map(([key, message]) => [
      key,
      touched[key] || submitted.value ? message : undefined,
    ])
  )
)
</script>

<template>
  <!-- `novalidate` because this form renders its own messages. -->
  <form novalidate @submit.prevent="submit">
    <Field label="Work email" hint="Used for billing receipts." :error="shown.email" required>
      <Input v-model="form.email" type="email" @blur="touched.email = true" />
    </Field>
  </form>
</template>
```

## Why it is wired this way

**The presence of `error` is the error state.** There is no separate `invalid`
flag to keep in sync, because two sources of truth for one condition is how a
field ends up outlined in red with no message, or apologising about a value that
is now fine. Set `error` to a string or to `undefined`; everything else follows.

**Validation timing is yours, and it is the part libraries get wrong.**
Validating on every keystroke tells someone their email is invalid after they
have typed one character, which is true and useless. The `touched`/`submitted`
split above is the smallest thing that behaves properly: nothing until you leave
the field, everything the moment you try to submit.

`Field` does not implement this because it cannot — it has no idea whether your
form submits per-field, on blur, or on a wizard step.

**The hint survives the error.** Both are referenced by `aria-describedby` at
once, so fixing a mistake never costs you the guidance that would have prevented
it. Fields that swap the hint out for the error remove the explanation exactly
when it is needed.

**State flows down from `Field`.** `disabled` and `required` on the `Field` reach
whatever control is inside it, and the generated `id` wires the label to it.
`Input` and `Select` both accept the same treatment, which is the whole reason
they are documented together.

**`novalidate` on the form, because you are rendering the messages.** Marking a
`Field` required marks the control required, which is correct for assistive
technology — and it also switches on the browser's own constraint validation.
Without `novalidate` the browser intercepts the submit, refuses to fire the
event, and shows its own bubble instead: a different message, in the browser's
language rather than your app's, unstyled and unpositionable.

The symptom is that submitting an empty form appears to do nothing at all,
because your handler is never reached. Keep `required` for the semantics, and
turn off the native UI.

**The submit button does not disable itself while invalid.** A disabled submit
gives no reason and cannot be focused to ask for one; a keyboard user reaches a
dead control and learns nothing. Let them submit, then show every error at once —
which is also what makes "press submit on an empty form" a useful thing to try.

While the request is in flight the button sets `aria-busy` rather than
`disabled`, so focus is not destroyed by the user's own action.

## With a validation library

Nothing above assumes the checks are hand-written. Any resolver that produces a
message per field drops straight in — `error` takes a string.

```ts
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Enter a name.'),
  email: z.string().email('Enter a valid email address.'),
  seats: z.coerce.number().min(1, 'At least one seat.'),
})

const errors = computed(() => {
  const result = schema.safeParse(form)
  if (result.success) return {}
  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
})
```

The same applies to VeeValidate, FormKit, or a server returning a
`{ field: message }` map from a 422. rowkit's job ends at rendering the state and
announcing it correctly.

## Accessibility notes

- The error is `role="alert"`, so it is announced when it appears rather than
  waiting for the user to arrive at the field.
- The required marker is decorative; the control also carries `required`, which
  is what assistive technology reads.
- A label is always rendered. `labelSrOnly` hides it visually — for a search box
  in a toolbar — and never from a screen reader.
- Server errors work identically: set `error` from the response. If several
  fields fail, move focus to the first one so a keyboard user is not left
  hunting.
