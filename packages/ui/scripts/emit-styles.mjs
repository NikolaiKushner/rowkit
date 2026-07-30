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
const source = await readFile(join(packageDir, 'src/styles/index.css'), 'utf8')

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
