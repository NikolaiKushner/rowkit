import { computed, ref, type ComputedRef } from 'vue'

/** Tone of a toast. Matches the semantic token families. */
export type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger'

/** An optional single action, rendered as a button inside the toast. */
export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /** Tone. */
  variant?: ToastVariant
  /**
   * Auto-dismiss delay in milliseconds. `0` never dismisses on its own.
   *
   * The countdown itself belongs to Reka's `ToastRoot`, which also pauses it
   * while the pointer is over that toast — this value is passed through.
   *
   * Use `0` whenever an `action` is attached. An undo that disappears at its
   * own pace is worse than no undo — see the WCAG note in the docs.
   */
  duration?: number
  /** A single action. Keep it to one; a toast is not a dialog. */
  action?: ToastAction
}

/** A toast in the queue. */
export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  duration: number
  action?: ToastAction
  /** Used to coalesce a duplicate fired twice in quick succession. */
  createdAt: number
}

const DEFAULT_DURATION = 5000
const DEFAULT_MAX = 3

/**
 * Two toasts with the same message inside this window are the same toast.
 *
 * Double-fired handlers are common — a submit that both awaits and catches, a
 * watcher that runs twice — and stacking identical messages makes the interface
 * look broken rather than informative.
 */
const COALESCE_WINDOW = 300

/**
 * Module-level state, deliberately.
 *
 * `toast()` has to work from a Pinia action or an API error handler, neither of
 * which has component context, so the queue cannot live in a provide/inject
 * tree. That is the standard shape for this and the reason for it.
 */
const items = ref<ToastItem[]>([])
const max = ref(DEFAULT_MAX)

let sequence = 0

/**
 * Module state on a server is shared between requests, so a `toast()` during SSR
 * would leak into somebody else's page. Nothing is queued server-side at all.
 *
 * Nothing is lost by that: a framework runs `setup` on both server and client,
 * so a call made during render happens again during hydration. Queuing on the
 * server would show it twice, not once.
 */
const isServer = (): boolean => typeof window === 'undefined'

/** Only the first `max` are on screen; the rest wait their turn, FIFO. */
const visible = computed(() => items.value.slice(0, max.value))

function add(message: string, options: ToastOptions = {}): string {
  const now = Date.now()

  // Rule 5: a duplicate inside the window is the same toast, not a second one.
  const duplicate = items.value.find(
    (item) => item.message === message && now - item.createdAt < COALESCE_WINDOW
  )
  if (duplicate !== undefined) return duplicate.id

  sequence += 1
  const id = `rk-toast-${String(sequence)}`

  const item: ToastItem = {
    id,
    message,
    variant: options.variant ?? 'neutral',
    duration: options.duration ?? DEFAULT_DURATION,
    createdAt: now,
    ...(options.action === undefined ? {} : { action: options.action }),
  }

  if (isServer()) return id

  items.value = [...items.value, item]
  return id
}

function dismiss(id: string): void {
  items.value = items.value.filter((item) => item.id !== id)
}

function dismissAll(): void {
  items.value = []
}

/** Set by `Toaster`, so the limit lives with the thing that renders it. */
function setMax(value: number): void {
  max.value = Math.max(1, value)
}

export interface UseToastReturn {
  /** Everything queued, visible or waiting. */
  items: ComputedRef<ToastItem[]>
  /** The first `max`, in order. What `Toaster` renders. */
  visible: ComputedRef<ToastItem[]>
  /** Shows a toast and returns its id. */
  toast: (message: string, options?: ToastOptions) => string
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  warning: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  danger: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
  /** How many are visible at once. Set by `Toaster`. */
  setMax: (value: number) => void
}

/**
 * The toast API.
 *
 * This owns the **queue** — how many are visible, what waits, what coalesces.
 * It deliberately owns no timers: `Toaster` renders each visible toast into a
 * Reka `ToastRoot`, which runs the countdown, pauses it on hover, and handles
 * swipe-to-dismiss. Re-implementing any of that here would be the thing hard
 * rule 2 exists to prevent, and a queued toast still cannot count down early
 * because it has no `ToastRoot` until it is on screen.
 *
 * Callable from anywhere, including outside a component — that is the whole
 * point of the module-level queue. Rendering happens in one `<Toaster />`
 * mounted once at the app root, so stacking stays coherent.
 *
 * ```ts
 * const { success, danger } = useToast()
 * success('Project archived')
 * danger('Could not save', { duration: 0, action: { label: 'Retry', onClick: retry } })
 * ```
 */
export function useToast(): UseToastReturn {
  return {
    items: computed(() => items.value),
    visible,
    toast: add,
    success: (message, options) => add(message, { ...options, variant: 'success' }),
    warning: (message, options) => add(message, { ...options, variant: 'warning' }),
    danger: (message, options) => add(message, { ...options, variant: 'danger' }),
    dismiss,
    dismissAll,
    setMax,
  }
}
