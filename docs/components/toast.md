# Toast

**Stage:** 🟢 Stable

A notification queue. Not really a component — a **service with a component
attached**: you call a toast into being from anywhere, and one `<Toaster />`
renders them all.

<script setup>
import ToastBasic from '../examples/toast/ToastBasic.vue'
import ToastVariants from '../examples/toast/ToastVariants.vue'
import ToastTitle from '../examples/toast/ToastTitle.vue'
import ToastUndo from '../examples/toast/ToastUndo.vue'
import ToastAsync from '../examples/toast/ToastAsync.vue'
</script>

<!-- Lifted clear of this site's 28px taskbar, as an app lifts it clear of its own footer. -->
<ClientOnly>
  <Toaster class="bottom-7" />
</ClientOnly>

<DemoBox>
  <ToastBasic />
</DemoBox>

<<< @/examples/toast/ToastBasic.vue

Call `useToast()` from any component; one `<Toaster />`, mounted once at the
app root, shows every toast. This page mounts one, and the examples below all
send to it.

Press a button twice quickly: you get one toast, not two. Duplicates fired
inside the coalescing window collapse, because a retry loop that fires the same
message forty times should not produce forty toasts. Hover any toast and its
timer pauses; move away and it resumes.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Variants

`toast()` for news, `success`, `warning` and `danger` for outcomes. Each draws
its own icon; colour never carries the meaning alone. `dismissAll()` clears the
queue.

<DemoBox>
  <ToastVariants />
</DemoBox>

<<< @/examples/toast/ToastVariants.vue

### With a title

A bold `title` over the message, for a toast that needs both.

<DemoBox>
  <ToastTitle />
</DemoBox>

<<< @/examples/toast/ToastTitle.vue

### Undo instead of «Are you sure?»

Act at once and offer the way back. A longer `duration` leaves time to read
the toast and reach Undo.

<DemoBox>
  <ToastUndo />
</DemoBox>

<<< @/examples/toast/ToastUndo.vue

### Saving, and retrying a failure

Success for the outcome, `danger` with `duration: 0` and a Retry action when
it fails. A toast that carries an action waits for the person — one that takes
its own retry button away after four seconds is worse than no toast. This one
fails every other time, so press it twice.

<DemoBox>
  <ToastAsync />
</DemoBox>

<<< @/examples/toast/ToastAsync.vue

## The three pieces

| Piece        | Role                                                      |
| ------------ | --------------------------------------------------------- |
| `useToast()` | The API you call. Works outside a component               |
| The queue    | Module-level. What is visible, what waits, what coalesces |
| `<Toaster/>` | Renders the queue. Mounted once, portalled to `<body>`    |

The split exists because `toast()` has to work from a Pinia action or an API
error handler, neither of which has component context — so the queue cannot live
in a provide/inject tree. Rendering stays in one place so stacking is coherent.

## `useToast()`

| Method                    | Returns  | Notes            |
| ------------------------- | -------- | ---------------- |
| `toast(message, options)` | `string` | The toast's id   |
| `success(message, opts)`  | `string` | Same, tone fixed |
| `warning(message, opts)`  | `string` |                  |
| `danger(message, opts)`   | `string` |                  |
| `dismiss(id)`             | —        |                  |
| `dismissAll()`            | —        |                  |

### `ToastOptions`

| Option     | Type                                              | Default                  | Description              |
| ---------- | ------------------------------------------------- | ------------------------ | ------------------------ |
| `variant`  | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'`              | Tone, shown by the icon  |
| `title`    | `string`                                          | —                        | Bold first line          |
| `duration` | `number`                                          | `5000`, `0` for `danger` | `0` never auto-dismisses |
| `action`   | `{ label, onClick }`                              | —                        | One action, not several  |

## `<Toaster />`

<!-- @props ToasterProps -->

| Prop         | Type                                                               | Default          | Description                                                                                                 |
| ------------ | ------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `position`   | `'top-right' \| 'top-center' \| 'bottom-right' \| 'bottom-center'` | `'bottom-right'` | Which corner or edge the stack grows from.                                                                  |
| `max`        | `number`                                                           | `3`              | How many toasts are on screen at once. The rest wait, FIFO.                                                 |
| `label`      | `string`                                                           | `'Notification'` | Announced by a screen reader before each toast, to associate the interruption with the notification region. |
| `closeLabel` | `string`                                                           | `'Dismiss'`      | Accessible name for each toast's close button.                                                              |
| `class`      | `string`                                                           | —                | Additional classes for the viewport, merged so a consumer's utility wins.                                   |

