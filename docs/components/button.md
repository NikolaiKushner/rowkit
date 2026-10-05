# Button

**Stage:** 🟢 Stable

The Windows 98 command button. A black-framed `default` for the action Enter
takes, raised `secondary` for every other command, flat `ghost` for toolbars,
`destructive` with a maroon label, and `link` — plus a toggle state and a
loading state that does not move the furniture.

<script setup>
import ButtonBasic from '../examples/button/ButtonBasic.vue'
import ButtonVariants from '../examples/button/ButtonVariants.vue'
import ButtonSizes from '../examples/button/ButtonSizes.vue'
import ButtonIcons from '../examples/button/ButtonIcons.vue'
import ButtonLoading from '../examples/button/ButtonLoading.vue'
import ButtonToggle from '../examples/button/ButtonToggle.vue'
import ButtonToolbar from '../examples/button/ButtonToolbar.vue'
import ButtonLinks from '../examples/button/ButtonLinks.vue'
import ButtonForm from '../examples/button/ButtonForm.vue'
import ButtonConfirm from '../examples/button/ButtonConfirm.vue'
import ButtonBlock from '../examples/button/ButtonBlock.vue'
</script>

<DemoBox>
  <ButtonBasic />
</DemoBox>

<<< @/examples/button/ButtonBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Variants

Five variants, five jobs. The black-framed default is the one action Enter
takes — one per view. Everything else is `secondary`; `ghost` is flat until
hovered, for toolbars; `destructive` draws a maroon label for an action that
loses data; `link` is text that acts.

<DemoBox>
  <ButtonVariants />
</DemoBox>

<<< @/examples/button/ButtonVariants.vue

### Sizes

`default` is Windows 98's own 23px. `sm` and `xs` fit dense toolbars and
table rows, `lg` is for touch and for the one big call to action on a page.

<DemoBox>
  <ButtonSizes />
</DemoBox>

<<< @/examples/button/ButtonSizes.vue

### With icons

Icons go in the `leading` and `trailing` slots, never in the label text. An
icon-only button uses an `icon-*` size, which renders a square — and, with no
visible text, it needs an `aria-label`.

<DemoBox>
  <ButtonIcons />
</DemoBox>

<<< @/examples/button/ButtonIcons.vue

### Loading

Press either button. The button stays focused and stays clickable: loading
sets `aria-busy` and makes the handler a no-op rather than setting `disabled`,
so a keyboard user is not thrown back to the top of the document by their own
action. The hourglass occupies the leading slot — with a leading icon the
width does not change at all, and without one it fits inside the 75px minimum
for a short label.

<DemoBox>
  <ButtonLoading />
</DemoBox>

<<< @/examples/button/ButtonLoading.vue

### Toggle buttons

`pressed` makes a button a toggle: it sets `aria-pressed` and draws the button
pressed in over the dither. Independent toggles — bold, italic — latch on their
own; a view switch is a group where exactly one is pressed.

<DemoBox>
  <ButtonToggle />
</DemoBox>

<<< @/examples/button/ButtonToggle.vue

### A toolbar

Flat `ghost` buttons in a `role="toolbar"`, related commands in a
`ButtonGroup`, groups split by a vertical `Separator`. Commands that need a
selection are disabled without one.

<DemoBox>
  <ButtonToolbar />
</DemoBox>

<<< @/examples/button/ButtonToolbar.vue

### Links that look like buttons

A thing that changes the URL is a link. `as="a"` renders an anchor with the
button's look, so middle-click, copy link and open in a new tab keep working.

<DemoBox>
  <ButtonLinks />
</DemoBox>

<<< @/examples/button/ButtonLinks.vue

### In a form

Buttons default to `type="button"`, so nothing submits a form by accident.
The submit button says `type="submit"`; Enter in the field submits through
it.

<DemoBox>
  <ButtonForm />
</DemoBox>

<<< @/examples/button/ButtonForm.vue

### Delete, with a confirmation

`destructive` opens a confirmation rather than acting at once. In the dialog
the safe choice is the default button, so Enter cancels and Delete has to be
chosen on purpose. After the action, offer a way back.

<DemoBox>
  <ButtonConfirm />
</DemoBox>

<<< @/examples/button/ButtonConfirm.vue

### Full width

`block` stretches a button to its container — a narrow side panel, a sign-in
form, a phone layout.

<DemoBox>
  <ButtonBlock />
</DemoBox>

<<< @/examples/button/ButtonBlock.vue

Every state is a bevel. Pressed sinks the bevel and moves the label one pixel
right and down; focus adds a dotted ring around the label (and the black frame
on a `secondary` button); disabled greys the label and embosses it. Nothing
fades or animates.

## Anatomy

