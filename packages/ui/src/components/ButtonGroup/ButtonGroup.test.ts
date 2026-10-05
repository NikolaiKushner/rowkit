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

  it('lays buttons edge to edge on the horizontal axis by default', () => {
    const classes = mount(ButtonGroup, {
      slots: {
        default: `
          <Button variant="ghost">Archive</Button>
          <Button variant="ghost">Report</Button>
        `,
      },
      global: { components: { Button } },
    }).classes()
    expect(classes).toContain('flex-row')
    // Windows 98 toolbar buttons keep their own bevels; nothing is merged.
    expect(classes.some((c) => c.includes('rounded') || c.includes('-ml-px'))).toBe(false)
    expect(classes.some((c) => /^gap-/.test(c))).toBe(false)
  })

  it('spaces nested groups 4px apart', () => {
    const classes = mount(ButtonGroup).classes()
    expect(classes).toContain('has-[>[data-slot=button-group]]:gap-1')
  })

  it('supports vertical orientation', () => {
    const classes = mount(ButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: '<button>A</button><button>B</button>' },
    }).classes()
    expect(classes).toContain('flex-col')
  })
})
