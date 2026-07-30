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

interface Timer {
  handle: ReturnType<typeof setTimeout>
  /** What is left to run when resumed after a pause. */
  remaining: number
  startedAt: number
}

const timers = new Map<string, Timer>()

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

function clearTimer(id: string): void {
  const timer = timers.get(id)
  if (timer === undefined) return
  clearTimeout(timer.handle)
  timers.delete(id)
}

function startTimer(id: string, duration: number): void {
  if (isServer() || duration <= 0) return
  clearTimer(id)
  timers.set(id, {
    handle: setTimeout(() => {
      dismiss(id)
    }, duration),
    remaining: duration,
    startedAt: Date.now(),
  })
}

/**
 * Timers belong to visible toasts only.
 *
 * A queued toast must not be counting down while off screen — it would arrive
 * already half-expired, or expire without ever being seen. Called after every
 * mutation, so a dismissal promotes the next toast and starts its clock then.
 */
function syncTimers(): void {
  const onScreen = new Set(visible.value.map((item) => item.id))

  for (const id of [...timers.keys()]) {
    if (!onScreen.has(id)) clearTimer(id)
  }

  for (const item of visible.value) {
    if (item.duration > 0 && !timers.has(item.id)) startTimer(item.id, item.duration)
  }
}

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
  syncTimers()
  return id
}

function dismiss(id: string): void {
  clearTimer(id)
  items.value = items.value.filter((item) => item.id !== id)
  syncTimers()
}

function dismissAll(): void {
  for (const id of [...timers.keys()]) clearTimer(id)
  items.value = []
}

/**
 * Stops the hovered toast's countdown.
 *
 * Dismissal mid-read is the classic toast failure: the user starts reading, the
 * timer runs out, and the message is gone. Only the hovered toast pauses —
 * freezing the whole queue would let one hover hold everything on screen.
 */
function pause(id: string): void {
  const timer = timers.get(id)
  if (timer === undefined) return
  clearTimeout(timer.handle)
  timers.set(id, {
    ...timer,
    remaining: Math.max(0, timer.remaining - (Date.now() - timer.startedAt)),
  })
}

/** Resumes with whatever was left, not from the beginning. */
function resume(id: string): void {
  const timer = timers.get(id)
  if (timer === undefined) return
  const item = items.value.find((candidate) => candidate.id === id)
  if (item === undefined) return
  startTimer(id, timer.remaining > 0 ? timer.remaining : item.duration)
}

/** Set by `Toaster`, so the limit lives with the thing that renders it. */
function setMax(value: number): void {
  max.value = Math.max(1, value)
  syncTimers()
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
  /** Pauses the hovered toast's countdown. Used by `Toaster`. */
  pause: (id: string) => void
  /** Resumes with the time that was left. Used by `Toaster`. */
  resume: (id: string) => void
  /** How many are visible at once. Set by `Toaster`. */
  setMax: (value: number) => void
}

/**
 * The toast API.
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
    pause,
    resume,
    setMax,
  }
}
