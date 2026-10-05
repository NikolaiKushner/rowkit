# Select

**Stage:** 🟢 Stable

A single-value picker, optionally searchable, following the WAI-ARIA combobox
pattern. Generic over the value type, so `v-model` narrows to the values you
actually passed.

<script setup>
import SelectBasic from '../examples/select/SelectBasic.vue'
import SelectSearchable from '../examples/select/SelectSearchable.vue'
import SelectStates from '../examples/select/SelectStates.vue'
import SelectNumbers from '../examples/select/SelectNumbers.vue'
import SelectDependent from '../examples/select/SelectDependent.vue'
import SelectAsync from '../examples/select/SelectAsync.vue'
import SelectSizes from '../examples/select/SelectSizes.vue'
</script>

<DemoBox>
  <SelectBasic />
</DemoBox>

<<< @/examples/select/SelectBasic.vue

Generic over the value type, so `v-model` narrows to the values you actually
passed — here `Role | undefined`. Open it with the keyboard: <kbd>Enter</kbd>
or <kbd>↓</kbd> opens the panel, <kbd>Esc</kbd> closes without committing.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Searchable

`searchable` lets the trigger take text and filters the list. Worth turning on
somewhere around twenty options; below that it costs a keystroke and saves
nothing.

<DemoBox>
  <SelectSearchable />
</DemoBox>

<<< @/examples/select/SelectSearchable.vue

### Disabled options, errors and disabled

An option can be unavailable without leaving the list. A `Field` with an
`error` marks the select invalid, and a disabled `Field` disables it.

<DemoBox>
  <SelectStates />
</DemoBox>

<<< @/examples/select/SelectStates.vue

### Number values

Values do not have to be strings: with numbers, `v-model` stays a number. A
plain `<label for>` names the trigger when there is no `Field`.

<DemoBox>
  <SelectNumbers />
</DemoBox>

<<< @/examples/select/SelectNumbers.vue

### One choice narrows the next

The city list follows the country. Changing the country clears the city —
it may not exist there — and the city stays disabled until a country is
chosen.

<DemoBox>
  <SelectDependent />
</DemoBox>

<<< @/examples/select/SelectDependent.vue

### Searching a server

Bind `v-model:search-term`, fetch per keystroke, and set `manual-filter` — the
list is already the server's answer, so filtering it again locally would hide
results that matched on a field the label does not show, like the email here.
`loading` shows while a request is in flight, and an answer that arrives after
a newer question is ignored.

<DemoBox>
  <SelectAsync />
</DemoBox>

<<< @/examples/select/SelectAsync.vue

### Sizes

