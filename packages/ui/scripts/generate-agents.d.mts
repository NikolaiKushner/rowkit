/**
 * Types for the `AGENTS.md` generator.
 *
 * The generator itself is plain JS: it runs under bare `node` as a build step,
 * with no compile ahead of it. This file exists so `src/agents-doc.test.ts` can
 * import it without escaping the type system, which hard rule 7 forbids.
 */

/** Absolute path of the copy that ships inside the npm package. */
export declare const agentsPath: string

/** Absolute path of the copy the docs site renders. */
export declare const docsPath: string

/** The document body, before the per-destination front matter. */
export declare function buildAgentsBody(): Promise<string>

/** Both generated files, formatted, keyed by absolute path. */
export declare function buildAgentsFiles(): Promise<Map<string, string>>
