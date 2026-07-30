import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The viewport. One per app, portalled to `<body>` at `z-toast` — above a modal,
 * because a "saved" confirmation has to be readable over an open dialog.
 *
 * `pointer-events-none` on the stack with `pointer-events-auto` on each toast:
 * the gaps between toasts must not swallow clicks on the page underneath.
 */
export const toasterViewportVariants = cva(
  'fixed z-toast flex max-h-screen w-full max-w-sm flex-col gap-2 p-4 pointer-events-none',
  {
    variants: {
      position: {
        'top-right': 'top-0 right-0',
        'top-center': 'top-0 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-0 right-0 flex-col-reverse',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse',
      },
    },
    defaultVariants: { position: 'bottom-right' },
  }
)

export const toastVariants = cva(
  [
    'pointer-events-auto flex items-start gap-3 rounded-md border p-4 shadow-lg',
    'motion-safe:data-[state=open]:animate-toast-in',
    'motion-safe:data-[state=closed]:animate-toast-out',
    // Reka drives the swipe with a transform custom property.
    'data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x)',
    'data-[swipe=cancel]:translate-x-0',
  ],
  {
    variants: {
      variant: {
        neutral: 'border-border bg-surface text-text',
        success: 'border-success-border bg-success-subtle text-success-on-subtle',
        warning: 'border-warning-border bg-warning-subtle text-warning-on-subtle',
        danger: 'border-danger-border bg-danger-subtle text-danger-on-subtle',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
)

export const toastMessageVariants = cva('min-w-0 flex-1 text-sm')

export const toastActionVariants = cva([
  'shrink-0 cursor-pointer rounded-sm text-sm font-medium underline underline-offset-2',
  'transition-opacity duration-fast ease-standard hover:opacity-80',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
])

export const toastCloseVariants = cva([
  'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-xs',
  'opacity-60 transition-opacity duration-fast ease-standard hover:opacity-100',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
])

export type ToasterVariants = VariantProps<typeof toasterViewportVariants>
