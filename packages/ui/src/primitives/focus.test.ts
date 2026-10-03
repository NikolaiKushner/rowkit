import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { tabbables } from './focus'
import FocusScope from './FocusScope.vue'
import { Presence } from './Presence'

afterEach(() => {
  document.body.innerHTML = ''
})

const byId = (id: string) => document.getElementById(id) as HTMLElement

describe('tabbables', () => {
  it('lists what Tab reaches, in document order, and skips the rest', () => {
    document.body.innerHTML = `
      <div id="box">
        <button id="a">a</button>
        <button disabled>off</button>
        <input type="hidden" />
        <span tabindex="-1">script only</span>
        <fieldset disabled><input id="fenced" /></fieldset>
        <div hidden><button>hidden</button></div>
        <a href="#" id="b">b</a>
        <a>no href</a>
        <div tabindex="0" id="c">c</div>
      </div>`
    expect(tabbables(byId('box')).map((el) => el.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('FocusScope', () => {
  /** A trigger on the page and a scope that opens and closes. */
  function scene(props: Record<string, unknown> = {}, listeners: Record<string, unknown> = {}) {
    const open = ref(false)
    mount(
      defineComponent({
        setup: () => () => [
          h('button', { id: 'trigger' }, 'trigger'),
          open.value
            ? h(FocusScope, { loop: true, trapped: true, ...props, ...listeners }, () =>
                h('div', { id: 'scope' }, [
                  h('button', { id: 'first' }, 'first'),
                  h('button', { id: 'last' }, 'last'),
                ])
              )
            : null,
        ],
      }),
      { attachTo: document.body }
    )
    return { open }
  }

  const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey,
      bubbles: true,
      cancelable: true,
    })
    document.activeElement?.dispatchEvent(event)
    return event
  }

  it('moves focus in on open and gives it back on close', async () => {
    const { open } = scene()
    byId('trigger').focus()
    open.value = true
    await nextTick()
    await nextTick()
    expect(document.activeElement?.id).toBe('first')

    open.value = false
    await nextTick()
    expect(document.activeElement?.id).toBe('trigger')
  })

  it('lets the owner place focus instead, on open and on close', async () => {
    const onMount = vi.fn((event: Event) => event.preventDefault())
    const onUnmount = vi.fn((event: Event) => event.preventDefault())
    const { open } = scene({}, { onMountAutoFocus: onMount, onUnmountAutoFocus: onUnmount })
    byId('trigger').focus()
    open.value = true
    await nextTick()
    await nextTick()
    expect(onMount).toHaveBeenCalledOnce()
    expect(document.activeElement?.id).toBe('trigger')

    byId('last').focus()
    open.value = false
    await nextTick()
    expect(onUnmount).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(document.body)
  })

  it('wraps Tab from the last stop to the first, and Shift+Tab back', async () => {
    const { open } = scene()
    open.value = true
    await nextTick()
    await nextTick()
    byId('last').focus()
    expect(tab().defaultPrevented).toBe(true)
    expect(document.activeElement?.id).toBe('first')
    expect(tab(true).defaultPrevented).toBe(true)
    expect(document.activeElement?.id).toBe('last')
  })

  it('leaves Tab alone between the edges', async () => {
    const { open } = scene()
    open.value = true
    await nextTick()
    await nextTick()
    byId('first').focus()
    expect(tab().defaultPrevented).toBe(false)
  })

  it('pulls focus back while trapped', async () => {
    const { open } = scene()
    open.value = true
    await nextTick()
    await nextTick()
    byId('last').focus()
    byId('trigger').focus()
    expect(document.activeElement?.id).toBe('last')
  })

  it('lets focus go when not trapped', async () => {
    const { open } = scene({ trapped: false })
    open.value = true
    await nextTick()
    await nextTick()
    byId('trigger').focus()
    expect(document.activeElement?.id).toBe('trigger')
  })
})

describe('Presence', () => {
  function scene(animations: () => Animation[] = () => []) {
    const present = ref(true)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Presence, { present: present.value }, () =>
            h('div', { id: 'surface', 'data-state': present.value ? 'open' : 'closed' })
          ),
      }),
      { attachTo: document.body }
    )
    const surface = document.getElementById('surface') as HTMLElement & {
      getAnimations?: () => Animation[]
    }
    surface.getAnimations = animations
    return { present, wrapper }
  }

  it('removes the child at once when nothing animates the exit', async () => {
    const { present, wrapper } = scene()
    present.value = false
    await nextTick()
    expect(wrapper.find('#surface').exists()).toBe(false)
  })

  it('keeps the child, in its closed state, until the exit animation ends', async () => {
    let finish: () => void = () => {}
    const finished = new Promise<Animation>((resolve) => {
      finish = () => resolve(exit)
    })
    const exit = {
      playState: 'running',
      finished,
      effect: { getComputedTiming: () => ({ endTime: 150 }) },
    } as unknown as Animation
    const { present, wrapper } = scene(() => [exit])

    present.value = false
    await nextTick()
    expect(wrapper.find('#surface').attributes('data-state')).toBe('closed')

    finish()
    await flushPromises()
    expect(wrapper.find('#surface').exists()).toBe(false)
  })

  it('stays when reopened before the exit ends', async () => {
    let finish: () => void = () => {}
    const finished = new Promise<Animation>((resolve) => {
      finish = () => resolve(exit)
    })
    const exit = {
      playState: 'running',
      finished,
      effect: { getComputedTiming: () => ({ endTime: 150 }) },
    } as unknown as Animation
    const { present, wrapper } = scene(() => [exit])

    present.value = false
    await nextTick()
    present.value = true
    await nextTick()
    finish()
    await flushPromises()
    expect(wrapper.find('#surface').attributes('data-state')).toBe('open')
  })

  it('ignores an endless animation, which would hold the child forever', async () => {
    const spinner = {
      playState: 'running',
      finished: new Promise(() => {}),
      effect: { getComputedTiming: () => ({ endTime: Infinity }) },
    } as unknown as Animation
    const { present, wrapper } = scene(() => [spinner])
    present.value = false
    await nextTick()
    expect(wrapper.find('#surface').exists()).toBe(false)
  })
})
