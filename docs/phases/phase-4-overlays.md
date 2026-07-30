# Phase 4 — Overlays, in detail

**Components:** `Dialog`, `Toast`, `Tooltip`
**Estimated effort:** ~10h across 3 sessions
**Prerequisite:** Phase 3 complete. Tokens include z-index layers and motion durations (Phase 1); Button exists for dialog footers and toast actions.

Overlays are where hand-rolled component libraries quietly fail. Focus management, scroll locking, portal rendering, SSR hydration, touch behavior — each is a minefield with a decade of documented failure modes. This is the phase where "built on Reka UI" earns its keep: the primitives handle the treacherous parts, and rowkit's job is styling, API shape, and the opinions on top.

The rule for the phase: **if you find yourself writing focus-trap logic, stop.** Either the Reka primitive covers it and you missed it, or the design is wrong.

---

## Shared infrastructure — settle before the first component

Three cross-cutting concerns touch all three components. Decide them once, first.

### Teleport target and z-index

All overlays render through a portal to `<body>` — never inline, where `overflow: hidden` or `transform` on an ancestor silently breaks positioning.

- Stacking uses the Phase 1 z-index tokens, emitted under Tailwind v4's `--z-index-*` namespace (not `--z-*`, which generates no utility and no error). The shipped order is `base < sticky < dropdown < overlay < modal < popover < toast < tooltip`, spaced by 100.

  > **Corrected.** An earlier draft gave the chain as `dropdown < sticky < overlay < toast`. Sticky sits **below** dropdown — a menu opened from a toolbar has to paint over a pinned table header — and the draft omitted `modal`, `popover` and `tooltip` entirely. The three orderings this phase actually leans on: `overlay < modal` (surface above its own backdrop), `modal < popover` (a `Select` inside a `Dialog` must escape upward), and `modal < toast`. `packages/tokens/src/z-index.test.ts` now asserts all of them, so a token tweak cannot break Phase 4 silently.

- No component ever carries a hardcoded `z-index`. If a stacking bug appears, the fix is in the token scale, not a `9999` patch.
- Multiple dialogs stacking (dialog opens dialog) is _supported by Reka_ but **explicitly discouraged in rowkit docs** — the pattern is almost always a design smell. Document the alternative (sequence, or a single dialog with steps) instead of polishing the anti-pattern.

### SSR safety

Overlays are the components most likely to break under Nuxt SSR, for two reasons: portals don't exist server-side, and anything reading `window` at setup explodes.

- Reka handles deferred teleport mounting, but **verify each component in the Nuxt playground with JS disabled first paint** — hydration mismatch warnings in the console count as failures.
- **`provideSSRWidth` is not needed, and was checked rather than assumed.** The advice circulates for Reka-based apps; on Reka 2.10 the only viewport read anywhere in the dependency tree is `matchMedia('(pointer:coarse)')` in `utils/registry.js`, already guarded by a `typeof matchMedia === 'function'` check. Adding it would also mean taking `@vueuse/core` as a direct dependency for nothing — it is currently only a transitive dep of Reka. If a future Reka version introduces responsive behaviour that needs it, `docs/installation.md` has the section ready.
- The Reka API that _is_ SSR-relevant here is **`ConfigProvider`**: `useId` (hydration id stability), `scrollBody` (the scroll-lock behaviour Dialog depends on, and the hook for the layout-shift fix below), and `teleportTo` (a global portal target, which answers the teleport question above for shadow-DOM consumers). Audit these before writing Dialog.

### Motion

- All enter/leave transitions use Phase 1 motion tokens. Nothing animates with a literal `150ms`. The shipped scale is `--transition-duration-{instant,fast,normal,slow}` at 0/120/200/320ms with `--ease-{enter,exit,standard}` — direction lives in the easing, not in a separate in/out duration pair, so "150ms in, 100ms out" maps to `duration-normal ease-enter` and `duration-fast ease-exit`.
- **The reduced-motion rule is not "no animation".** An _ambient_ loop is gated behind `motion-safe:`. A loop that is the only signal something is happening — a spinner — stays, because gating it removes information rather than motion. Enter/leave transitions on overlays are ambient: they collapse to instant show/hide.
- `packages/ui/src/styles/motion.test.ts` is the gate. Any ungated `animate-*` in a component fails unless it is in that file's exemption list with a written reason, and the same test asserts `motion-safe:` really compiles to `prefers-reduced-motion: no-preference` — so the mechanism itself cannot rot. Overlays are covered the moment they are written; no per-component decorator to remember.

