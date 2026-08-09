import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '../Button/Button.vue'
import ButtonGroup from './ButtonGroup.vue'

describe('ButtonGroup', () => {
  it('exposes role=group', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: '<button>A</button><button>B</button>' },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('data-slot')).toBe('button-group')
  })

  it('joins children on the horizontal axis by default', () => {
    const classes = mount(ButtonGroup, {
      slots: {
        default: `
          <Button variant="outline">Archive</Button>
          <Button variant="secondary">Report</Button>
        `,
      },
      global: { components: { Button } },
    }).classes()
    expect(classes).toContain('flex-row')
    expect(
      classes.some((c) => c.includes('data-slot=button') && c.includes('rounded-l-none'))
    ).toBe(true)
  })

  it('supports vertical orientation', () => {
    const classes = mount(ButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: '<button>A</button><button>B</button>' },
    }).classes()
    expect(classes).toContain('flex-col')
  })
})
