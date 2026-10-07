// Vite resolves a side-effect CSS import at build time; TypeScript needs to be
// told the module exists.
declare module '*.css'

interface ImportMetaEnv {
  /** `modern` opens the stories in the modern theme; anything else, Windows 98. */
  readonly VITE_RK_THEME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
