// Vite resolves a side-effect CSS import at build time; TypeScript needs to be
// told the module exists.
declare module '*.css'

interface ImportMetaEnv {
  /** `win98` or `modern`: the theme the stories open in, overriding the default. */
  readonly VITE_RK_THEME?: string
  /** Vite's mode: `test` under Vitest, `development` or `production` otherwise. */
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
