# Dialog

**Stage:** 🟢 Stable

A modal dialog built on Reka UI's `Dialog`. Focus trap, focus restore, scroll
lock and background inerting come from the primitive; rowkit supplies the API
shape, the token styling, and the opinions.

```vue
<Dialog v-model:open="open" title="Delete project" description="This cannot be undone.">
  Everything in the project goes with it.
  <template #footer>
    <Button variant="ghost" @click="open = false">Cancel</Button>
    <Button variant="danger" @click="remove">Delete</Button>
  </template>
</Dialog>
```

<script setup>
import { ref } from 'vue'

const confirmOpen = ref(false)
const termsOpen = ref(false)
const deleted = ref(false)

function remove() {
  confirmOpen.value = false
  deleted.value = true
}
</script>

<DemoBox>
  <Button variant="danger" @click="confirmOpen = true">Delete project</Button>
  <Button variant="secondary" @click="termsOpen = true">Read the terms</Button>
  <span v-if="deleted" class="text-sm text-muted-foreground">Deleted — and focus is back on the button that opened it.</span>

  <Dialog
    v-model:open="confirmOpen"
    title="Delete Ada's project"
    description="This cannot be undone."
  >
    Everything in the project goes with it: 12 tables, 3 saved filters, and every
    invite link you have shared.
    <template #footer>
      <Button variant="ghost" @click="confirmOpen = false">Cancel</Button>
      <Button variant="danger" @click="remove">Delete</Button>
    </template>
  </Dialog>

  <Dialog v-model:open="termsOpen" title="Terms of service" size="lg">
    <p v-for="n in 20" :key="n" class="!mt-0">
      Clause {{ n }}. Nothing here is a real term. It is here so the body has
      more content than the viewport, which is the only way to see that the body
      scrolls while the header, the close button and the footer stay put.
    </p>
  </Dialog>
</DemoBox>

Open either one and press <kbd>Tab</kbd> a few times: focus cycles inside the
dialog and does not reach the page behind it. <kbd>Esc</kbd> closes, clicking the
scrim closes, and focus returns to the button you opened it from — which is the
part that is easy to lose and very obvious to a keyboard user when it is missing.

The second dialog is long on purpose. The **body is the only scrolling region**,
so the title and the actions stay reachable no matter how much content there is.

## Anatomy

| Part    | Purpose                                                         |
| ------- | --------------------------------------------------------------- |
| Overlay | The scrim, at `z-overlay`. Clicking it closes, unless prevented |
| Surface | The dialog, at `z-modal` — above its own backdrop               |
| Header  | Title and description. Supplies the accessible name             |
| Close   | Always present, top right. Outside the header slot on purpose   |
| Body    | The only scrolling region                                       |
| Footer  | Actions. Rendered only when the slot is used                    |

## Props

<!-- @props DialogProps -->

| Prop           | Type                   | Default          | Description                                                                               |
| -------------- | ---------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `title`        | `string`               | **required**     | Accessible name, rendered as the heading.                                                 |
| `description`  | `string`               | —                | Supporting text under the title, wired to `aria-describedby`.                             |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`           | Width preset. Height is content-driven, capped to the viewport.                           |
| `preventClose` | `boolean`              | `false`          | Blocks Escape and clicking the scrim, for a flow where dismissing by accident loses work. |
| `closeLabel`   | `string`               | `'Close dialog'` | Accessible name for the close button.                                                     |
| `class`        | `string`               | —                | Additional classes for the dialog surface, merged so a consumer's utility wins.           |

<!-- /@props -->

### v-model

| Model          | Type      | Default | Description |
| -------------- | --------- | ------- | ----------- |
| `v-model:open` | `boolean` | `false` | Visibility  |

### Slots

| Slot      | Description                                             |
| --------- | ------------------------------------------------------- |
| `default` | Body content. Scrolls if it needs to                    |
| `header`  | Replaces the title row. `title` still supplies the name |
| `footer`  | Actions. Cancel first, primary last                     |

## When to use

- A decision that has to be made before anything else can continue.
- A short form whose result changes the page behind it.
- A destructive confirmation.

## When not to use

- **For anything the page could show inline.** A modal interrupts. If the user
  can keep working around it, it should not be a dialog.
- **For a dialog that opens a dialog.** Reka supports stacking; rowkit
  discourages it. Two modals deep is almost always a design smell — sequence the
  steps, or use one dialog with stages.
- **For notifications.** Nothing the user did not ask for should trap their
  focus. That is `Toast`.
- **For long forms.** A dialog is a poor container for anything that needs
  scrolling _and_ careful review. Use a page.
- **For hover-triggered content.** That is a `Tooltip`, or a popover — which is
  deliberately not in v1.

## Design decisions

**`title` is a required prop, not just a slot.** A slot-only title makes the
accessible name optional in practice, and optional means missing. This way
`aria-labelledby` is always wired; `#header` customises the presentation without
being able to break the contract — replace it and the title is still rendered,
visually hidden, for the name.

