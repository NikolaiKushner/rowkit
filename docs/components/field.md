# Field & Input

**Stage:** 🟢 Stable

`Field` owns the label, hint, error and the ARIA wiring between them. `Input`
is the text control. They are documented together because `Field` exists to
make `Input` — and `Select` — correct without the consumer doing the work.

```vue
<Field label="Work email" hint="Used for billing receipts." :error="errors.email" required>
  <Input v-model="email" type="email" placeholder="ada@example.com" />
</Field>
```

<script setup>
import { computed, ref } from 'vue'

const email = ref('ada@')
const error = computed(() => (/^[^@\s]+@[^@\s.]+\.\S+$/.test(email.value) ? undefined : 'Enter a valid email address.'))
</script>

<DemoBox layout="stack">
  <Field label="Work email" hint="Used for billing receipts." :error="error" required>
    <Input v-model="email" type="email" placeholder="ada@example.com" />
  </Field>
  <Field label="Team" hint="Everyone here inherits this team's permissions." disabled>
    <Input model-value="Platform" />
  </Field>
</DemoBox>

Type a valid address and the error goes; the hint stays throughout. Both are
referenced by `aria-describedby` at once, so fixing a mistake never costs you
the guidance that would have prevented it — which is what happens when a field
swaps the hint out for the error.

The second field is disabled at the `Field`, not the `Input`. The state flows
down to whatever control is inside.

## Anatomy

| Part    | Purpose                                                                     |
| ------- | --------------------------------------------------------------------------- |
| Label   | Always rendered. `labelSrOnly` hides it visually, never from screen readers |
| Control | Whatever you put in the default slot. Receives the generated id             |
| Hint    | Guidance shown while the value is valid — and kept while it is not          |
| Error   | Validation message. `role="alert"`, so it is announced when it appears      |

## When to use

- Every form control. A control without a label is a control nobody can use.
- Wrap `Select` with it too — the same id, description and state flow through.

## When not to use

- **As a layout wrapper.** `Field` provides context to one control. Two
  controls inside one `Field` share an id, and the label points at only one.
  For a date range or a split phone number, use two `Field`s, or a
  `<fieldset>` with a `<legend>`.
- **With a placeholder instead of a label.** The placeholder disappears when
  typing starts, is not announced reliably, and fails contrast on most
  palettes. `labelSrOnly` is the honest way to hide a label.
- **`Input` for checkboxes, radios or file uploads.** The `type` prop
  deliberately excludes them; they need different markup and different labels.
- **Errors that appear while typing.** Validate on submit or on blur. `Field`
  shows an error whenever `error` is set, so the timing is yours to get right.

## Props

### Field

| Prop          | Type                   | Default   | Description                                                |
| ------------- | ---------------------- | --------- | ---------------------------------------------------------- |
| `label`       | `string`               | —         | Visible label                                              |
| `hint`        | `string`               | —         | Help text below the control                                |
| `error`       | `string`               | —         | Validation message. Its presence _is_ the error state      |
| `required`    | `boolean`              | `false`   | Marks the control required and shows the indicator         |
| `disabled`    | `boolean`              | `false`   | Disables the control inside                                |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`    | Sizes label, hint and error together                       |
| `id`          | `string`               | generated | Supply one only if something outside needs to reference it |
| `labelSrOnly` | `boolean`              | `false`   | Hide the label visually, keep it for screen readers        |
| `class`       | `string`               | —         | Merged so your utility wins                                |

Slots: `default` (the control), `hint`, `error`.

### Input

| Prop          | Type                                                                                  | Default      | Description                                          |
| ------------- | ------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| `modelValue`  | `string \| number`                                                                    | —            | `v-model`                                            |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                | `'md'`       | Control height and text size                         |
| `type`        | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number' \| 'date'` | `'text'`     | Native input type                                    |
| `placeholder` | `string`                                                                              | —            | An example value, never a label                      |
| `disabled`    | `boolean`                                                                             | `false`      | Disable. A disabled `Field` also disables it         |
| `invalid`     | `boolean`                                                                             | `false`      | Mark invalid. A `Field` with an `error` also sets it |
| `required`    | `boolean`                                                                             | `false`      | Mark required. A required `Field` also sets it       |
| `readonly`    | `boolean`                                                                             | `false`      | Read-only but focusable and selectable               |
| `id`          | `string`                                                                              | from `Field` | Input id                                             |
| `class`       | `string`                                                                              | —            | Merged so your utility wins                          |

Slots: `leading`, `trailing` — rendered inside the control's border.

Unrecognised attributes (`autocomplete`, `name`, `inputmode`, …) land on the
`<input>` itself, not on the positioning wrapper.

### How state combines

A control's own prop and the surrounding `Field` combine with **OR**. A `Field`
can turn `disabled`, `invalid` or `required` on; a control inside cannot turn
them back off. This mirrors `<fieldset disabled>`, where a descendant has no
way to re-enable itself.

## Keyboard

| Key            | Behaviour                         |
| -------------- | --------------------------------- |
| <kbd>Tab</kbd> | Moves focus to the input          |
| Text keys      | Edit the value, unless `readonly` |

Clicking the label focuses the control, because the label's `for` points at the
control's generated id.

## Accessibility

- `aria-describedby` lists the hint first, then the error, so guidance is read
  before the correction. The hint does not disappear because the value is
  currently wrong.
- The error is `role="alert"`: a message that appears after a submit attempt is
  announced without the user going looking for it.
- The required asterisk is `aria-hidden`. `required` is already on the control;
  announcing it twice per field is noise, and an asterisk alone has never been
  a reliable signal — say it in the hint if it matters.
- Ids are generated with Vue's `useId()`, so they are stable across SSR and
  hydration.