---

## 1. Dialog (~4h)

### API

```ts
interface DialogProps {
  /** Controlled visibility. v-model:open. */
  open: boolean
  /** Accessible title. Required — a dialog without a name is an a11y failure.
   *  Rendered in the header unless the header slot overrides it. */
  title: string
  /** Supporting text under the title. Also wired to aria-describedby. */
  description?: string
  /** Visual width preset. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Block closing via Escape / overlay click — for destructive-confirm flows.
   *  The close button remains. @default false */
  preventClose?: boolean
}

defineEmits<{
  'update:open': [open: boolean]
}>()
```

Slots: `default` (body), `#header` (replaces title row, title prop still feeds `aria-labelledby`), `#footer` (actions — the docs example is Cancel + primary Button, primary on the right).

### Design decisions worth stating in the PR

- **`title` is a required prop, not just a slot.** A slot-only title makes the accessible name optional in practice, and "optional" means "missing." Requiring the prop guarantees `aria-labelledby` is always wired; the header slot customizes presentation without breaking the contract.
- **Controlled-only.** `v-model:open`, no internal open state, no `ref` with an `.open()` method. Same doctrine as Phase 3: the consumer owns state. This also makes "close on successful submit" trivial — flip your own ref.
- **`preventClose` blocks Escape and overlay click but never removes the close button.** A dialog that traps the user with zero exit is hostile; the prop hardens accidental dismissal, not intentional exit.
- **No `DialogConfirm` convenience component in v1.** Tempting, deferrable, in ROADMAP's "Considered, not planned."

### What Reka provides — verify, don't rebuild

Focus trap while open; focus restore to the trigger on close; `role="dialog"` + `aria-modal`; Escape handling; scroll lock. Your work is checking each in the playground, not implementing them.

One thing Reka's scroll lock needs checked explicitly: **layout shift**. Locking scroll by removing the scrollbar shifts the page ~15px on scrollbar-visible platforms (Windows, Linux, macOS with external mouse). Verify Reka compensates with `scrollbar-gutter` or padding; if it doesn't on your version, the fix is a few lines of CSS on the lock — and a test on a page with a visible scrollbar, because macOS overlay scrollbars will hide the bug from you.

### Accessibility checklist (manual, beyond addon-a11y)

- Focus lands on the dialog (or first focusable) on open; returns to the trigger on close — test with keyboard only
- Tab and Shift+Tab cycle inside; nothing behind the overlay is reachable
- Escape closes (unless `preventClose`); overlay click closes (unless `preventClose`)
- Screen reader announces title and description on open (`aria-labelledby` + `aria-describedby` both wired)
- Background content is inert — Reka should apply `aria-hidden`/`inert` to siblings; verify in the DOM

### Done when

Standard DoD, plus: keyboard-only walkthrough recorded in the PR description; scroll-lock layout-shift verified on a visible-scrollbar platform; SSR check clean in the Nuxt playground; `preventClose` interaction test.

---

## 2. Toast (~4h)

The most architecturally interesting of the three, because it isn't really a component — it's a **service with a component attached**. Consumers don't render a toast; they call one into being from anywhere, including non-component code.

### Architecture: three pieces

```
useToast()      → the API consumers call: toast.success('Saved'), toast.dismiss(id)
toast state     → module-level queue (tiny store, no Pinia dependency)
<Toaster />     → renders the queue; mounted once at app root
```

This split is the standard shape (Sonner popularized it) and the reasons are practical: calling `toast()` from a Pinia action or an API error handler must work without component context, and rendering must live in one portal so stacking is coherent.

### API

```ts
interface ToastOptions {
  /** Visual + semantic tone. @default 'neutral' */
  variant?: 'neutral' | 'success' | 'warning' | 'danger'
  /** Auto-dismiss delay in ms. 0 disables — the toast stays until dismissed.
   *  @default 5000 */
  duration?: number
  /** Optional action button. */
  action?: { label: string; onClick: () => void }
}

interface UseToastReturn {
  toast: (message: string, options?: ToastOptions) => string // returns id
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  warning: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  danger: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}
```

`<Toaster />` props: `position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'` (default `bottom-right`), `max?: number` (default 3).

