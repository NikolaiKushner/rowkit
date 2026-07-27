import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { version } from './index'

describe('rowkit', () => {
  it('exports a version matching package.json', () => {
    expect(version).toBe(pkg.version)
  })
})
