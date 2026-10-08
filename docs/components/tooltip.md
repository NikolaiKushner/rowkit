# Tooltip

**Stage:** 🟢 Stable

A label for a control, on hover and on focus.
You place the trigger and the content; the portal lives inside `TooltipContent`.

<script setup>
import TooltipBasic from '../examples/tooltip/TooltipBasic.vue'
import TooltipPlacement from '../examples/tooltip/TooltipPlacement.vue'
import TooltipToolbar from '../examples/tooltip/TooltipToolbar.vue'
import TooltipShortcut from '../examples/tooltip/TooltipShortcut.vue'
import TooltipTruncated from '../examples/tooltip/TooltipTruncated.vue'
</script>

<DemoBox>
  <TooltipBasic />
</DemoBox>

<<< @/examples/tooltip/TooltipBasic.vue

Tab to it and the tooltip opens on focus, with no delay — a keyboard user has
already committed to the control by the time they reach it. <kbd>Esc</kbd>
closes it.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Placement

`placement` on `TooltipContent` picks the side. Near the edge of the screen the
tooltip flips, so it never opens off-screen.

<DemoBox>
  <TooltipPlacement />
</DemoBox>

<<< @/examples/tooltip/TooltipPlacement.vue

### A toolbar of icon buttons

Hover the first button, then sweep along the row. The first waits out the
300ms delay; the rest open at once, because they share a `TooltipProvider` and
its `skip-delay-duration`. Without one, every button in a toolbar re-pays the
full delay and the row feels broken.

<DemoBox>
  <TooltipToolbar />
</DemoBox>

<<< @/examples/tooltip/TooltipToolbar.vue

### Teaching a shortcut

A tooltip on a labelled button adds what the label cannot: the keyboard
shortcut for the command.

<DemoBox>
  <TooltipShortcut />
</DemoBox>

<<< @/examples/tooltip/TooltipShortcut.vue

### Text cut short

A narrow column truncates long names; the tooltip shows the whole one. The
trigger takes focus, so the full name reaches the keyboard too.

<DemoBox>
  <TooltipTruncated />
</DemoBox>

<<< @/examples/tooltip/TooltipTruncated.vue

## Anatomy

| Part              | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `Tooltip`         | Root. `delay` and `disabled`. Supplies a provider when none is above |
| `TooltipTrigger`  | The control. `as-child` so your element becomes the trigger          |
| `TooltipContent`  | The label, and the portal that floats it                             |
| `TooltipProvider` | Shared timing for a toolbar. Renders nothing                         |

## Props

### Tooltip

<!-- @props TooltipProps -->

| Prop       | Type      | Default | Description                                           |
| ---------- | --------- | ------- | ----------------------------------------------------- |
| `delay`    | `number`  | `500`   | Delay before opening, in milliseconds.                |
| `disabled` | `boolean` | `false` | Turns the tooltip off without unwrapping the trigger. |

<!-- /@props -->

### TooltipTrigger

<!-- @props TooltipTriggerProps -->

| Prop      | Type                  | Default    | Description                                                               |
| --------- | --------------------- | ---------- | ------------------------------------------------------------------------- |
| `as`      | `string \| Component` | `'button'` | Element or component to render as. Defaults to a button.                  |
| `asChild` | `boolean`             | `false`    | Merge props onto the single child element instead of rendering a wrapper. |
| `class`   | `string`              | —          | Additional classes, merged so a consumer's utility wins.                  |

<!-- /@props -->

### TooltipContent

<!-- @props TooltipContentProps -->

| Prop        | Type                                     | Default | Description                                                             |
| ----------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------- |
| `placement` | `'top' \| 'left' \| 'right' \| 'bottom'` | `'top'` | Preferred side. Flips automatically on collision.                       |
| `class`     | `string`                                 | —       | Additional classes for the bubble, merged so a consumer's utility wins. |

<!-- /@props -->

The label is the default slot of `TooltipContent`. It is text. A tooltip never
holds focus, so a link or a button in that slot is unreachable by keyboard. If
the label needs either, it is a popover — deliberately not in v1.

## When to use

- Naming an icon-only control for sighted pointer users.
- A short clarification on a control whose label has to stay terse.
- Explaining why a control is unavailable — see the disabled pattern below.

## When not to use

- **For anything essential.** Tooltips do not exist on touch, are invisible until
  interaction, and vanish. If the user must know it, it belongs in visible text,
  an accessible label, or a dialog. A tooltip is progressive enhancement.
