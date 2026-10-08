import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A command button.
 *
 * In Windows 98 every state is drawn with a bevel, never with a colour change:
 * the face stays silver, and the shadow stack says raised, pressed or default.
 * States switch instantly. Every one of those is a token, so the modern theme
 * draws the same states its own way — a blue default button, a darker face
 * while held, a short transition — from the same classes.
 *
 * ## Anatomy
 *
 * The root carries the face and the bevel. Inside it, `button-content` holds
 * the 1px that moves when the button is pressed: padded right and bottom at
 * rest, left and top while held, so the label shifts down-right without the
 * button changing size. Inside that, `button-focus` is Windows 98's dotted
 * focus ring, which hugs the label rather than the whole face; a theme that
 * rings the whole button does it on the root instead (`buttonFocusOuter`).
 * Both are styled from the
 * root through the `group/button` name, so the root's own state (`:active`,
 * `:focus-visible`, `aria-pressed`) drives them.
 *
 * ## Disabled
 *
 * Grey label with a white copy 1px right and down (`text-shadow-disabled`).
 * The bevel stays. No opacity: Windows 98 never fades a control.
 */
export const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none',
    'rounded-md font-sans text-ui outline-none',
    'transition-[color,background-color,box-shadow] duration-(--rk-duration-control)',
    // An icon passed as a bare <svg> has no intrinsic size in a flex row and
    // collapses. Sized here so a caller never has to remember, and skipped when
    // the caller has already said what size they want.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'cursor-pointer',
    'disabled:pointer-events-none disabled:text-text-disabled disabled:text-shadow-disabled',
    'aria-disabled:pointer-events-none aria-disabled:text-text-disabled aria-disabled:text-shadow-disabled',
    // A button mid-request should not look clickable, but it must stay
    // focusable so a screen reader user is not thrown out of the form.
    'aria-busy:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        /**
         * The dialog's default button: Enter's target. The 1px black frame is
         * there at rest, not only on focus.
         */
        default: [
          'bg-control-primary text-control-primary-foreground shadow-raised-default',
          '[--rk-latched-fill:var(--color-control-primary-latched)]',
          'hover:bg-control-primary-hover',
          'active:bg-control-primary-active active:shadow-pressed',
          'disabled:bg-control disabled:shadow-raised aria-disabled:bg-control aria-disabled:shadow-raised',
        ].join(' '),
        /** A plain raised button. Takes the black frame when focused. */
        secondary: [
          'bg-control text-control-foreground shadow-raised hover:bg-control-hover',
          'focus-visible:shadow-raised-default active:bg-control-active active:shadow-pressed',
        ].join(' '),
        /**
         * A flat toolbar button: no face until hovered, then a thin raised
         * bevel; a thin sunken one while held.
         */
        ghost: [
          'bg-transparent text-control-foreground',
          'hover:bg-control-ghost-hover hover:shadow-raised-thin',
          'active:bg-control-ghost-active active:shadow-status',
          'aria-pressed:shadow-latched-ghost aria-pressed:hover:shadow-latched-ghost',
        ].join(' '),
        /** Raised, with a maroon label. Status is in the word too, never in colour alone. */
        destructive: [
          'bg-control text-danger-on-subtle shadow-raised hover:bg-control-hover',
          'focus-visible:shadow-raised-default active:bg-control-active active:shadow-pressed',
        ].join(' '),
        /**
         * Blue text that acts. Still a `<button>`; navigation is a real link.
         * Windows 98 underlines it always; a theme that does not
         * (`--rk-link-decoration: none`) still underlines it under the pointer
         * and on focus, so it reads as a link the moment it matters.
         */
        link: [
          'bg-transparent text-link [text-decoration-line:var(--rk-link-decoration)]',
          'hover:underline focus-visible:underline',
        ].join(' '),
      },
      size: {
        xs: 'h-control-xs min-w-button-min-xs px-button-px-xs',
        sm: 'h-control-sm min-w-button-min-sm px-button-px-sm',
        default: 'h-control-md min-w-button-min-md px-button-px-md',
        lg: 'h-control-lg min-w-button-min-lg px-button-px-lg',
        'icon-xs': 'size-icon-xs p-0',
        'icon-sm': 'size-icon-sm p-0',
        icon: 'size-icon-md p-0',
        'icon-lg': 'size-icon-lg p-0',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // A link is text: no face, no minimum width, no side padding.
      { variant: 'link', size: ['xs', 'sm', 'default', 'lg'], class: 'min-w-0 px-0' },
      // An icon has no label to grey out. Half opacity until the icon set has
      // disabled variants of its own.
      {
        size: ['icon-xs', 'icon-sm', 'icon', 'icon-lg'],
        class: 'disabled:[&_svg]:opacity-50 aria-disabled:[&_svg]:opacity-50',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      block: false,
    },
  }
)

