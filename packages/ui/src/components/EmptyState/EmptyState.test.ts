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

    it('tints an error explanation without shouting in the heading', () => {
      // A red heading reads as an alert and pulls the eye off the sentence
      // that says what to do.
      const el = mount(EmptyState, { props: { title, reason: 'error' } })
      expect(el.find('p').classes()).toContain('text-danger-on-subtle')
      expect(el.find('h2').classes()).toContain('text-text')
    })

    it('keeps the other two reasons muted', () => {
      for (const reason of ['no-data', 'no-results'] as const) {
        const el = mount(EmptyState, { props: { title, reason, description: 'x' } })
        expect(el.find('p').classes(), reason).toContain('text-text-muted')
      }
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

    it('omits the icon wrapper when the slot is unused', () => {
      const el = mount(EmptyState, { props: { title } })
      expect(el.html()).not.toContain('text-text-subtle')
    })

    it('renders actions', () => {
      const el = mount(EmptyState, {
        props: { title },
        slots: { actions: '<button>Create</button>' },
      })
      expect(el.find('button').text()).toBe('Create')
    })

    it('omits the actions wrapper when the slot is unused', () => {
      // The root is itself a div, so count children rather than divs: with no
      // icon, description or actions the heading should be all there is.
      const el = mount(EmptyState, { props: { title } })
      expect(el.element.children).toHaveLength(1)
      expect(el.element.children[0]?.tagName).toBe('H2')
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
      ['sm', 'text-sm'],
      ['md', 'text-base'],
      ['lg', 'text-lg'],
    ] as const)('%s scales the title to %s', (size, expected) => {
      const el = mount(EmptyState, { props: { title, size } })
      expect(el.find('h2').classes()).toContain(expected)
    })

    it('caps the description width so it stays readable', () => {
      const el = mount(EmptyState, { props: { title, description: 'x', size: 'md' } })
      expect(el.find('p').classes()).toContain('max-w-sm')
    })
  })

  describe('class forwarding', () => {
    it('merges a consumer class onto the root', () => {
      expect(mount(EmptyState, { props: { title, class: 'py-2' } }).classes()).toContain('py-2')
    })

    it('drops the padding it replaces rather than emitting both', () => {
      expect(mount(EmptyState, { props: { title, class: 'py-2' } }).classes()).not.toContain(
        'py-10'
      )
    })
  })

  it('renders as the requested element', () => {
    expect(mount(EmptyState, { props: { title, as: 'section' } }).element.tagName).toBe('SECTION')
  })
})
