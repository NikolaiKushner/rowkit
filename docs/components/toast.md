# Toast

**Stage:** 🟢 Stable

A notification queue. Not really a component — a **service with a component
attached**: you call a toast into being from anywhere, and one `<Toaster />`
renders them all.

```ts
const { success, danger } = useToast()

success('Project archived')
danger('Could not save', {
  duration: 0,
  action: { label: 'Retry', onClick: retry },
})
```

```vue
<!-- Once, at the app root. -->
<Toaster />
```

<script setup>
import { useToast } from 'rowkit'

const { success, warning, danger, dismissAll } = useToast()

function retry() {
  success('Saved')
}
</script>

<DemoBox>
  <Button variant="secondary" @click="success('Project archived')">success</Button>
  <Button variant="secondary" @click="warning('Two seats left on this plan')">warning</Button>
  <Button
    variant="secondary"
    @click="danger('Could not save', { duration: 0, action: { label: 'Retry', onClick: retry } })"
  >danger, with an action</Button>
  <Button variant="secondary" @click="success('Project archived')">fire a duplicate</Button>
  <Button variant="ghost" @click="dismissAll()">dismiss all</Button>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</DemoBox>

Press **success** twice quickly: you get one toast, not two. Duplicates fired
inside the coalescing window collapse, because a retry loop that fires the same
message forty times should not produce forty toasts.

The **danger** one has `duration: 0` and never dismisses itself. Anything
carrying an action has to wait for the user — a toast that takes its own retry
button away after four seconds is worse than no toast.

Hover any toast and its timer pauses; move away and it resumes. That is Reka's
`ToastRoot`, not rowkit — the queue here owns no timers at all.

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

| Option     | Type                                              | Default     | Description              |
| ---------- | ------------------------------------------------- | ----------- | ------------------------ |
| `variant`  | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Tone                     |
| `duration` | `number`                                          | `5000`      | `0` never auto-dismisses |
| `action`   | `{ label, onClick }`                              | —           | One action, not several  |

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

**Everything is announced politely, including danger.** Reka's `foreground` type
maps to an assertive live region, which interrupts whatever a screen reader is
currently saying. That is for genuine emergencies. A user mid-sentence somewhere
else loses more from the interruption than from hearing "could not save" a moment
later, so **`role="alert"` is never used** and every toast is `background`.

**Toasts never steal focus.** Focus stays where the user left it. The action and
close buttons are reachable by <kbd>Tab</kbd> in document order.

**<kbd>F8</kbd> moves focus into the toast region**, which is Reka's affordance
and the reason the region is named "Notifications (F8)" — that label is how
anyone discovers the shortcut.

**The viewport is mounted before there is anything in it.** A live region added
at the same moment as its content is frequently not announced.

**Auto-dismiss and actions are in tension** (WCAG 2.2.1, Timing Adjustable): a
user may not reach the action within five seconds. Mitigated by hover-pause, a
generous default, and the recommendation below.

> **Use `duration: 0` whenever you attach an `action`.** An undo that vanishes at
> its own pace is worse than no undo.

### One known violation, scoped off

Reka's viewport renders focus guards — `aria-hidden` spans with `tabindex="0"` —
to catch <kbd>Tab</kbd> and route it into the toast region. They are focusable by
necessity and hidden from assistive technology by necessity, which is exactly
what axe's `aria-hidden-focus` forbids.

rowkit cannot reach the element, and rebuilding the viewport to avoid it is what
"build on the primitive" exists to prevent. The rule is disabled for `Toaster`'s
stories alone — that rule, that component — and should be reported upstream and
re-enabled when fixed. The guard is only focusable while toasts exist.

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

Enter and exit are ambient, so they are gated behind `motion-safe:` and collapse
to instant under `prefers-reduced-motion`. The travel is horizontal because every
position preset is anchored to a side edge; vertical entry would read as the
stack reordering itself.

## Dark mode

Each tone uses its `-subtle` / `-on-subtle` / `-border` trio, all of which flip
with the theme. Neutral sits on `surface` so it reads as a raised card rather
than a coloured alert.