/**
 * The toggled state (`aria-pressed="true"`): the pressed bevel over the
 * white-and-silver dither, the way Windows 98 drew a latched toolbar button.
 * `aria-current="page"` — the current page in a pager — is pressed in too,
 * without the dither.
 *
 * Kept out of the variant matrix because it is an ARIA state, not a prop
 * value: it applies whenever the attribute is there, whoever set it.
 */
export const buttonPressedState = [
  'aria-pressed:bg-dither aria-pressed:shadow-pressed aria-pressed:hover:shadow-pressed',
  // The current page of a pager: pressed in, but not latched — no dither.
  'aria-[current=page]:bg-control-latched',
  'aria-[current=page]:shadow-pressed aria-[current=page]:hover:shadow-pressed',
].join(' ')

/**
 * The ring a theme draws around the whole button when it is focused. Applied
 * by `Button` itself rather than kept in `buttonVariants`, because a button
 * rendered `as-child` has no label to ring and draws its own.
 */
export const buttonFocusOuter = 'focus-visible:focus-outer'

/** The pixel that moves when the button is held down (`--rk-press-shift`; none in a theme that does not shift). */
export const buttonContentVariants = cva(
  [
    'flex min-w-0 items-center pr-(--rk-press-shift) pb-(--rk-press-shift)',
    'group-active/button:pt-(--rk-press-shift) group-active/button:pr-0',
    'group-active/button:pb-0 group-active/button:pl-(--rk-press-shift)',
    'group-aria-pressed/button:pt-(--rk-press-shift) group-aria-pressed/button:pr-0',
    'group-aria-pressed/button:pb-0 group-aria-pressed/button:pl-(--rk-press-shift)',
    'group-aria-[current=page]/button:pt-(--rk-press-shift) group-aria-[current=page]/button:pr-0',
    'group-aria-[current=page]/button:pb-0 group-aria-[current=page]/button:pl-(--rk-press-shift)',
  ],
  {
    variants: {
      // A link does not press in.
      variant: {
        default: '',
        secondary: '',
        ghost: '',
        destructive: '',
        link: [
          'group-active/button:pt-0 group-active/button:pr-(--rk-press-shift)',
          'group-active/button:pb-(--rk-press-shift) group-active/button:pl-0',
        ].join(' '),
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

/**
 * The dotted focus ring around the label. An outline drawn 1px inward, so it
 * sits over the padding and the label does not move when focus arrives.
 */
export const buttonFocusVariants = cva(
  [
    'flex min-w-0 items-center gap-1',
    'group-focus-visible/button:focus-label group-focus-visible/button:-outline-offset-1',
    'group-focus-visible/button:outline-ring',
  ],
  {
    variants: {
      size: {
        xs: 'px-0.5 py-0',
        sm: 'px-0.5 py-px',
        default: 'px-0.5 py-px',
        lg: 'px-0.5 py-px',
        'icon-xs': 'p-0',
        'icon-sm': 'p-0',
        icon: 'p-px',
        'icon-lg': 'p-px',
      },
    },
    defaultVariants: { size: 'default' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
