import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState.vue'

const title = 'No projects yet'

describe('EmptyState', () => {
  it('renders the title', () => {
    expect(mount(EmptyState, { props: { title } }).text()).toContain(title)
  })

  it('renders the description when given', () => {
    const el = mount(EmptyState, { props: { title, description: 'Create one to get started.' } })
    expect(el.text()).toContain('Create one to get started.')
  })

  it('omits the description element entirely when absent', () => {
    // Not an empty paragraph holding open vertical space.
    expect(mount(EmptyState, { props: { title } }).find('p').exists()).toBe(false)
  })

  describe('heading', () => {
    it('is an h2 by default', () => {
      expect(mount(EmptyState, { props: { title } }).find('h2').exists()).toBe(true)
    })

    it.each([1, 3, 6] as const)('renders at level %i when asked', (level) => {
      const el = mount(EmptyState, { props: { title, level } })
      expect(el.find(`h${level}`).exists()).toBe(true)
      expect(el.find(`h${level}`).text()).toBe(title)
    })

    it('carries the title so heading navigation lands on it', () => {
      // The point of the heading is that a screen reader user can jump here.
      expect(mount(EmptyState, { props: { title } }).find('h2').text()).toBe(title)
    })
  })

  describe('reason', () => {
    it('defaults to no-data and supplies no description', () => {
      // What to do when nothing exists yet is domain-specific; a guess would be
      // worse copy than silence.
      expect(mount(EmptyState, { props: { title } }).find('p').exists()).toBe(false)
    })

    it('supplies generic copy for no-results', () => {
      const el = mount(EmptyState, { props: { title, reason: 'no-results' } })
      expect(el.find('p').text()).toContain('Try removing a filter')
    })

    it('supplies generic copy for an error', () => {
      const el = mount(EmptyState, { props: { title, reason: 'error' } })
      expect(el.find('p').text()).toContain('Something went wrong')
    })

    it('lets an explicit description win over the default', () => {
      const el = mount(EmptyState, {
        props: { title, reason: 'error', description: 'The billing service is down.' },
      })
      expect(el.find('p').text()).toBe('The billing service is down.')
    })

    it('keeps the explanation in the text colour for every reason, even an error', () => {
      // The red error mark says "error"; red text would say it a second time
      // and make the sentence that says what to do harder to read. Muted text
      // is black in Windows 98 and grey in the modern theme.
      for (const reason of ['no-data', 'no-results', 'error'] as const) {
        const el = mount(EmptyState, { props: { title, reason, description: 'x' } })
        expect(el.find('p').classes(), reason).toContain('text-muted-foreground')
        expect(el.find('p').classes().join(' '), reason).not.toMatch(/danger/)
      }
    })

    it.each([
      ['no-data', 'RkFolderEmpty32Icon'],
      ['no-results', 'RkSearch32Icon'],
      ['error', 'RkError32Icon'],
    ] as const)('draws the 32px icon for %s', (reason, icon) => {
      const el = mount(EmptyState, { props: { title, reason } })
      expect(el.findComponent({ name: icon }).exists()).toBe(true)
    })
  })

  describe('announcement', () => {
    it('is silent by default', () => {
      // A first-run empty state is just what the page says; nothing changed.
      expect(mount(EmptyState, { props: { title } }).attributes('role')).toBeUndefined()
    })

    it('becomes a status region when it replaces content', () => {
      const el = mount(EmptyState, { props: { title, announce: true } })
      expect(el.attributes('role')).toBe('status')
    })
  })

  describe('slots', () => {
    it('renders the icon slot above the title', () => {
      const el = mount(EmptyState, { props: { title }, slots: { icon: '<svg data-test="i" />' } })
      expect(el.find('[data-test="i"]').exists()).toBe(true)
    })

    it('lets the icon slot replace the icon the reason picks', () => {
      const el = mount(EmptyState, {
        props: { title, reason: 'error' },
        slots: { icon: '<svg data-test="i" />' },
      })
      expect(el.findComponent({ name: 'RkError32Icon' }).exists()).toBe(false)
    })

    it('renders actions', () => {
      const el = mount(EmptyState, {
        props: { title },
        slots: { actions: '<button>Create</button>' },
      })
      expect(el.find('button').text()).toBe('Create')
    })

    it('omits the actions wrapper when the slot is unused', () => {
      // With no description or actions, the heading is all the text column
      // holds: the icon on the left, the heading beside it.
      const el = mount(EmptyState, { props: { title } })
      const body = el.element.children[1]
      expect(body?.children).toHaveLength(1)
      expect(body?.children[0]?.tagName).toBe('H2')
    })

    it('lets the description slot replace the prop', () => {
      const el = mount(EmptyState, {
        props: { title, description: 'plain' },
        slots: { description: '<em>rich</em>' },
      })
      expect(el.find('em').text()).toBe('rich')
      expect(el.text()).not.toContain('plain')
    })
  })

  describe('size', () => {
    it.each([
      ['sm', 'text-heading'],
      ['md', 'text-heading'],
      ['lg', 'text-doc-h3'],
    ] as const)('%s scales the title to %s', (size, expected) => {
      const el = mount(EmptyState, { props: { title, size } })
      expect(el.find('h2').classes()).toContain(expected)
    })

    it.each([
      ['sm', 'max-w-[280px]'],
      ['md', 'max-w-[360px]'],
      ['lg', 'max-w-[440px]'],
    ] as const)('caps %s at the width drawn in Figma, %s', (size, expected) => {
      expect(mount(EmptyState, { props: { title, size } }).classes()).toContain(expected)
    })
  })

  describe('class forwarding', () => {
    it('merges a consumer class onto the root', () => {
      expect(mount(EmptyState, { props: { title, class: 'py-2' } }).classes()).toContain('py-2')
    })

    it('drops the padding it replaces rather than emitting both', () => {
      const classes = mount(EmptyState, { props: { title, class: 'p-2' } }).classes()
      expect(classes).toContain('p-2')
      expect(classes).not.toContain('p-6')
    })
  })

  it('renders as the requested element', () => {
    expect(mount(EmptyState, { props: { title, as: 'section' } }).element.tagName).toBe('SECTION')
  })
})
