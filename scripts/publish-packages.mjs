/**
 * Publish the public workspace packages with npm, not `pnpm publish`.
 *
 * pnpm 11 publishes natively and no longer shells out to npm. That path does
 * not pick up npm's OIDC trusted publishing, and `pnpm publish --json` still
 * exits 0, so `changeset publish` records a release that never reached the
 * registry. `pnpm pack` still rewrites `workspace:` ranges. `npm publish` of
 * that tarball is what actually authenticates.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
/** Tokens first: rowkit depends on the version that is about to be published. */
const packageDirs = ['packages/tokens', 'packages/ui']

function readPackage(dir) {
  return JSON.parse(readFileSync(join(root, dir, 'package.json'), 'utf8'))
}

function isPublished(name, version) {
  try {
    execFileSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * `actions/setup-node` writes `_authToken=${NODE_AUTH_TOKEN}`. An explicit
 * token, even an empty one, makes npm skip the OIDC exchange trusted
 * publishing depends on.
 */
function dropEmptyAuthToken() {
  const userconfig = process.env.NPM_CONFIG_USERCONFIG
  if (!userconfig || process.env.NODE_AUTH_TOKEN) return
  let text
  try {
    text = readFileSync(userconfig, 'utf8')
  } catch {
    return
  }
  const next = text
    .split('\n')
    .filter((line) => !line.includes('_authToken=${NODE_AUTH_TOKEN}'))
    .join('\n')
  if (next !== text) writeFileSync(userconfig, next)
}

function tagExists(tag) {
  try {
    execFileSync('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`], {
      cwd: root,
      stdio: 'ignore',
    })
    return true
  } catch {
    return false
  }
}

dropEmptyAuthToken()

const dest = mkdtempSync(join(tmpdir(), 'rowkit-publish-'))
try {
  for (const dir of packageDirs) {
    const pkg = readPackage(dir)
    if (pkg.private) continue
    const label = `${pkg.name}@${pkg.version}`
    if (isPublished(pkg.name, pkg.version)) {
      console.log(`${label} is already on npm`)
      continue
    }

    const packed = execFileSync('pnpm', ['pack', '--pack-destination', dest], {
      cwd: join(root, dir),
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .at(-1)
    const tarball = packed?.startsWith('/') ? packed : join(dest, packed ?? '')

    execFileSync('npm', ['publish', tarball, '--access', 'public', '--provenance'], {
      cwd: root,
      stdio: 'inherit',
    })

    if (!tagExists(label)) {
      execFileSync('git', ['tag', label], { cwd: root, stdio: 'inherit' })
      console.log(`New tag: ${label}`)
    }
    console.log(`published ${label}`)
  }
} finally {
  rmSync(dest, { recursive: true, force: true })
}
