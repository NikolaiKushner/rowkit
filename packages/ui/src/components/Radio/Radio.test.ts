import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref, type Component } from 'vue'
import RawRadio from './Radio.vue'

const Radio = RawRadio as unknown as Component

const Group = defineComponent({
  components: { Radio },
  setup: () => ({ plan: ref<string>('free') }),
  template: `
    <div>
      <Radio v-model="plan" name="plan" value="free" label="Free" />
      <Radio v-model="plan" name="plan" value="pro" label="Pro" />
      <Radio v-model="plan" name="plan" value="team" label="Team" disabled />
      <output>{{ plan }}</output>
    </div>
  `,
})

describe('Radio', () => {
  it('is a native radio named by its label, grouped by name', () => {
    const el = mount(Group)
    const inputs = el.findAll('input')
    expect(inputs.map((i) => i.attributes('type'))).toEqual(['radio', 'radio', 'radio'])
    expect(inputs.every((i) => i.attributes('name') === 'plan')).toBe(true)
    expect(el.findAll('label').map((l) => l.text())).toEqual(['Free', 'Pro', 'Team'])
  })

  it('checks the option whose value matches v-model', () => {
    const el = mount(Group)
    const rows = el.findAll('[data-slot="radio"]')
    expect(rows.map((r) => r.attributes('data-state'))).toEqual([
      'checked',
      'unchecked',
      'unchecked',
    ])
    expect(el.findAll<HTMLInputElement>('input')[0]?.element.checked).toBe(true)
  })

  it('sets v-model to its value when chosen', async () => {
    const el = mount(Group)
    await el.findAll('input')[1]?.trigger('change')
    expect(el.find('output').text()).toBe('pro')
    expect(el.findAll('[data-slot="radio"]')[1]?.attributes('data-state')).toBe('checked')
  })

  it('disables one option without the rest', () => {
    const inputs = mount(Group).findAll('input')
    expect(inputs[2]?.attributes('disabled')).toBeDefined()
    expect(inputs[0]?.attributes('disabled')).toBeUndefined()
  })

  it('puts consumer attributes on the input', () => {
    const el = mount(Radio, { props: { value: 'a' }, attrs: { 'aria-label': 'Option A' } })
    expect(el.find('input').attributes('aria-label')).toBe('Option A')
  })
})
