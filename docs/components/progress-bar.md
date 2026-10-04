# ProgressBar

**Stage:** 🟡 New

The Windows 98 block progress bar: navy blocks filling a sunken track, whole
blocks only. For a task whose progress you can measure — an upload, an
import, a long copy.

```vue
<ProgressBar :value="uploaded" :max="total" aria-label="Uploading report.pdf" />
```

<DemoBox layout="stack">
  <ProgressBar :value="25" aria-label="25 percent" class="w-[200px]" />
  <ProgressBar :value="60" aria-label="60 percent" class="w-[200px]" />
  <ProgressBar :value="100" aria-label="Done" class="w-[200px]" />
</DemoBox>

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

| Prop    | Type     | Default      | Description                                                 |
| ------- | -------- | ------------ | ----------------------------------------------------------- |
| `value` | `number` | **required** | How far along, from 0 to `max`. Values outside are clamped. |
| `max`   | `number` | `100`        | The value that means done.                                  |
| `class` | `string` | —            | Additional classes, merged so a consumer's utility wins.    |

<!-- /@props -->

## Accessibility

- `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and
  `aria-valuenow`; values outside the range are clamped.
- **Give it a name** with `aria-label` or `aria-labelledby`. Without one a
  screen reader announces a percentage of nothing in particular.
