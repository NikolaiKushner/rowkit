import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The viewport. One per app, portalled to `<body>` at `z-toast` — above a modal,
 * because a "saved" confirmation has to be readable over an open dialog.
 *
 * `pointer-events-none` on the stack with `pointer-events-auto` on each toast:
 * the gaps between toasts must not swallow clicks on the page underneath.
 */
export const toasterViewportVariants = cva(
  'fixed z-toast flex max-h-screen w-full max-w-[332px] flex-col gap-2 p-4 pointer-events-none',
  {
    variants: {
      position: {
        // Toasts render newest first. At the top the newest sits lowest,
        // nearest the content; at the bottom it sits highest. Hence reversed
        // at the top and natural at the bottom.
        'top-right': 'top-0 right-0 flex-col-reverse',
        'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col-reverse',
        'bottom-right': 'bottom-0 right-0',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
      },
    },
    defaultVariants: { position: 'bottom-right' },
  }
)

/**
 * A toast is a small Windows 98 window: the silver face in a window bevel,
 * the same for every variant — the 16px icon is what says success, warning
 * or error. It appears and goes instantly; nothing slides.
 */
export const toastVariants = cva([
  'pointer-events-auto flex w-full items-start gap-2 bg-card py-2 pr-1 pl-2',
  'font-sans text-ui text-foreground shadow-window',
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-4',
  'focus-visible:outline-dotted focus-visible:outline-ring',
  // The swipe handler in Toaster.vue drives this custom property.
  'data-[swipe=move]:translate-x-(--rk-toast-swipe-x)',
  'data-[swipe=cancel]:translate-x-0',
])

/** The title, the message and the action, stacked. */
export const toastBodyVariants = cva('flex min-w-0 flex-1 flex-col items-start gap-1 break-words')

export const toastTitleVariants = cva('font-bold')

export const toastMessageVariants = cva('')

/** Space above the action button, so it does not crowd the text. */
export const toastActionVariants = cva('pt-0.5')

/**
 * The caption button: 16×14, raised, with the ✕ glyph. Held, it sinks and
 * the glyph moves 1px right and down.
 */
export const toastCloseVariants = cva([
  'inline-flex h-[14px] w-4 shrink-0 cursor-pointer items-center justify-center',
  'bg-card pr-px pb-px text-foreground shadow-raised',
  'active:pt-px active:pr-0 active:pb-0 active:pl-px active:shadow-pressed',
  'outline-none focus-visible:outline-1 focus-visible:outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
])

export type ToasterVariants = VariantProps<typeof toasterViewportVariants>