### Queue rules — write them down, then test them

Queues without explicit rules accumulate weird behavior. rowkit's rules:

1. At most `max` toasts visible; overflow waits FIFO and enters as slots free
2. New toasts enter at the position edge; existing ones shift, animated
3. **Hover pauses the auto-dismiss timer of the hovered toast** — dismissal mid-read is the classic toast failure. Timer resumes on leave
4. `duration: 0` never auto-dismisses (for danger toasts with actions — an undo that vanishes at its own pace is worse than none)
5. Duplicate message within ~300ms is coalesced, not stacked — protects against double-fire handlers by default

Each rule is an interaction test. Rule 3's test (hover, advance fake timers past duration, assert still present) is the one that catches real regressions.

### Accessibility — the part most toast libraries get wrong

- The Toaster container is a **polite live region**: `aria-live="polite"`, `role="status"` for neutral/success. Screen readers announce the message without interrupting.
- **Danger toasts do not automatically become `role="alert"`.** Assertive announcements interrupt whatever the user is doing; reserve that for genuine emergencies. Default everything to polite; document the reasoning.
- Toasts must not steal focus — ever. The action button is reachable by Tab in DOM order, but nothing moves focus on toast entry.
- Auto-dismiss + action is a WCAG tension (2.2.1 Timing Adjustable): a user may not reach the action in 5s. Mitigations shipped: hover-pause, generous default, `duration: 0` documented as the recommendation whenever an action is attached.

### SSR note

The toast queue is module-level state → on the server it must be per-request-safe. Simplest correct answer: `<Toaster />` is client-only (`<ClientOnly>` in Nuxt docs example), and `toast()` calls before client mount are queued, not dropped. Test: call `toast()` in `onMounted` of a page component and confirm it renders post-hydration.

### Done when

Standard DoD, plus: the five queue rules each covered by an interaction test; live-region semantics verified with VoiceOver once (note it in the PR); position variants in stories; client-only SSR behavior confirmed in the playground.

---

## 3. Tooltip (~2h)

The smallest component and the easiest to over-build. rowkit's tooltip is for **labels, not content**.

### API

```ts
interface TooltipProps {
  /** Tooltip text. Plain string only — no slot for rich content, by design. */
  content: string
  /** Preferred placement; flips automatically on collision. @default 'top' */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** Delay before showing, ms. @default 300 */
  delay?: number
  /** Disable without unwrapping the trigger. @default false */
  disabled?: boolean
}
```

Slot: `default` — the trigger element.

### The design opinion: string-only content

No default-slot-for-HTML, no interactive children, no headings inside. If it needs a link or a button, it's a _popover_ — a different component with different focus semantics, and one that's deliberately **not in v1** (ROADMAP, "Considered, not planned"). Rich hover-cards are where tooltip a11y goes to die: an interactive element inside a hover-triggered, focus-less container is unreachable by keyboard by construction.

Enforcing `content: string` in the type system closes the entire failure class. The docs "when not to use" section leads with this and points to Dialog for anything interactive.

### Behavior requirements

- **Opens on hover _and_ on keyboard focus** of the trigger — a hover-only tooltip is invisible to keyboard users. Reka handles this; verify it.
- `aria-describedby` links trigger → tooltip content (Reka wires it; check the DOM).
- Dismissible with Escape while visible, without moving focus (WCAG 1.4.13).
- Hoverable: moving the pointer from trigger onto the tooltip must not dismiss it (also 1.4.13).
- Delay on first open (`300ms`), **no delay when moving between adjacent tooltipped elements** — Reka's provider grace period covers the "toolbar sweep" case; expose the provider setup in docs for icon-bar consumers.
- Collision-aware placement: `placement` is a preference, flipping near viewport edges is automatic.

### Touch: the honest answer

Tooltips fundamentally don't work on touch — there is no hover. The spec'd behavior:

- Long-press shows the tooltip (Reka default where supported)
- **The docs say plainly: never put essential information in a tooltip.** If touch users must know it, it belongs in visible text, an accessible label, or a dialog. A tooltip is progressive enhancement.

That sentence in the docs is the correct engineering answer, and it also reads as someone who has shipped mobile UI.

### The trigger caveat