<!-- /@props -->

Above a fixed footer or taskbar, lift the stack clear of it with a class —
this page uses `<Toaster class="bottom-7" />` for its 28px taskbar.

## When to use

- Confirming something the user did, when the result is not visible on screen.
- A recoverable failure, with an undo or a retry.
- Background progress finishing — an export, an import.

## When not to use

- **For anything the user must act on.** A toast disappears. If it cannot be
  missed, it is a `Dialog` or inline text.
- **For validation errors.** The error belongs next to the field. `Field`'s
  `error` does that, and it stays put.
- **For a result the page already shows.** A toast saying "row deleted" next to a
  table that visibly lost a row is noise.
- **In a queue of five.** If your app can produce that many at once, the problem
  is upstream. `max` caps the damage; it does not fix it.
- **For anything long.** One line. A toast is not a place to explain.

## The queue rules

Queues without written rules accumulate strange behaviour, so these are explicit
and each has a test.

1. **At most `max` are visible.** Overflow waits FIFO and enters as slots free.
   A waiting toast has no countdown at all — it cannot expire before it is seen.
2. **New toasts enter at the anchored edge**, and existing ones shift.
3. **Hovering a toast pauses its countdown**, and only that one. Freezing the
   whole queue would let a single hover hold everything on screen. Dismissal
   mid-read is the classic toast failure.
4. **`duration: 0` never auto-dismisses**, and does not block the queue behind
   it.
5. **A duplicate message within 300ms is coalesced**, not stacked. Double-fired
   handlers are common — a submit that both awaits and catches, a watcher that
   runs twice — and repeating an identical message makes the interface look
   broken.

## Accessibility

**Everything is announced politely, including danger.** An assertive live
region interrupts whatever a screen reader is currently saying. That is for
genuine emergencies. A user mid-sentence somewhere else loses more from the
interruption than from hearing "could not save" a moment later, so **`role="alert"`
is never used**. Announcements go through one persistent `role="status"` region,
written a frame after the toast appears.

**Toasts never steal focus.** Focus stays where the user left it. Toasts sit in
the document newest first, so <kbd>Tab</kbd> and a screen reader's reading order
both start at the one that just arrived.

**<kbd>F8</kbd> moves focus into the toast region**, which is why the region is
named "Notifications (F8)" — that label is how anyone discovers the shortcut.

**<kbd>Escape</kbd> closes the toast that holds focus**, and only then. Escape
pressed anywhere else belongs to what the user is in — it closes a dialog, not
the notifications. When a focused toast closes, focus moves to the region rather
than falling to the page.

**Clicking a toast does not close an open dialog.** The region is a branch of
every layer, so an interaction there is never "outside".

**The viewport is mounted before there is anything in it.** A live region added
at the same moment as its content is frequently not announced.

**Auto-dismiss and actions are in tension** (WCAG 2.2.1, Timing Adjustable): a
user may not reach the action within five seconds. Mitigated by hover-pause, a
generous default, and the recommendation below.

> **Use `duration: 0` whenever you attach an `action`.** An undo that vanishes at
> its own pace is worse than no undo.

## Under SSR

`<Toaster />` is client-only in Nuxt:

```vue
<ClientOnly>
  <Toaster />
</ClientOnly>
```

**Calls made during server rendering are ignored, not queued.** Module state on a
server is shared between requests, so a queued toast would leak into another
user's page. Nothing is lost: a framework runs `setup` on both server and client,
so a call made during render happens again during hydration — queuing on the
server would show it twice.

## Motion

In Windows 98 a toast appears and goes instantly; nothing slides. In the
modern theme it fades and grows in over 160ms. That entry is ambient, so it is
gated behind `motion-safe:` and collapses to instant under
`prefers-reduced-motion`. A toast leaves at once in both themes.

A toast is a small window: in Windows 98 the silver face in the window bevel,
the same for every variant, the 16px icon saying success, warning or error.
In the modern theme it is a white card with rounded corners and a soft shadow,
an 18px icon in the variant's colour, and the ✕ a small grey disc.
