# ProgressBar

**Stage:** 🟡 New

The Windows 98 block progress bar: navy blocks filling a sunken track, whole
blocks only. For a task whose progress you can measure — an upload, an
import, a long copy — and, with no `value`, for one whose length is not known
yet.

<script setup>
import ProgressBarBasic from '../examples/progress-bar/ProgressBarBasic.vue'
import ProgressBarUpload from '../examples/progress-bar/ProgressBarUpload.vue'
import ProgressBarSteps from '../examples/progress-bar/ProgressBarSteps.vue'
import ProgressBarStatusBar from '../examples/progress-bar/ProgressBarStatusBar.vue'
import ProgressBarIndeterminate from '../examples/progress-bar/ProgressBarIndeterminate.vue'
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

### Length unknown

Leave `value` out, or pass `null`, while there is nothing to measure yet —
connecting, waiting for the server to count the rows. A segment travels along
the track instead of filling it. Give it a `value` the moment there is one.

<DemoBox>
  <ProgressBarIndeterminate />
</DemoBox>

<<< @/examples/progress-bar/ProgressBarIndeterminate.vue

## Look

As drawn in the Figma file: 18px tall in the thin sunken status bevel, 2px of
padding, navy 8×12 blocks 2px apart. The fill is rounded down to whole blocks,
so a block appears all at once — there is no smooth fill and no easing. A
browser without CSS `round()` shows the plain percentage, which can cut the
last block.

With no `value`, a group of four blocks steps one block (10px) to the right
every 100ms and comes back in from the left once it reaches the end.

In the modern theme the bar is a 6px rounded track with a solid blue fill
that eases to each new value. With no `value`, a segment 30% of the track
slides across it every 1.2s. With reduced motion, the segment stands still in
the middle of the track, in either theme.

## When to use

- A task with a known amount of work and a value that moves.
- With no `value`, a task that will take a while but cannot say how long yet —
  a connection, a job the server has not sized.

## When not to use

- **For content that is about to appear in place.** Use `Skeleton` where the
  content will be, or Button's `loading` state on the button that started it.
  An indeterminate bar is for a task the person waits on, not for a page
  filling in.
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
- With no `value`, `aria-valuenow` is left off, which is how a progress bar
  says its progress is unknown; `data-state="indeterminate"` marks it for
  styling. Say what is happening in the name or beside the bar.
- The travelling segment is motion, so it is `motion-safe:` only: with reduced
  motion it stands still in the middle of the track.
- **Give it a name** with `aria-label` or `aria-labelledby`. Without one a
  screen reader announces a percentage of nothing in particular.