Tooltips wrapping _disabled_ buttons don't fire — disabled elements emit no pointer/focus events. This is the single most-asked tooltip question in every library's issues. Pre-empt it in docs: the pattern is `<span>` wrapper or `aria-disabled` styling instead of the `disabled` attribute, with a working example. One docs paragraph, dozens of future issues avoided.

### Done when

Standard DoD, plus: focus-open verified by keyboard test; Escape-dismiss test; 1.4.13 hoverable behavior verified manually; disabled-trigger pattern documented with example; touch behavior documented honestly.

---

## Cross-cutting for the phase

**Verification over implementation.** The recurring session shape is: wire the Reka primitive, style with tokens, then _audit_ the built-in behavior against the checklist. Finding a gap in Reka's handling is possible (version-dependent) — the response is a minimal patch plus a comment naming the Reka version, so it's removable later, not a parallel implementation.

**Keyboard-only pass on everything.** One full session segment at the end: unplug the mouse (literally), operate every overlay in the playground. Ten minutes, catches what no automated scan does.

**Z-index integration story.** One playground scene with everything at once: dialog open, toast firing over it, tooltip on a dialog button. This is the stacking test and it makes a good secondary portfolio clip.

**Changeset per component.** Three exit the phase.

---

## Session plan

| Session | Scope                                                                               | Exit          |
| ------- | ----------------------------------------------------------------------------------- | ------------- |
| 4.1     | Shared: z-index/teleport audit, motion decorator, Nuxt SSR plugin docs. Then Dialog | Dialog Stable |
| 4.2     | Toast: store + useToast + Toaster, queue rules, tests                               | Toast Stable  |
| 4.3     | Tooltip; keyboard-only pass on all three; stacking scene; SSR sweep in playground   | Phase done    |

---

## Phase Definition of Done

- [x] All three components 🟢 Stable per the standard checklist
- [x] Zero hydration warnings in the Nuxt playground for all three — measured with Playwright over `/`, `/users` and `/overlays`; console clean on every one
- [x] Nuxt setup docs updated — `docs/installation.md` covers the `<ClientOnly>` Toaster and records why the SSR-width plugin is _not_ needed; the disabled-trigger pattern is in `docs/components/tooltip.md`
- [x] Toast queue rules each covered by a test
- [ ] Keyboard-only walkthrough — **yours to do literally**; unplug the mouse and work `/overlays`
- [x] Stacking scene in the playground (`/overlays`)
- [x] Reduced-motion covered — see the note below
- [x] Three changesets; bundle budget green at 11.6 kB against 14 kB

### The stacking scene, measured

Toast fired from inside an open dialog, on the built Nuxt output:

| Layer          | Computed `z-index` |
| -------------- | ------------------ |
| Dialog overlay | 300                |
| Dialog surface | 400                |
| Toast viewport | 600                |

Those are the token values, unmodified. More usefully, `elementFromPoint` at the
centre of the toast returns the toast — it genuinely paints over the dialog,
which reading `z-index` alone would not prove, since a stacking context anywhere
up the tree could have trapped it.

### Reduced motion, differently than planned

The spec asked for "one shared story decorator emulating the preference, each
component with a story under it". Storybook has no way to emulate
`prefers-reduced-motion`, and a decorator that merely injects
`animation: none` tests a stylesheet we wrote rather than the media query.

What ships instead is stronger and needs no per-component discipline:
`packages/ui/src/styles/motion.test.ts` fails on any ungated `animate-*` in any
component, and separately asserts that `motion-safe:` still compiles to
`prefers-reduced-motion: no-preference` — so the mechanism itself cannot rot.
Each overlay also has a unit test walking its rendered classes. New overlays are
covered the moment they are written.

---

## Failure modes to watch

**Rebuilding what Reka provides.** Any focus-management, scroll-lock, or positioning code appearing in rowkit source is a red flag — stop and re-read the primitive's docs.

**Popover creep.** The moment tooltip content wants a slot, or Dialog wants an anchored non-modal variant, that's Popover asking to be born. It goes in "Considered, not planned," not in this phase.

**Toast feature accretion.** Promise-based toasts (`toast.promise(fetchThing())`), progress bars, custom render functions — all real Sonner features, all out of v1. The queue rules and four variants are the product.

**Skipping the visible-scrollbar test.** macOS overlay scrollbars hide the scroll-lock layout shift completely. Test on Windows, or force scrollbars on (System Settings → Appearance → Show scroll bars: Always) before calling Dialog done.
