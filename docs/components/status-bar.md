# StatusBar

**Stage:** 🟡 New

The strip along the bottom of a Windows 98 window: sunken cells on the silver
face, each holding a line of status. The first cell takes the width the others
leave; give the rest a width.

<script setup>
import StatusBarBasic from '../examples/status-bar/StatusBarBasic.vue'
import StatusBarEditor from '../examples/status-bar/StatusBarEditor.vue'
import StatusBarIcons from '../examples/status-bar/StatusBarIcons.vue'
</script>

<DemoBox layout="stack">
  <StatusBarBasic />
</DemoBox>

<<< @/examples/status-bar/StatusBarBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Following what the person does

An editor's status bar: the word count, the caret's line and column, the
encoding — each in its own sunken section, updated as you type or click.

<DemoBox layout="stack">
  <StatusBarEditor />
</DemoBox>

<<< @/examples/status-bar/StatusBarEditor.vue

### Icons and live status

A section can hold an icon beside its text, or a link. `aria-live` on the
section reads a change out — «Saving…», then «All changes saved».

<DemoBox layout="stack">
  <StatusBarIcons />
</DemoBox>

<<< @/examples/status-bar/StatusBarIcons.vue

## Look

As drawn in the Figma file: a 22px strip, 2px of padding, sections 2px apart.
Each section is 18px tall in the thin sunken status bevel, its text 4px in
from either side and cut off with an ellipsis rather than wrapped.

## Anatomy

| Part               | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `StatusBar`        | The strip. The first section fills it                    |
| `StatusBarSection` | One sunken cell: a line of text, an icon and text, a pip |

## When to use

- At the foot of a window or panel: counts, the selection, the page, a
  connection state.
- Beside `Pagination` under a table, as in the Figma Home template.

## When not to use

- **For messages that need attention.** A status bar is read in passing; an
  error belongs in a `Toast` or next to what failed.
- **For actions.** It reports; a toolbar acts.

## Props

### StatusBar

<!-- @props StatusBarProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### StatusBarSection

<!-- @props StatusBarSectionProps -->

| Prop    | Type     | Default | Description                                                    |
| ------- | -------- | ------- | -------------------------------------------------------------- |
| `class` | `string` | —       | Additional classes — a width, for every section but the first. |

<!-- /@props -->

## Accessibility

The bar is not a live region: a status that changes every second would talk
over everything else. When one section reports something a screen reader
should hear as it changes — a save finishing, a count after filtering — put
`role="status"` on that section alone.