- **As the accessible name.** An icon button needs its own `aria-label`. The
  tooltip is the visible echo of that name, not a substitute — `aria-describedby`
  is a _description_, and some readers skip descriptions entirely.
- **For anything interactive.** See above.
- **On a truly `disabled` element.** It will never open. See below.
- **On body text.** A tooltip on a word is a footnote wanting to be a footnote.

## The disabled-trigger trap

The most-asked tooltip question in every library. A `disabled` element fires no
pointer or focus events, so a tooltip on one **never opens** — and that is
browser behaviour, not something rowkit can work around.

```vue
<!-- ✗ Never opens. -->
<Tooltip>
  <TooltipTrigger as-child>
    <Button disabled>Export</Button>
  </TooltipTrigger>
  <TooltipContent>Upgrade to export</TooltipContent>
</Tooltip>

<!-- ✓ Focusable, so the tooltip can explain itself. -->
<Tooltip>
  <TooltipTrigger as-child>
    <Button aria-disabled="true" @click="showUpgrade">Export</Button>
  </TooltipTrigger>
  <TooltipContent>Upgrade your plan to export</TooltipContent>
</Tooltip>
```

<DemoBox>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button disabled>Export (disabled)</Button>
    </TooltipTrigger>
    <TooltipContent>Upgrade to export</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button aria-disabled="true">Export (aria-disabled)</Button>
    </TooltipTrigger>
    <TooltipContent>Upgrade your plan to export</TooltipContent>
  </Tooltip>
</DemoBox>

Hover both. Only the second one ever says anything — and it is the same tooltip,
on the same parts. This is the one place the page carries a second demo block,
because the trap is easier to believe when the broken version is sitting next to
the working one.

`aria-disabled` keeps the control in the tab order and announces it as
unavailable, while leaving it able to fire events. Handle the click as a no-op,
or use it to explain. This is exactly the case where a tooltip is most valuable,
so the pattern is worth the extra attribute.

## Touch

Tooltips fundamentally do not work on touch: there is no hover. Long-press shows
one where the platform supports it, and that is the whole story.

**Never put essential information in a tooltip.** This is the same rule as "when
not to use", repeated here because it is the one people skip.

## The provider, and the toolbar sweep

A single `Tooltip` needs no setup — it supplies its own provider when there is
not one above it.

One behaviour needs a shared provider, because the state is shared:
`skipDelayDuration`, the grace period that lets a pointer sweep across a row of
icon buttons and show each tooltip immediately after the first. Without it, every
button in a toolbar re-pays the full delay.

```vue
<script setup>
import { TooltipProvider } from 'rowkit'
</script>

<template>
  <TooltipProvider :delay-duration="300" :skip-delay-duration="500">
    <!-- toolbar of Tooltip / TooltipTrigger / TooltipContent -->
  </TooltipProvider>
</template>
```

`TooltipProvider` renders nothing. Its props are `delayDuration` and
`skipDelayDuration` rather than rowkit's `delay`, kept stable so markup written
against it keeps working. A rowkit `Tooltip` inside a provider
defers to it rather than shadowing it.

## Keyboard

| Key               | Action                                             |
| ----------------- | -------------------------------------------------- |
| <kbd>Tab</kbd>    | Focusing the trigger opens the tooltip immediately |
| <kbd>Escape</kbd> | Dismisses it, leaving focus where it was           |

**Focus opens it with no delay.** The delay exists to stop tooltips firing as a
pointer crosses a toolbar, and that problem does not exist for the keyboard.

## Accessibility

**Opens on focus, not hover alone.** A hover-only tooltip is invisible to
keyboard users. Covered by an interaction test, because it is easy to lose.

**`aria-describedby` links the trigger to the content.** The bubble itself is the
`role="tooltip"` element the trigger references, so the text exists once and is
announced once.

**Escape dismisses without moving focus** (WCAG 1.4.13), and the tooltip stays
open while the pointer travels onto it — anywhere inside the box spanning the
trigger and the bubble keeps it open, so the 4px gap is crossable and the tooltip
is not snatched away mid-read.

**Near a viewport edge it flips and slides.** `placement` is a preference: if the
bubble does not fit on that side it moves to the opposite one, and it slides along
the edge rather than being clipped.

**No motion.** The bubble appears after the delay and goes instantly, in
every theme, so there is nothing for `prefers-reduced-motion` to remove.

In Windows 98 the bubble is the pale yellow info face in a 1px black border,
square, with no shadow. In the modern theme it is light grey (dark grey in
the dark scheme), with small rounded corners, a faint border and a soft
shadow.
