/**
 * Types for the shared component-API extraction.
 *
 * The extractor is plain JS: it runs under bare `node` as a build step, with no
 * compile ahead of it. This file exists so tests can import it without escaping
 * the type system, which hard rule 7 forbids.
 */

/** Absolute path of the `packages/ui` directory. */
export declare const packageRoot: string

/** Absolute path of the repository root. */
export declare const repoRoot: string

/** Collapses a JSDoc comment to one line. */
export declare function summarise(comment: string, limit?: number): string

/** One entry per component, describing its public API. */
export declare function buildComponentApi(): Promise<
  Map<
    string,
    {
      component: string
      propsType: string
      props: {
        name: string
        type: string
        required: boolean
        default: string | undefined
        description: string
      }[]
      models: { name: string; type: string; description: string }[]
      events: { name: string; payload: string; description: string }[]
      slots: { name: string; props: string; description: string; dynamic?: boolean }[]
    }
  >
>
