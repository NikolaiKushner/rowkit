# Radio

**Stage:** 🟡 New

The Windows 98 option button: a 12×12 round well beside its label. One choice
from a few. Native `<input type="radio">`s sharing a `name`, so the arrow keys
move the choice and the browser keeps it to one.

```vue
<Radio v-model="plan" name="plan" value="free" label="Free" />
<Radio v-model="plan" name="plan" value="pro" label="Pro" />
```

<script setup>
import { ref } from 'vue'
const plan = ref('free')
</script>

<DemoBox>
  <GroupBox legend="Plan" class="w-[200px]">
    <Radio v-model="plan" name="docs-plan" value="free" label="Free" />
    <Radio v-model="plan" name="docs-plan" value="pro" label="Pro" />
    <Radio v-model="plan" name="docs-plan" value="team" label="Team" disabled />
  </GroupBox>
</DemoBox>

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
