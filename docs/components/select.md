# Select

**Stage:** 🟢 Stable

A single-value picker, optionally searchable, built on Reka UI's Combobox
primitives. Generic over the value type, so `v-model` narrows to the values you
actually passed.

```vue
<Select v-model="role" :options="roles" placeholder="Choose a role" />
```

```ts
const roles: SelectOption<'owner' | 'admin'>[] = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
]
// role is 'owner' | 'admin' | undefined
```

<script setup>
import { ref } from 'vue'

const role = ref()
const timezone = ref()

const roles = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Billing', value: 'billing', disabled: true },
]

const timezones = [
  'Europe/London', 'Europe/Berlin', 'Europe/Kyiv', 'America/New_York',
  'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney',
].map((value) => ({ label: value, value }))
</script>

<DemoBox align="end">
  <Field label="Role" class="min-w-52">
    <Select v-model="role" :options="roles" placeholder="Choose a role" />
  </Field>
  <Field label="Timezone" class="min-w-52">
    <Select v-model="timezone" :options="timezones" placeholder="Choose a timezone" searchable />
  </Field>
</DemoBox>

The first is a plain picker; the second is `searchable`, which is worth turning
on somewhere around twenty options and costs a keystroke below that. Both are
wrapped in `Field`, so the label, the generated id and the disabled state come
from one place.

Open either with the keyboard: <kbd>Enter</kbd> or <kbd>↓</kbd> opens the panel,
typing filters when searchable, <kbd>Esc</kbd> closes without committing.

## Anatomy

| Part    | Purpose                                                     |
| ------- | ----------------------------------------------------------- |
| Control | An `<input role="combobox">`. Read-only unless `searchable` |
| Chevron | Opens and closes the panel. Labelled `togglerLabel`         |
| Panel   | Portalled listbox, width-matched to the control             |
| Option  | `role="option"`, with a check indicator in reserved space   |

## When to use

- Choosing one value from a known list.
- `searchable` once the list passes roughly twenty options.
- `manualFilter` plus `searchTerm` when options come from a server.

## When not to use

- **Fewer than about four options with no room for growth.** Radio buttons show
  every choice at once and cost one click instead of two.
- **Boolean choices.** That is a checkbox or a switch.
- **Multi-select.** This component is single-value by design. Selecting many
  things needs different affordances — chips, a count, a clear-all.
- **Free text with suggestions.** This commits to one of `options`. A control
  where arbitrary text is valid is a different component.
- **Actions.** A list of things that _happen_ when chosen is a menu, not a
  select. A select holds a value; a menu fires a command.
- **`searchable` on a short list.** The search box costs a keystroke and saves
  nothing below ~20 options.

## Props

<!-- @props SelectProps -->

| Prop           | Type                   | Default          | Description                                                              |
| -------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------ |
| `options`      | `SelectOption<T>[]`    | **required**     | The available choices.                                                   |
| `placeholder`  | `string`               | `'Select…'`      | Text shown in the trigger while nothing is selected.                     |
| `searchable`   | `boolean`              | `false`          | Adds a search box inside the panel.                                      |
| `togglerLabel` | `string`               | `'Show options'` | Accessible name for the open/close chevron.                              |
| `emptyText`    | `string`               | `'No results'`   | Shown when no option matches the search term.                            |
| `manualFilter` | `boolean`              | `false`          | Hands filtering to the consumer.                                         |
| `loading`      | `boolean`              | `false`          | Shows a loading row in place of the list. For async options.             |
| `loadingText`  | `string`               | `'Loading…'`     | Text shown while `loading`.                                              |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`           | Control height and text size.                                            |
| `disabled`     | `boolean`              | `false`          | Disables the control. A surrounding disabled `Field` also disables it.   |
| `invalid`      | `boolean`              | `false`          | Marks the value invalid. A `Field` with an `error` also sets it.         |
| `required`     | `boolean`              | `false`          | Marks the control required. A required `Field` also sets it.             |
| `id`           | `string`               | —                | Id for the trigger. Inherited from a surrounding `Field` when omitted.   |
| `name`         | `string`               | —                | Name submitted with a native form.                                       |
| `class`        | `string`               | —                | Additional classes for the trigger, merged so a consumer's utility wins. |

<!-- /@props -->

```ts
interface SelectOption<TValue> {
  label: string
  value: TValue
  disabled?: boolean
}
```

Slots: `option` (`{ option, selected }`), `value` (`{ option }`), `empty`.

## Keyboard

| Key                              | Behaviour                                 |
| -------------------------------- | ----------------------------------------- |
| <kbd>Tab</kbd>                   | Moves focus to the control                |
| <kbd>↓</kbd> / <kbd>↑</kbd>      | Opens the panel, then moves the highlight |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last option                       |
| <kbd>Enter</kbd>                 | Selects the highlighted option            |
| <kbd>Esc</kbd>                   | Closes without changing the value         |
| Text keys                        | Filter, when `searchable`                 |

Disabled options are skipped by the highlight but stay visible, so the list
does not reflow as state changes.

## Accessibility

The control is an `<input role="combobox">`, not a button. Reka's trigger is
`tabindex="-1"` and self-labels as "Show popup" on the assumption that an input
is present to take focus — building around the bare trigger makes the control
unreachable by keyboard and overrides the field's label. Do not restructure it
that way.

- A non-searchable select is a `readonly` input, so it does not raise a mobile
  keyboard but keeps the combobox semantics.
- The panel is width-matched to the control, so a list of truncated labels is
  never the only thing on offer.
- The highlight is driven by `data-highlighted`, which follows the keyboard as
  well as the pointer — styling `:hover` alone would leave keyboard users with
  no visible cursor.
- Inside a `Field`, the label's `for` points at the control and the error is
  wired through `aria-describedby` with `aria-invalid`.

### Known upstream issue

Reka keeps its highlight after the panel closes, leaving `aria-activedescendant`
pointing at a list item that no longer exists — an invalid ARIA reference that
axe flags and that a screen reader cannot follow. rowkit clears the attribute
for as long as the panel is shut. The workaround is marked in `Select.vue` and
should go once Reka fixes it.
