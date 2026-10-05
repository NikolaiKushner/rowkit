# Badge

**Stage:** 🟢 Stable

A short, non-interactive status label. Built for the status column of a table,
where the same handful of values repeat down the page.

<script setup>
import BadgeBasic from '../examples/badge/BadgeBasic.vue'
import BadgeMatrix from '../examples/badge/BadgeMatrix.vue'
import BadgeSizes from '../examples/badge/BadgeSizes.vue'
import BadgeInContext from '../examples/badge/BadgeInContext.vue'
</script>

<DemoBox>
  <BadgeBasic />
</DemoBox>

<<< @/examples/badge/BadgeBasic.vue

The shape a status column takes. They stay readable with the colour removed —
the word carries the meaning, and the dot gives the eye something to lock onto
down a repeating column.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Variants and appearances

Five variants by three appearances. `subtle` is the quiet default for values
that repeat; `solid` is for the one thing that should stand out; `outline`
keeps black text on any face.

<DemoBox>
  <BadgeMatrix />
</DemoBox>

<<< @/examples/badge/BadgeMatrix.vue

### Sizes

`sm` for table cells and dense lists, `md` beside headings and labels.

<DemoBox>
  <BadgeSizes />
</DemoBox>

<<< @/examples/badge/BadgeSizes.vue

### Beside a heading, in a button, after a name

The state of a thing next to its heading, a count inside a button — read with
its label, «Inbox 12» — and a version after a package name.

<DemoBox layout="stack">
  <BadgeInContext />
</DemoBox>

<<< @/examples/badge/BadgeInContext.vue

## Anatomy

| Part      | Purpose                                                                      |
| --------- | ---------------------------------------------------------------------------- |
| Container | Carries the colour from `variant` × `appearance`                             |
| Dot       | Optional leading shape, `aria-hidden` — repeats colour the badge already has |
| Label     | The text. One or two words                                                   |

## When to use

- Communicating the state of a row: active, invited, failed, archived.
- Categorising a record with a fixed, small vocabulary.
- Counting, when the count is the whole point (`<Badge>12</Badge>`).

## When not to use

- **As a button.** A badge is not interactive and has no focus, hover, or
  pressed state. If clicking it does something, use `Button` or a link.
- **For free-form text.** It truncates. If the content can be a sentence, it is
  not a badge.
- **As the only signal for a status.** Colour alone fails for colour-blind
  users and in print. The label carries the meaning; the colour reinforces it.
  Turn on `dot` when a column repeats the same few statuses and the eye needs a
  shape to lock onto.
- **For more than about five distinct values.** Past that the colours stop
  being distinguishable and the badge stops being a signal. Use plain text.
- **A whole column of `appearance="solid"`.** It reads as a wall of colour and
  communicates nothing. `subtle` is the default for this reason.

## Props

<!-- @props BadgeProps -->

| Prop         | Type                                                           | Default     | Description                                                                                                |
| ------------ | -------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `variant`    | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Status family. `neutral` is the "no particular status" default rather than an absence of styling.          |
| `appearance` | `'subtle' \| 'solid' \| 'outline'`                             | `'subtle'`  | How much visual weight the badge carries.                                                                  |
| `size`       | `'sm' \| 'md'`                                                 | `'md'`      | `sm` (18px) for table rows and navigation counts, `md` (20px) elsewhere.                                   |
| `dot`        | `boolean`                                                      | `false`     | Shows a 5×5 square before the label in the variant's colour.                                               |
| `class`      | `string`                                                       | —           | Additional classes, merged with the variant classes so a consumer's utility wins over the component's own. |
| `as`         | `string \| Component`                                          | `'span'`    | Element or component to render as.                                                                         |
| `asChild`    | `boolean`                                                      | `false`     | Merge props onto the single child element instead of rendering a wrapper.                                  |

<!-- /@props -->

### Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | The label   |

## Keyboard

None. A badge is not interactive and is not in the tab order. If you find
yourself wanting keyboard support here, you want a different component.

## Accessibility

- The dot is `aria-hidden`: it repeats information the label already carries,
  and announcing it before every status would be noise.
- Every `variant` × `appearance` pair meets WCAG AA for text contrast. This
  is asserted in `@rowkit/tokens`, not assumed.
- A badge announces as plain text. If its appearance is the _result_ of an
  action the user just took, put it in a container with `aria-live`, not on
  the badge itself.
