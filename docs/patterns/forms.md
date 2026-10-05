# Forms

`Field` owns the label, the hint, the error and the ARIA wiring between them.
Your application owns what is valid and when to say so. rowkit deliberately
ships no validation layer — that decision, and how to wire any validation
library to it, is what this page is about.

<script setup>
import PatternInviteForm from '../examples/patterns/PatternInviteForm.vue'
import PatternSettingsForm from '../examples/patterns/PatternSettingsForm.vue'
import PatternAsyncValidation from '../examples/patterns/PatternAsyncValidation.vue'
import PatternServerErrors from '../examples/patterns/PatternServerErrors.vue'
</script>

<DemoBox layout="stack">
  <PatternInviteForm />
</DemoBox>

Press **Send invitation** with the form empty: every field reports at once and
focus stays where it is. Then fix one and watch its error go while its hint
stays.

## The code

<<< @/examples/patterns/PatternInviteForm.vue

## Why it is wired this way

**The presence of `error` is the error state.** There is no separate `invalid`
flag to keep in sync, because two sources of truth for one condition is how a
field ends up showing the error mark with no message, or apologising about a value that
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

## Editing what already exists

A settings form starts full. Save and Revert matter only once something has
changed, and the bar says «Unsaved changes» so nobody walks away believing a
change is stored. Disabling Save here is fine — there is nothing to save, and
the status line says why.

<DemoBox layout="stack">
  <PatternSettingsForm />
</DemoBox>

<<< @/examples/patterns/PatternSettingsForm.vue

## Checking with the server as they type

Some rules only the server knows — whether a name is taken. Check the format
locally and at once; ask the server only for a well-formed value, after a
pause, and drop an answer that arrives after the value changed. The hint says
«Checking…» meanwhile, and the answer lands in the hint or the error.

<DemoBox layout="stack">
  <PatternAsyncValidation />
</DemoBox>

<<< @/examples/patterns/PatternAsyncValidation.vue

## Errors from the server

A 422 with a message per field goes straight onto the fields — `error` takes
any string. Clear a field's error as the person edits it, and move focus to the
first field that failed so a keyboard user is not left hunting.

<DemoBox layout="stack">
  <PatternServerErrors />
</DemoBox>

<<< @/examples/patterns/PatternServerErrors.vue

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
