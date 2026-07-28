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

| Prop                                | Type                   | Default          | Description                                                     |
| ----------------------------------- | ---------------------- | ---------------- | --------------------------------------------------------------- |
| `options`                           | `SelectOption<T>[]`    | required         | The choices                                                     |
| `modelValue`                        | `T`                    | —                | `v-model`                                                       |
| `searchTerm`                        | `string`               | `''`             | `v-model:search-term`. Bind it to fetch async options           |
| `placeholder`                       | `string`               | `'Select…'`      | Shown while nothing is selected                                 |
| `searchable`                        | `boolean`              | `false`          | Make the control typable and filter as you type                 |
| `manualFilter`                      | `boolean`              | `false`          | Hand filtering to you — the list is already the server's answer |
| `loading`                           | `boolean`              | `false`          | Show `loadingText` in place of the list                         |
| `loadingText`                       | `string`               | `'Loading…'`     | Text shown while loading                                        |
| `emptyText`                         | `string`               | `'No results'`   | Shown when nothing matches                                      |
| `togglerLabel`                      | `string`               | `'Show options'` | Accessible name for the chevron                                 |
| `size`                              | `'sm' \| 'md' \| 'lg'` | `'md'`           | Control height and text size                                    |
| `disabled` / `invalid` / `required` | `boolean`              | `false`          | Also set by a surrounding `Field`                               |
| `id`                                | `string`               | from `Field`     | Control id                                                      |
| `name`                              | `string`               | —                | Submitted with a native form                                    |
| `class`                             | `string`               | —                | Merged so your utility wins                                     |

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
