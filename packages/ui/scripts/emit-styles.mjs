// Writes dist/styles.css — the stylesheet consumers import as `rowkit/styles`.
//
// It is src/styles/index.css plus one directive that can only be written
// against the shipped layout: an `@source` pointing at the built bundle.
//
// Tailwind v4 discovers class names by scanning files, and it skips
// node_modules. Without this, an app that imports rowkit gets the tokens but
// none of the utilities rowkit's own components use — the components render
// unstyled, and nothing reports an error. The path is relative to the
// stylesheet, so it only resolves once both files sit in dist/.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const stylesDir = join(packageDir, 'src/styles')
const ICONS_IMPORT = "@import './modern-icons.css';"
const index = await readFile(join(stylesDir, 'index.css'), 'utf8')
if (!index.includes(ICONS_IMPORT)) throw new Error(`index.css no longer has ${ICONS_IMPORT}`)

// The source keeps the modern theme's icons in their own generated file; the
// package ships one stylesheet, so they are inlined where they are imported.
const source = index.replace(
  ICONS_IMPORT,
  (await readFile(join(stylesDir, 'modern-icons.css'), 'utf8')).trim()
)

const css = `${source}
/*
 * Tailwind skips node_modules when scanning for class names. Registering the
 * bundle explicitly is what makes rowkit's own utilities get generated in a
 * consuming app.
 *
 * A glob, not a single file: the build emits one module per source file so
 * that a consumer importing one component does not pull every component's
 * class strings. The entry only re-exports and holds no classes of its own, so
 * pointing at it alone would generate nothing — silently, which is the failure
 * this directive exists to prevent.
 */
@source './**/*.js';
`

const distDir = join(packageDir, 'dist')
await mkdir(distDir, { recursive: true })
const target = join(distDir, 'styles.css')
await writeFile(target, css, 'utf8')
console.log(`styles.css written to ${target}`)
