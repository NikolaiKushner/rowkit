# ProgressBar

**Stage:** 🟡 New

The Windows 98 block progress bar: navy blocks filling a sunken track, whole
blocks only. For a task whose progress you can measure — an upload, an
import, a long copy.

<script setup>
import ProgressBarBasic from '../examples/progress-bar/ProgressBarBasic.vue'
import ProgressBarUpload from '../examples/progress-bar/ProgressBarUpload.vue'
import ProgressBarSteps from '../examples/progress-bar/ProgressBarSteps.vue'
import ProgressBarStatusBar from '../examples/progress-bar/ProgressBarStatusBar.vue'
</script>

<DemoBox>
  <ProgressBarBasic />
</DemoBox>

<<< @/examples/progress-bar/ProgressBarBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### An upload you can cancel

`max` in the task's own unit — kilobytes here — and the numbers beside the
bar, because blocks alone do not say how long is left.

<DemoBox>
  <ProgressBarUpload />
</DemoBox>

<<< @/examples/progress-bar/ProgressBarUpload.vue

### Counted steps

Progress through a count rather than a size: 3 of 12 files. The accessible
name says the count, too.

<DemoBox>
  <ProgressBarSteps />
</DemoBox>

<<< @/examples/progress-bar/ProgressBarSteps.vue

### In a status bar

Beside the words for what is happening, in a section of a window's status
bar.

<DemoBox>
  <ProgressBarStatusBar />
</DemoBox>

<<< @/examples/progress-bar/ProgressBarStatusBar.vue

## Look

As drawn in the Figma file: 18px tall in the thin sunken status bevel, 2px of
padding, navy 8×12 blocks 2px apart. The fill is rounded down to whole blocks,
so a block appears all at once — there is no smooth fill and no easing. A
browser without CSS `round()` shows the plain percentage, which can cut the
last block.

## When to use

- A task with a known amount of work and a value that moves.

## When not to use

- **For loading whose length is unknown.** Use `Skeleton` in place of the
  content, or Button's `loading` hourglass.
- **For a quantity that is not progress** — disk space, a quota. That is a
  meter, and reading it as "almost done" is wrong.

## Props

<!-- @props ProgressBarProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `value` | `number` | `null`  | How far along, from 0 to `max`.                          |
| `max`   | `number` | `100`   | The value that means done.                               |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

## Accessibility

- `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and
  `aria-valuenow`; values outside the range are clamped.
- **Give it a name** with `aria-label` or `aria-labelledby`. Without one a
  screen reader announces a percentage of nothing in particular.
