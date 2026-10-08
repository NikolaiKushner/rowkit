# Dialog

**Stage:** 🟢 Stable

A modal dialog. Focus trap, focus restore, scroll lock and background inerting
come from rowkit's shared primitives. You place the parts;
the portal, the outside-click layer, and the close button live inside
`DialogContent`.

<script setup>
import DialogBasic from '../examples/dialog/DialogBasic.vue'
import DialogConfirm from '../examples/dialog/DialogConfirm.vue'
import DialogForm from '../examples/dialog/DialogForm.vue'
import DialogPicker from '../examples/dialog/DialogPicker.vue'
import DialogWizard from '../examples/dialog/DialogWizard.vue'
import DialogProgress from '../examples/dialog/DialogProgress.vue'
import DialogScroll from '../examples/dialog/DialogScroll.vue'
import DialogSizes from '../examples/dialog/DialogSizes.vue'
</script>

<DemoBox>
  <DialogBasic />
</DemoBox>

<<< @/examples/dialog/DialogBasic.vue

Open it and press <kbd>Tab</kbd> a few times: focus cycles inside the dialog
and does not reach the page behind it. <kbd>Esc</kbd> closes, clicking outside
closes, and focus returns to the trigger — the part that is easy to lose and
very obvious to a keyboard user when it is missing.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### A confirmation

The Windows 98 system question: an icon, one sentence, two buttons. The safe
choice comes first and is the default button, so Enter never archives by
accident. `DialogDescription` is read out with the title when the dialog
opens.

<DemoBox>
  <DialogConfirm />
</DemoBox>

<<< @/examples/dialog/DialogConfirm.vue

### A form in a dialog

Edit a copy of the record: Cancel throws it away, Save writes it back. The
dialog's parts sit inside a real `<form>`, so Enter in any field saves through
the submit button, and a validation error keeps the dialog open.

<DemoBox>
  <DialogForm />
</DemoBox>

<<< @/examples/dialog/DialogForm.vue

### Choosing from a list

A picker: a single-select `DataTable` inside the dialog. The choice is pending
until OK, so Cancel leaves the old owner in place.

<DemoBox>
  <DialogPicker />
</DemoBox>

<<< @/examples/dialog/DialogPicker.vue

### A wizard

Several steps in one dialog, with the Windows 98 wizard buttons — < Back,
Next >, Finish and Cancel. Next stays disabled until the step is complete.

<DemoBox>
  <DialogWizard />
</DemoBox>

<<< @/examples/dialog/DialogWizard.vue

### Progress, opened from code

No trigger: the dialog opens from code when the job starts and closes when it
ends, and focus goes back to whatever had it. `prevent-close` blocks Escape and
outside clicks, so a stray key does not hide a running job; the ✕ — never
removed — and Cancel still stop it on purpose.

<DemoBox>
  <DialogProgress />
</DemoBox>

<<< @/examples/dialog/DialogProgress.vue

### Long content

The **body is the only scrolling region**, so the title and the buttons stay
reachable however much content there is.

<DemoBox>
  <DialogScroll />
</DemoBox>

<<< @/examples/dialog/DialogScroll.vue

### Sizes

`size` on `DialogContent` sets the width — 320, 440 or 600px; the height
follows the content, capped to the screen.

<DemoBox>
  <DialogSizes />
</DemoBox>

<<< @/examples/dialog/DialogSizes.vue

## Anatomy

| Part                | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `Dialog`            | Root. Holds `v-model:open`. With no model, the trigger still toggles  |
| `DialogTrigger`     | Opens the dialog. `as-child` turns your button into the trigger       |
| `DialogContent`     | Window, plus the portal, the outside-click layer, the title bar and ✕ |
| `DialogHeader`      | What sits under the title bar: description, eyebrow. Does not scroll  |
| `DialogTitle`       | Accessible name (`aria-labelledby`), drawn in the title bar           |
| `DialogDescription` | Supporting text. Omit it and nothing is announced as a description    |
| `DialogBody`        | The only scrolling region                                             |
| `DialogFooter`      | Command buttons, right-aligned. The default button first in the code  |

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

| Prop           | Type                   | Default          | Description                                                                                        |
| -------------- | ---------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`           | Width preset. Height is content-driven, capped to the viewport.                                    |
| `preventClose` | `boolean`              | `false`          | Blocks Escape and clicking outside the window, for a flow where dismissing by accident loses work. |
| `closeLabel`   | `string`               | `'Close dialog'` | Accessible name for the close button.                                                              |
| `class`        | `string`               | —                | Additional classes for the dialog surface, merged so a consumer's utility wins.                    |

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
- **For a dialog that opens a dialog.** Stacking works — Escape closes only the
  top one — but rowkit discourages it. Two modals deep is almost always a design smell — sequence the
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

**The portal, the outside-click layer, and the close button live inside `DialogContent`.**
They always travel together. A consumer who composes the header cannot
remove the exit, because the close button is not in the header.

**The title sits in the title bar.** `DialogContent` draws the navy bar with
the ✕ at its right end; `DialogTitle` stays where you place it in the header
but is laid over the bar, bold and white, cut off with an ellipsis before the
✕. Anything else in the header — a description, an eyebrow — starts below
the bar.

In the modern theme the bar is the window's light grey title bar: the title
centred, the ✕ a red traffic light at its left end. The footer shows the
default button last, on the right (`--rk-footer-direction`), while the code
keeps it first, so one footer reads right in both themes.

**`v-model:open` is optional.** Bind it when the page opens or closes the
dialog — a successful submit is a one-line flip of your own ref. Leave it
unbound and the root holds the state, so `DialogTrigger` still toggles.

**`preventClose` never removes the close button.** It blocks Escape and
clicking outside, for a flow where accidental dismissal loses work. A dialog
with no exit is hostile, so the ✕ stays enabled — a deliberate departure from
the Figma file, which draws it disabled here.

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

Focus opens on **the first control after the title bar**: the first field of a
form, or the default button, which leads the footer. The ✕ takes it only when
the dialog has nothing else to focus.

**A dialog opened from a dialog** turns the one underneath inactive: its title
bar goes grey until the one on top closes, as a Windows 98 owner window does.
A Select or Tooltip opened from the dialog does not — a window stays active
while its own drop-down list is open.

Focus moves into the dialog on open and **returns to the trigger on close** —
both covered by interaction tests, because losing the trigger is
the classic bug. The trigger has to be `DialogTrigger` for that return to have
somewhere to go.

## Accessibility

**The rest of the page is hidden, not just visually.** The dialog applies
`aria-hidden` to siblings, leaving `aria-live` regions such as toasts audible, rather than relying on `aria-modal`, which is the more robust of the
two — `aria-modal` alone is inconsistently honoured by screen readers.

**No dangling description.** With no `DialogDescription`, `aria-describedby` is
set to an empty string rather than pointing at an element that was never
rendered. Some readers announce a broken reference as a blank.

**No motion, no backdrop, in Windows 98.** The window appears and goes
instantly, as Windows 98 drew it. Nothing is drawn behind it either: an
invisible layer catches the click outside and holds the scroll lock, and the
page stays as it was. In the modern theme the same layer dims the page, and
the window fades and grows in over 160ms — `motion-safe:` only, so it is
instant for anyone who has asked for reduced motion.

## Under SSR

Portals do not exist server-side, and the dialog teleports only after it mounts
on the client,
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
