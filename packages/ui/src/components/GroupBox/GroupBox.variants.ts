import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 group box, as in the Figma file: an etched frame whose top
 * line starts 6px down, the legend sitting on that line, and the content
 * 16px from the top and 12px from the other sides, 8px apart.
 *
 * Rendered as a `fieldset` by default, so the browser's own frame and legend
 * placement are reset here and drawn again.
 */
export const groupBoxVariants = cva([
  'relative m-0 flex min-w-0 flex-col gap-2 border-0 bg-card px-3 pt-4 pb-3',
  'font-sans text-ui text-foreground',
])

/** The etched groove, drawn as a layer so the legend can sit on its top line. */
export const groupBoxFrameVariants = cva(
  'pointer-events-none absolute inset-x-0 top-1.5 bottom-0 shadow-etched'
)

/** The legend: on the silver face, 2px either side, cutting the top line 8px in. */
export const groupBoxLegendVariants = cva(
  'absolute top-0 left-2 max-w-[calc(100%-1rem)] truncate bg-card px-0.5 py-0'
)

export type GroupBoxVariants = VariantProps<typeof groupBoxVariants>
