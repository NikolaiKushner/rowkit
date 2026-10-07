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
  'relative isolate m-0 flex min-w-0 flex-col gap-2 border-0 bg-groupbox-face px-3 pt-groupbox-pt pb-3',
  'font-sans text-ui text-foreground',
])

/** The etched groove, drawn as a layer so the legend can sit on its top line. */
export const groupBoxFrameVariants = cva(
  'pointer-events-none absolute inset-x-0 top-groupbox-top bottom-0 -z-1 rounded-lg bg-groupbox shadow-etched'
)

/** The legend: on the silver face, 2px either side, cutting the top line 8px in. */
export const groupBoxLegendVariants = cva(
  'absolute top-0 left-groupbox-legend-x max-w-[calc(100%-1rem)] truncate bg-groupbox-face px-groupbox-legend-px py-0'
)

export type GroupBoxVariants = VariantProps<typeof groupBoxVariants>
