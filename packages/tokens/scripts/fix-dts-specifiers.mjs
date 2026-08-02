/**
 * Rewrites the relative specifiers in the emitted declarations to end in `.js`.
 *
 * `vite-plugin-dts` emits what the source says — `from './components/Badge'`,
 * `from './Badge.variants'` — and strips `.vue` down to `./Badge`. Under
 * `moduleResolution: node16` or `nodenext` in an ESM package, an extensionless
 * specifier and a directory import both fail to resolve, so types resolved for
 * anyone on `bundler` (Vite, Nuxt) and for nobody else. `attw` reports it as
 * "Internal resolution error"; consumers see the package as untyped.
 *
 * Rewriting after emit rather than in the source, because the source cannot say
 * `./Badge.js` — Vue's compiler needs the `.vue` specifier, and the `.js` name
 * only exists once the build has renamed it.
 *
 * The alternative, `rollupTypes: true`, needs `@microsoft/api-extractor` as a
 * dependency for something a regular expression over the emit already does.
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

/** Every `.d.ts` under `dist`, recursively. */
async function declarations(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await declarations(path)))
    else if (entry.name.endsWith('.d.ts')) found.push(path)
  }
  return found
}

const isDirectory = async (path) =>
  await stat(path)
    .then((s) => s.isDirectory())
    .catch(() => false)

let rewritten = 0
let files = 0

for (const file of await declarations(distDir)) {
  const source = await readFile(file, 'utf8')
  const parts = []
  let last = 0
  let changed = false

  // `from './x'` in an import, an export, or a type-only form.
  const pattern = /(\bfrom\s+)'(\.[^']*)'/g
  for (let m = pattern.exec(source); m !== null; m = pattern.exec(source)) {
    const [, keyword, specifier] = m
    let target = specifier

    if (!/\.(js|json|css)$/.test(specifier)) {
      // A directory import resolves through its own barrel; anything else is a
      // sibling module whose emitted name is the specifier plus `.js`.
      target = (await isDirectory(join(dirname(file), specifier)))
        ? `${specifier}/index.js`
        : `${specifier}.js`
    }

    if (target !== specifier) {
      parts.push(source.slice(last, m.index), `${keyword}'${target}'`)
      last = m.index + m[0].length
      changed = true
      rewritten += 1
    }
  }

  if (changed) {
    parts.push(source.slice(last))
    await writeFile(file, parts.join(''))
    files += 1
  }
}

console.log(`dts specifiers: rewrote ${rewritten} in ${files} file(s)`)
