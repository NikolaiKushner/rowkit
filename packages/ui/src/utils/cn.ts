import { tokens } from '@rowkit/tokens'
import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * `tailwind-merge` resolves conflicts by mapping a class to a *group* — two
 * classes in the same group are contradictory, so the later one wins. It infers
 * those groups from Tailwind's default theme, which knows nothing about
 * rowkit's scales.
 *
 * The failure is silent and one-directional: `shadow-sm shadow-scroll-x`,
 * `z-dropdown z-modal`, `duration-fast duration-slow` and
 * `ease-standard ease-enter` all survive as *both* classes, and which one
 * actually applies then comes down to stylesheet order rather than to the
 * consumer's intent. That breaks hard rule 8 — a consumer's `class` has to be
 * able to override the component's.
 *
 * Colour and spacing utilities need no help: `tailwind-merge` groups
 * `bg-*`/`text-*`/`border-*` by shape, so `bg-surface` and `bg-primary-600`
 * already collide correctly.
 *
 * The scale names are read from the token package rather than listed here, so a
 * token added in Phase 1's source cannot fall out of this config.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: Object.keys(tokens.shadow) }],
      z: [{ z: Object.keys(tokens.zIndex) }],
      duration: [{ duration: Object.keys(tokens.motion.duration) }],
      ease: [{ ease: Object.keys(tokens.motion.easing) }],
    },
  },
})

/**
 * Joins class names and resolves Tailwind conflicts, last one winning.
 *
 * Every rowkit component runs its own variant classes and the incoming `class`
 * prop through this, which is what lets a consumer restyle a component without
 * fighting specificity or resorting to `!important`.
 *
 * @param inputs - Class values in any form `clsx` accepts: strings, arrays, or
 * objects whose truthy keys are included.
 * @returns The merged class string, with conflicting utilities removed.
 *
 * @example
 * ```ts
 * cn('rounded-md bg-primary-solid px-4', props.class)
 * // consumer passes 'px-6' -> 'rounded-md bg-primary-solid px-6'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
