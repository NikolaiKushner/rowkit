import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 command button.
 *
 * Every state is drawn with a bevel, never with a colour change: the face
 * stays silver, and the shadow stack says raised, pressed or default. States
 * switch instantly — no transitions.
 *
 * ## Anatomy
 *
 * The root carries the face and the bevel. Inside it, `button-content` holds
 * the 1px that moves when the button is pressed: padded right and bottom at
 * rest, left and top while held, so the label shifts down-right without the
 * button changing size. Inside that, `button-focus` is the dotted focus ring,
 * which hugs the label rather than the whole face. Both are styled from the
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
    'bg-card font-sans text-ui text-foreground outline-none',
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
          'shadow-raised-default active:shadow-pressed',
          'disabled:shadow-raised aria-disabled:shadow-raised',
        ].join(' '),
        /** A plain raised button. Takes the black frame when focused. */
        secondary: 'shadow-raised focus-visible:shadow-raised-default active:shadow-pressed',
        /**
         * A flat toolbar button: no face until hovered, then a thin raised
         * bevel; a thin sunken one while held.
         */
        ghost: [
          'bg-transparent',
          'hover:bg-card hover:shadow-raised-thin',
          'active:bg-card active:shadow-status',
        ].join(' '),
        /** Raised, with a maroon label. Status is in the word too, never in colour alone. */
        destructive: [
          'text-danger-on-subtle shadow-raised',
          'focus-visible:shadow-raised-default active:shadow-pressed',
        ].join(' '),
        /** Blue underlined text that acts. Still a `<button>`; navigation is a real link. */
        link: 'bg-transparent text-link underline',
      },
      size: {
        xs: 'h-[17px] min-w-12 px-1.5',
        sm: 'h-[21px] min-w-16 px-2',
        default: 'h-[23px] min-w-[75px] px-3',
        lg: 'h-[27px] min-w-[88px] px-4',
        'icon-xs': 'size-5 p-0',
        'icon-sm': 'size-[22px] p-0',
        icon: 'size-6 p-0',
        'icon-lg': 'size-7 p-0',
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
 *
 * Kept out of the variant matrix because it is an ARIA state, not a prop
 * value: it applies whenever the attribute is there, whoever set it.
 */
export const buttonPressedState =
  'aria-pressed:bg-dither aria-pressed:shadow-pressed aria-pressed:hover:shadow-pressed'

/** The 1px that moves when the button is held down. */
export const buttonContentVariants = cva(
  [
    'flex min-w-0 items-center pr-px pb-px',
    'group-active/button:pt-px group-active/button:pr-0 group-active/button:pb-0 group-active/button:pl-px',
    'group-aria-pressed/button:pt-px group-aria-pressed/button:pr-0 group-aria-pressed/button:pb-0 group-aria-pressed/button:pl-px',
  ],
  {
    variants: {
      // A link does not press in.
      variant: {
        default: '',
        secondary: '',
        ghost: '',
        destructive: '',
        link: 'group-active/button:pt-0 group-active/button:pr-px group-active/button:pb-px group-active/button:pl-0',
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
    'group-focus-visible/button:outline-1 group-focus-visible/button:-outline-offset-1',
    'group-focus-visible/button:outline-ring group-focus-visible/button:outline-dotted',
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