**Controlled only.** `v-model:open`, no internal state, no template ref with an
`.open()` method. Same doctrine as the data layer: the consumer owns state. It
also makes "close on successful submit" a one-line flip of your own ref.

**`preventClose` never removes the close button.** It blocks Escape and the
scrim, for a flow where accidental dismissal loses work. A dialog with no exit
is hostile, so the button stays — even when `#header` is replaced, because the
close control lives outside that slot.

**Only the body scrolls.** Header and footer are fixed rows. A dialog that
scrolls as a whole pushes its own Save button off-screen, which is where "where
did the button go" comes from.

**No `DialogConfirm` convenience wrapper.** Tempting and deferred — it is in
`ROADMAP.md` under "Considered, not planned".

## Keyboard

| Key                  | Action                                                |
| -------------------- | ----------------------------------------------------- |
| <kbd>Escape</kbd>    | Closes, unless `preventClose`                         |
| <kbd>Tab</kbd>       | Cycles within the dialog; nothing behind is reachable |
| <kbd>Shift+Tab</kbd> | Cycles backwards, same containment                    |

Focus moves into the dialog on open and **returns to the trigger on close** —
both from Reka, both covered by interaction tests, because losing the trigger is
the classic bug.

## Accessibility

**The rest of the page is hidden, not just visually.** Reka applies `aria-hidden`
to siblings rather than relying on `aria-modal`, which is the more robust of the
two — `aria-modal` alone is inconsistently honoured by screen readers.

**No dangling description.** With no `description`, `aria-describedby` is set to
an empty string rather than pointing at an element that was never rendered. Some
readers announce a broken reference as a blank.

**Motion is ambient here**, so enter and exit are gated behind `motion-safe:` and
collapse to instant show/hide under `prefers-reduced-motion`. The animations are
keyframes rather than transitions because Reka decides when to unmount a closing
overlay by watching for a running animation — with reduced motion there is none,
and it unmounts immediately, which is the wanted behaviour.

## Under SSR

Portals do not exist server-side, and Reka defers the teleport until the client,
so `Dialog` needs nothing extra in Nuxt. In tests this is why the dialog is not
in the document synchronously after mount — two ticks are needed.

You do **not** need a VueUse SSR-width plugin; see
[installation](../installation.md#overlays-under-ssr) for why.

## One thing to check yourself

**Scroll-lock layout shift.** Locking scroll by removing the scrollbar shifts the
page sideways on any platform where the scrollbar takes space — Windows, Linux,
macOS with an external mouse. macOS overlay scrollbars hide it completely.

The `Overlay/Dialog/Scroll Lock` story exists for this. Its interaction test
asserts `clientWidth` is unchanged, which catches the measurable half; the visual
half needs looking at on a platform with real scrollbars, or with
**System Settings → Appearance → Show scroll bars: Always**.

## Dark mode

The scrim is `neutral-950/50` in both themes — a scrim is a dimming layer, not a
surface, so it does not flip. Everything else uses `surface`, `border` and `text`
tokens and follows the theme.
