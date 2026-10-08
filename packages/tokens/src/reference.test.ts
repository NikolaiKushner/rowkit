import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
// @ts-expect-error — a plain .mjs build script, untyped on purpose.
import { buildReferenceData } from '../scripts/generate-reference.mjs'
import { tokenReference } from './reference'
import { win98Vars } from './themes'

describe('tokenReference', () => {
  it('lists every variable a theme sets', () => {
    expect(tokenReference.map((t) => t.name)).toEqual(Object.keys(win98Vars))
  })

  it('describes every token — write a JSDoc comment beside the value', () => {
    const undescribed = tokenReference.filter((t) => !t.description).map((t) => t.name)
    expect(undescribed).toEqual([])
  })

  it('gives every token a value in all three looks', () => {
    for (const t of tokenReference) {
      expect(t.values.win98, t.name).toBeTruthy()
      expect(t.values.modernLight, t.name).toBeTruthy()
      expect(t.values.modernDark, t.name).toBeTruthy()
    }
  })

  it('is generated from the current source — run `pnpm --filter @rowkit/tokens docs:reference`', async () => {
    const committed = await readFile(new URL('./reference.data.ts', import.meta.url), 'utf8')
    expect(committed).toBe(await (buildReferenceData as () => Promise<string>)())
  })
})
