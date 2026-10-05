# Radio

**Stage:** 🟡 New

The Windows 98 option button: a 12×12 round well beside its label. One choice
from a few. Native `<input type="radio">`s sharing a `name`, so the arrow keys
move the choice and the browser keeps it to one.

<script setup>
import RadioBasic from '../examples/radio/RadioBasic.vue'
import RadioDescriptions from '../examples/radio/RadioDescriptions.vue'
import RadioInline from '../examples/radio/RadioInline.vue'
import RadioReveal from '../examples/radio/RadioReveal.vue'
import RadioNumbers from '../examples/radio/RadioNumbers.vue'
import RadioStates from '../examples/radio/RadioStates.vue'
</script>

<DemoBox>
  <RadioBasic />
</DemoBox>

<<< @/examples/radio/RadioBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### With a description

The default slot takes markup: a bold title, a line of detail, a price.

<DemoBox>
  <RadioDescriptions />
</DemoBox>

<<< @/examples/radio/RadioDescriptions.vue

### Side by side

Short choices — alignment, orientation — sit in a row inside their group box.

<DemoBox>
  <RadioInline />
</DemoBox>

<<< @/examples/radio/RadioInline.vue

### A choice that needs more

The last option enables its own field; the others leave it disabled.

<DemoBox>
  <RadioReveal />
</DemoBox>

<<< @/examples/radio/RadioReveal.vue

### Number values

Values do not have to be strings: with numbers, `v-model` stays a number.

<DemoBox>
  <RadioNumbers />
</DemoBox>

<<< @/examples/radio/RadioNumbers.vue

### Required, with no default

Nothing is picked until the person picks; `required` makes the browser ask
before the form submits. A sold-out option stays visible but disabled.

<DemoBox>
  <RadioStates />
</DemoBox>

<<< @/examples/radio/RadioStates.vue

## Look

As drawn in the Figma file: the pixel-drawn round bevel — the one round thing
in the system — with a 4×4 black dot when chosen. Held down, or disabled, the
well turns silver; disabled, the dot and label turn grey and the label is
embossed. Focus is the dotted ring around the label.

## When to use

- One choice from two to about five options, all visible at once.

## When not to use

- **For more options than fit comfortably.** Use a `Select`.
- **For independent on/off choices.** Those are `Checkbox`es.
- **For a single option.** A lone radio cannot be turned off again.

## Props

<!-- @props RadioProps -->

| Prop       | Type      | Default      | Description                                                                                           |
| ---------- | --------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| `value`    | `T`       | **required** | This option's value. `v-model` equals it while this option is chosen.                                 |
| `name`     | `string`  | —            | The group's name. Options sharing it are one group: one choice, and the arrow keys move between them. |
| `label`    | `string`  | —            | The label beside the well. The default slot replaces it.                                              |
| `disabled` | `boolean` | `false`      | Disables this option: a silver well and a grey, embossed label.                                       |
| `required` | `boolean` | `false`      | Marks the group required for native form validation.                                                  |
| `id`       | `string`  | —            | Id for the input. Generated when omitted.                                                             |
| `class`    | `string`  | —            | Additional classes for the row, merged so a consumer's utility wins.                                  |

<!-- /@props -->

`v-model` is the group's chosen value: bind the same ref on every option.

## Keyboard

| Key                         | Action                                |
| --------------------------- | ------------------------------------- |
| <kbd>Tab</kbd>              | Enters the group at the chosen option |
| <kbd>↓</kbd> / <kbd>→</kbd> | Chooses the next option               |
| <kbd>↑</kbd> / <kbd>←</kbd> | Chooses the previous option           |

## Accessibility

- Give every option in a group the same `name`: that is what makes the arrow
  keys and single selection work, natively.
- Name the group: put the options in a `GroupBox` — a `fieldset` whose legend
  names them — or a `role="radiogroup"` with an `aria-label`.
