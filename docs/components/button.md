# Button

**Stage:** 🟢 Stable

The action control. Soft-ink default, outline / secondary / ghost chrome,
soft `destructive`, and `link` — plus a loading state that does not move the
furniture.

```vue
<Button :loading="saving" @click="save">Save changes</Button>
```

<script setup>
import { ref } from 'vue'

const saving = ref(false)

function save() {
  saving.value = true
  setTimeout(() => (saving.value = false), 1400)
}
</script>

<DemoBox>
  <Button :loading="saving" @click="save">Save changes</Button>
  <Button variant="outline">Cancel</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Details</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="link">Link</Button>
</DemoBox>

Press **Save changes**. The button stays focused and stays clickable: loading
sets `aria-busy` and makes the handler a no-op rather than setting `disabled`,
so a keyboard user is not thrown back to the top of the document by their own
action.

The spinner occupies the leading slot. Give the button a leading icon and the
width does not change at all when it starts — without one, as here, the button
grows by the width of the spinner.

## Anatomy

| Part          | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| Leading slot  | Icon before the label. Replaced by the spinner while loading |
| Label         | The action, phrased as a verb                                |
| Trailing slot | Icon after the label — a chevron, an external-link mark      |

## When to use

- Anything that performs an action: submit, delete, retry, open a dialog.
- Default (no `variant`) for the one action the screen is for. One per view.
- `outline` for bordered alternatives, `secondary` for a muted fill, `ghost`
  for tertiary actions and dialog Cancel, `destructive` for soft delete-style
  actions, `link` when the control should read as text.

## When not to use

- **For navigation.** A thing that changes the URL is a link. Use
  `<Button as="a" href="...">` so it renders an anchor and keeps
  middle-click, copy-link, and open-in-new-tab working — or `variant="link"`
  when it stays on the page but should look like text.
- **More than one default solid per screen.** If two actions are equally
  important, neither is primary.
- **As a toggle.** A button that stays pressed needs `aria-pressed` and a
  different mental model. That is a switch or a toggle button, not this.
- **With `type="submit"` by accident.** The default here is `type="button"`
  precisely because a button that silently submits its surrounding form is the
  more damaging default. Opt in when you mean it.
- **`destructive` for anything reversible.** Reserve it for actions that lose
  data. Using it for "Cancel" trains people to ignore it.

## Props

<!-- @props ButtonProps -->

| Prop           | Type                                                                                 | Default     | Description                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `variant`      | `'outline' \| 'default' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'`        | `'default'` | Visual weight and intent.                                                                                                 |
| `size`         | `'sm' \| 'default' \| 'xs' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Control height and text size.                                                                                             |
| `block`        | `boolean`                                                                            | `false`     | Stretches the button to fill its container.                                                                               |
| `loading`      | `boolean`                                                                            | `false`     | Swaps the leading slot for a spinner and blocks activation.                                                               |
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
