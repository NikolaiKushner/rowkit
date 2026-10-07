import { cva, type VariantProps } from 'class-variance-authority'
import { captionButtonClasses } from '../captionButton.variants'

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
  'pointer-events-auto flex w-full items-start gap-toast-gap rounded-lg bg-card py-toast-py pr-toast-pr pl-toast-pl',
  'font-sans text-ui text-foreground shadow-window',
  'motion-safe:animate-(--rk-animate-overlay-in)',
  'outline-none focus-visible:focus-ring focus-visible:-outline-offset-4',
  'focus-visible:outline-ring',
  // The swipe handler in Toaster.vue drives this custom property.
  'data-[swipe=move]:translate-x-(--rk-toast-swipe-x)',
  'data-[swipe=cancel]:translate-x-0',
])

/** The title, the message and the action, stacked. */
export const toastBodyVariants = cva(
  'flex min-w-0 flex-1 flex-col items-start gap-toast-body-gap break-words'
)

/** The status icon, 16px in Windows 98. */
export const toastIconVariants = cva('size-toast-icon shrink-0')

export const toastTitleVariants = cva('font-strong')

/** Under a title, the message is the muted second line; alone, it is the text. */
export const toastMessageVariants = cva('', {
  variants: {
    underTitle: { true: 'text-muted-foreground', false: '' },
  },
  defaultVariants: { underTitle: false },
})

/** Space above the action button, so it does not crowd the text. */
export const toastActionVariants = cva('pt-0.5')

/**
 * The caption button: the same 20×18 ✕ as a dialog's title bar. The modern
 * theme draws it as a grey disc with a muted ✕ instead of a traffic light.
 */
export const toastCloseVariants = cva([
  ...captionButtonClasses,
  'h-toast-close-h w-toast-close-w bg-toast-close text-toast-close-foreground shadow-toast-close',
  'focus-visible:outline-ring',
  '[&_svg]:opacity-100',
])

export type ToasterVariants = VariantProps<typeof toasterViewportVariants>
