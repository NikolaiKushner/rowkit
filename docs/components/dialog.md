# Dialog

**Stage:** 🟢 Stable

A modal dialog built on Reka UI's `Dialog`. Focus trap, focus restore, scroll
lock and background inerting come from the primitive. You place the parts;
the portal, the scrim, and the close button live inside `DialogContent`.

```vue
<Dialog v-model:open="open">
  <DialogTrigger as-child>
    <Button variant="destructive">Delete project</Button>
  </DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Delete project</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogBody>Everything in the project goes with it.</DialogBody>
    <DialogFooter>
      <Button variant="ghost" @click="open = false">Cancel</Button>
      <Button variant="destructive" @click="remove">Delete</Button>
    </DialogFooter>
  </DialogContent>
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
  <Dialog v-model:open="confirmOpen">
    <DialogTrigger as-child>
      <Button variant="destructive">Delete project</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Ada's project</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        Everything in the project goes with it: 12 tables, 3 saved filters, and every
        invite link you have shared.
      </DialogBody>
      <DialogFooter>
        <Button variant="ghost" @click="confirmOpen = false">Cancel</Button>
        <Button variant="destructive" @click="remove">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="termsOpen">
    <DialogTrigger as-child>
      <Button variant="outline">Read the terms</Button>
    </DialogTrigger>
    <DialogContent size="lg">
      <DialogHeader>
        <DialogTitle>Terms of service</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p v-for="n in 20" :key="n" class="!mt-0">
          Clause {{ n }}. Nothing here is a real term. It is here so the body has
          more content than the viewport, which is the only way to see that the body
          scrolls while the header, the close button and the footer stay put.
        </p>
      </DialogBody>
    </DialogContent>
  </Dialog>

<span v-if="deleted" class="text-sm text-muted-foreground">Deleted — and focus is back on the button that opened it.</span>
</DemoBox>

Open either one and press <kbd>Tab</kbd> a few times: focus cycles inside the
dialog and does not reach the page behind it. <kbd>Esc</kbd> closes, clicking the
scrim closes, and focus returns to the trigger — which is the
part that is easy to lose and very obvious to a keyboard user when it is missing.

The second dialog is long on purpose. The **body is the only scrolling region**,
so the title and the actions stay reachable no matter how much content there is.

## Anatomy

| Part                | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `Dialog`            | Root. Holds `v-model:open`. With no model, the trigger still toggles |
| `DialogTrigger`     | Opens the dialog. `as-child` turns your button into the trigger      |
| `DialogContent`     | Surface, plus the portal, the scrim, and the close button            |
| `DialogHeader`      | Title row. Does not scroll                                           |
| `DialogTitle`       | Accessible name (`aria-labelledby`)                                  |
| `DialogDescription` | Supporting text. Omit it and nothing is announced as a description   |
| `DialogBody`        | The only scrolling region                                            |
| `DialogFooter`      | Actions. Cancel first, primary last                                  |

## Props

`Dialog` itself takes no props. Visibility is `v-model:open`.

### v-model

| Model          | Type      | Default | Description                                                                 |
| -------------- | --------- | ------- | --------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `false` | Visibility. Optional — without it, the root holds the state for the trigger |

### DialogTrigger

<!-- @props DialogTriggerProps -->

| Prop      | Type                  | Default    | Description                                                               |
| --------- | --------------------- | ---------- | ------------------------------------------------------------------------- |
| `as`      | `string \| Component` | `'button'` | Element or component to render as. Defaults to a button.                  |
| `asChild` | `boolean`             | `false`    | Merge props onto the single child element instead of rendering a wrapper. |
| `class`   | `string`              | —          | Additional classes, merged so a consumer's utility wins.                  |

<!-- /@props -->

### DialogContent

<!-- @props DialogContentProps -->

| Prop           | Type                   | Default          | Description                                                                               |
| -------------- | ---------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`           | Width preset. Height is content-driven, capped to the viewport.                           |
| `preventClose` | `boolean`              | `false`          | Blocks Escape and clicking the scrim, for a flow where dismissing by accident loses work. |
| `closeLabel`   | `string`               | `'Close dialog'` | Accessible name for the close button.                                                     |
| `class`        | `string`               | —                | Additional classes for the dialog surface, merged so a consumer's utility wins.           |

<!-- /@props -->

### DialogHeader

<!-- @props DialogHeaderProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### DialogTitle

<!-- @props DialogTitleProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### DialogDescription

<!-- @props DialogDescriptionProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### DialogBody

<!-- @props DialogBodyProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### DialogFooter

<!-- @props DialogFooterProps -->

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

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

**The title is a part, not a prop.** `DialogTitle` is what `aria-labelledby`
points at. A required `title` prop used to survive a replaced header by
rendering a visually hidden copy; that hid the name from the person writing
the header. Place `DialogTitle` in the tree, and hide it yourself if the
visible heading is custom.

**The portal, the scrim, and the close button live inside `DialogContent`.**
They always travel together. A consumer who composes the header cannot
remove the exit, because the close button is not in the header.

**`v-model:open` is optional.** Bind it when the page opens or closes the
dialog — a successful submit is a one-line flip of your own ref. Leave it
unbound and the root holds the state, so `DialogTrigger` still toggles.

**`preventClose` never removes the close button.** It blocks Escape and the
scrim, for a flow where accidental dismissal loses work. A dialog with no exit
is hostile, so the button stays.

**Only `DialogBody` scrolls.** Header and footer are fixed rows. A dialog that
scrolls as a whole pushes its own Save button off-screen.

**No `DialogConfirm` convenience wrapper yet.** It is on the planned component
set in `ROADMAP.md`, not built.

## Keyboard

| Key                  | Action                                                |
| -------------------- | ----------------------------------------------------- |
| <kbd>Escape</kbd>    | Closes, unless `preventClose`                         |
| <kbd>Tab</kbd>       | Cycles within the dialog; nothing behind is reachable |
| <kbd>Shift+Tab</kbd> | Cycles backwards, same containment                    |

Focus moves into the dialog on open and **returns to the trigger on close** —
both from Reka, both covered by interaction tests, because losing the trigger is
the classic bug. The trigger has to be `DialogTrigger` for that return to have
somewhere to go.

## Accessibility

**The rest of the page is hidden, not just visually.** Reka applies `aria-hidden`
to siblings rather than relying on `aria-modal`, which is the more robust of the
two — `aria-modal` alone is inconsistently honoured by screen readers.

**No dangling description.** With no `DialogDescription`, `aria-describedby` is
set to an empty string rather than pointing at an element that was never
rendered. Some readers announce a broken reference as a blank.

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
