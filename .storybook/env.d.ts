// Vite resolves a side-effect CSS import at build time; TypeScript needs to be
// told the module exists.
declare module '*.css'
