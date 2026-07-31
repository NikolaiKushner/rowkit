/**
 * Types for the props-table generator.
 *
 * The generator itself is plain JS: it runs under bare `node` as a build step,
 * with no compile ahead of it. This file exists so `src/props-docs.test.ts` can
 * import it without escaping the type system, which hard rule 7 forbids.
 */

/** One markdown table per exported `*Props` interface, keyed by its name. */
export declare function buildPropsTables(): Promise<Map<string, string>>

/**
 * Fills every `<!-- @props Name -->` block in a page, returning the new text
 * already run through Prettier.
 */
export declare function injectTables(
  markdown: string,
  tables: Map<string, string>,
  filepath: string,
  onMissing?: (name: string) => void
): Promise<string>

/** The docs pages carrying at least one marker, with their current text. */
export declare function readDocPages(): Promise<{ path: string; content: string }[]>