`size` on the `SelectTrigger`: `sm`, `md` (Windows 98's 23px) and `lg`.

<DemoBox>
  <SelectSizes />
</DemoBox>

<<< @/examples/select/SelectSizes.vue

## Anatomy

| Part            | Purpose                                                               |
| --------------- | --------------------------------------------------------------------- |
| `Select`        | Root. Holds `v-model` and, when searching, `v-model:searchTerm`       |
| `SelectTrigger` | The combobox input and the drop button. Read-only unless `searchable` |
| `SelectContent` | Portalled listbox, width-matched to the control                       |
| `SelectItem`    | One option. `label` is what the closed trigger shows                  |

## Props

### Select

<!-- @props SelectProps -->

| Prop           | Type      | Default | Description                                                            |
| -------------- | --------- | ------- | ---------------------------------------------------------------------- |
| `searchable`   | `boolean` | `false` | Lets the trigger accept text and filters the list.                     |
| `manualFilter` | `boolean` | `false` | Hands filtering to the consumer.                                       |
| `disabled`     | `boolean` | `false` | Disables the control. A surrounding disabled `Field` also disables it. |
| `invalid`      | `boolean` | `false` | Marks the value invalid. A `Field` with an `error` also sets it.       |
| `required`     | `boolean` | `false` | Marks the control required. A required `Field` also sets it.           |
| `name`         | `string`  | —       | Name submitted with a native form.                                     |

<!-- /@props -->

### SelectTrigger

<!-- @props SelectTriggerProps -->

| Prop           | Type                   | Default          | Description                                                                      |
| -------------- | ---------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `placeholder`  | `string`               | `'Select…'`      | Text shown while nothing is selected.                                            |
| `togglerLabel` | `string`               | `'Show options'` | Accessible name for the drop button that opens and closes the list.              |
| `size`         | `'sm' \| 'md' \| 'lg'` | —                | Control height and text size. Inherited from a surrounding `Field` when omitted. |
| `id`           | `string`               | —                | Id for the combobox input. Inherited from a surrounding `Field` when omitted.    |
| `class`        | `string`               | —                | Additional classes for the control, merged so a consumer's utility wins.         |

<!-- /@props -->

### SelectContent

<!-- @props SelectContentProps -->

| Prop          | Type      | Default        | Description                                                            |
| ------------- | --------- | -------------- | ---------------------------------------------------------------------- |
| `emptyText`   | `string`  | `'No results'` | Shown when no option matches the search term.                          |
| `loading`     | `boolean` | `false`        | Shows a loading row in place of the list. For async options.           |
| `loadingText` | `string`  | `'Loading…'`   | Text shown while `loading`.                                            |
| `class`       | `string`  | —              | Additional classes for the panel, merged so a consumer's utility wins. |

<!-- /@props -->

### SelectItem

<!-- @props SelectItemProps -->

| Prop       | Type      | Default      | Description                                               |
| ---------- | --------- | ------------ | --------------------------------------------------------- |
| `value`    | `T`       | **required** | The value committed to `v-model`.                         |
| `label`    | `string`  | **required** | Text shown in the trigger once this item is chosen.       |
| `disabled` | `boolean` | `false`      | Renders the option unselectable while leaving it visible. |
| `class`    | `string`  | —            | Additional classes, merged so a consumer's utility wins.  |

<!-- /@props -->

`SelectOption` is still exported, for a list you render into `SelectItem`s. It
is not a prop.

```ts
interface SelectOption<TValue> {
  label: string
  value: TValue
  disabled?: boolean
}
```

The item slot replaces the row. It receives `{ selected }`. `SelectContent`'s
`empty` slot replaces the empty-results message.

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
- **Free text with suggestions.** This commits to one of the items. A control
  where arbitrary text is valid is a different component.
- **Actions.** A list of things that _happen_ when chosen is a menu, not a
  select. A select holds a value; a menu fires a command.
- **`searchable` on a short list.** The search box costs a keystroke and saves
  nothing below ~20 options.

## Keyboard

| Key                              | Behaviour                                      |
| -------------------------------- | ---------------------------------------------- |
| <kbd>Tab</kbd>                   | Moves focus to the control                     |
| <kbd>↓</kbd> / <kbd>↑</kbd>      | Opens the panel, then moves the highlight      |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last option (when not `searchable`)    |
| <kbd>Enter</kbd>                 | Selects the highlighted option                 |
| <kbd>Esc</kbd>                   | Closes without changing the value              |
| Text keys                        | Filter when `searchable`; else jump to a match |

Disabled options are skipped by the highlight but stay visible, so the list
does not reflow as state changes.

## Pointer

A mouse press opens the list straight away, as a Windows 98 drop-down list
does. Keep the button down, drag onto an option and release to choose it, or
release first and click an option. Touch and pen open the list on a tap, so a
finger scrolling past does not open it by accident. The drop button behaves
the same and leaves focus in the control.

## Look

The Windows 98 drop-down list. The control is Input's white well in a sunken
bevel, with the raised drop button at its end: a form of inputs and selects
lines up to the pixel. With focus and a value, the value shows in navy with
white text. The list hangs directly under the control, as wide as it: white,
in a 1px black frame, 16px rows, eight before it scrolls. The highlighted
option is navy; there is no check mark, because the highlight opens on the
selected option. Invalid is quiet, as on Input: the error mark in the control,
nothing red. Nothing animates.

## Accessibility

The control is an `<input role="combobox">`, not a button: one tab stop that
keeps the field's label. The drop button is an extra pointer target, out of the tab
order. Options never take focus — it stays in the control, and the list follows
it through `aria-activedescendant`, which exists only while the list is open.

- A non-searchable select supports type-ahead: typing the start of a label
  opens the list and highlights the first match.
- The list paints above an open dialog (`z-popover`), and flips above the
  control when there is no room below.

- A non-searchable select is a `readonly` input, so it does not raise a mobile
  keyboard but keeps the combobox semantics.
- The panel is width-matched to the control, so a list of truncated labels is
  never the only thing on offer.
- The highlight is driven by `data-highlighted`, which follows the keyboard as
  well as the pointer — styling `:hover` alone would leave keyboard users with
  no visible cursor.
- Inside a `Field`, the label's `for` points at the control and the error is
  wired through `aria-describedby` with `aria-invalid`.
