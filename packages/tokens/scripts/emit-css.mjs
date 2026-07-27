// Writes dist/tokens.css from the built token bundle.
//
// The generator itself lives in src/css.ts so it is typed and unit-tested; this
// script is only the file-writing shell around it.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildThemeCss } from '../dist/index.js'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
await mkdir(distDir, { recursive: true })
const target = join(distDir, 'tokens.css')
await writeFile(target, buildThemeCss(), 'utf8')
console.log(`tokens.css written to ${target}`)