| Part          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| Leading slot  | Icon before the label. Replaced by the hourglass while loading |
| Label         | The action, phrased as a verb                                  |
| Trailing slot | Icon after the label — a chevron, an external-link mark        |

## When to use

- Anything that performs an action: submit, delete, retry, open a dialog.
- Default (no `variant`) for the one action the form or dialog is for — the
  one Enter would press. One per view.
- `secondary` for every other command, dialog Cancel included. `ghost` for a
  flat toolbar button, `destructive` for an action that opens a confirmation,
  `link` when the control should read as text.
- `pressed` for a toggle that latches: bold, word wrap, a view switch. It sets
  `aria-pressed` and draws the button pressed in over the dither.

## When not to use

- **For navigation.** A thing that changes the URL is a link. Use
  `<Button as="a" href="...">` so it renders an anchor and keeps
  middle-click, copy-link, and open-in-new-tab working — or `variant="link"`
  when it stays on the page but should look like text.
- **More than one default solid per screen.** If two actions are equally
  important, neither is primary.
- **As an on/off setting in a form.** A setting that is saved with the form
  is a checkbox. `pressed` is for a command that latches, like a toolbar
  button.
- **With `type="submit"` by accident.** The default here is `type="button"`
  precisely because a button that silently submits its surrounding form is the
  more damaging default. Opt in when you mean it.
- **`destructive` for anything reversible.** Reserve it for actions that lose
  data. Using it for "Cancel" trains people to ignore it.

## Props

<!-- @props ButtonProps -->

| Prop           | Type                                                                                 | Default     | Description                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `variant`      | `'default' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'`                     | `'default'` | Visual weight and intent.                                                                                                 |
| `size`         | `'sm' \| 'default' \| 'xs' \| 'lg' \| 'icon-xs' \| 'icon-sm' \| 'icon' \| 'icon-lg'` | `'default'` | Control height: `xs` 21px, `sm` 26px, `default` 28px (Windows 98's own, in Large Fonts), `lg` 33px.                       |
| `block`        | `boolean`                                                                            | `false`     | Stretches the button to fill its container.                                                                               |
| `pressed`      | `boolean`                                                                            | `undefined` | Makes the button a toggle and sets whether it is on (`aria-pressed`).                                                     |
| `loading`      | `boolean`                                                                            | `false`     | Swaps the leading slot for the hourglass and blocks activation.                                                           |
| `disabled`     | `boolean`                                                                            | `false`     | Disables the button.                                                                                                      |
| `type`         | `'button' \| 'submit' \| 'reset'`                                                    | `'button'`  | Native button type. Defaults to `button`, not `submit` — an unlabelled submit inside a form is the more damaging default. |
| `loadingLabel` | `string`                                                                             | —           | Announced in place of the visible label while `loading` is set. Leave unset to keep the label unchanged.                  |
| `class`        | `string`                                                                             | —           | Additional classes, merged so a consumer's utility wins.                                                                  |
| `as`           | `string \| Component`                                                                | `'button'`  | Element or component to render as.                                                                                        |
| `asChild`      | `boolean`                                                                            | `false`     | Merge props onto the single child element instead of rendering a wrapper.                                                 |

<!-- /@props -->

### Slots

| Slot       | Description           |
| ---------- | --------------------- |
| `default`  | The label             |
| `leading`  | Icon before the label |
| `trailing` | Icon after the label  |

## Keyboard

| Key              | Behaviour                 |
| ---------------- | ------------------------- |
| <kbd>Tab</kbd>   | Moves focus to the button |
| <kbd>Enter</kbd> | Activates it              |
| <kbd>Space</kbd> | Activates it              |

A `disabled` button is removed from the tab order by the browser, which is
correct for a genuinely unavailable action.

A **loading** button is not. It keeps `tabindex`, keeps focus, and sets
`aria-busy="true"`. If it were disabled instead, focus would jump to the
document body the moment the user pressed Enter, and a keyboard user would
lose their place in the form. Activation is blocked separately, on both the
pointer and the keyboard path.

## Accessibility

- The accessible name does not change while loading. Swapping the label to
  "Loading…" rewrites the button out from under a screen reader user
  mid-announcement. Pass `loadingLabel` if you want an additional
  `role="status"` message alongside the unchanged label.
- The spinner is `aria-hidden`; `aria-busy` carries the state.
- Rendered as something other than `<button>` — a link, say — `disabled`
  becomes `aria-disabled`, because `<a>` has no `disabled` attribute and
  setting one does nothing.
- Focus is a soft silver `border-ring` plus a translucent outer ring. Never
  remove it; recolour `--color-ring` if you must.
- Icon-only sizes (`icon`, `icon-xs`, …) need an `aria-label` — nothing here
  invents one.
