/**
 * Types for the pixel-icon tool.
 *
 * The tool itself is plain JS so it runs under bare `node`. This file lets
 * `src/icons/icons.test.ts` import it without escaping the type system.
 */

/** The pixels a path of integer rectangles covers, as `"x,y"` keys; `null` for any other path. */
export declare function pixelsOf(d: string): Set<string> | null

/** One run per row of adjacent pixels, top to bottom, left to right. */
export declare function runsOf(pixels: Set<string>): string

/** Rewrites every pixel path in the markup as runs, refusing any change to the pixels. */
export declare function optimizeMarkup(markup: string): string
