import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { version } from './index'

/**
 * The version is now read from `package.json`, so drift is impossible by
 * construction — what this still catches is the import breaking, which would
 * leave the export `undefined` while the manifest keeps its version.
 */
describe('@rowkit/tokens', () => {
  it('exports a version matching package.json', () => {
    expect(version).toBe(pkg.version)
  })
})
