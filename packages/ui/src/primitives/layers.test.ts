import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DismissableLayer from './DismissableLayer.vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from './dismissableLayer'
import { hideOthers } from './hideOthers'
import { useBodyScrollLock } from './scrollLock'

afterEach(() => {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})

describe('hideOthers', () => {
  function page() {
    document.body.innerHTML = `
      <main id="app"><button>Behind</button></main>
      <div id="live" aria-live="polite"></div>
      <aside id="already" aria-hidden="true"></aside>
      <div id="dialog"><button>Inside</button></div>`
    return document.getElementById('dialog') as HTMLElement
  }

  it('hides every sibling of the target and marks what it hid', () => {
    hideOthers(page())
    const app = document.getElementById('app')
    expect(app?.getAttribute('aria-hidden')).toBe('true')
    expect(app?.hasAttribute('data-aria-hidden')).toBe(true)
    expect(document.getElementById('dialog')?.hasAttribute('aria-hidden')).toBe(false)
  })

  it('leaves live regions alone so toasts are still announced', () => {
    hideOthers(page())
    expect(document.getElementById('live')?.hasAttribute('aria-hidden')).toBe(false)
  })

  it('restores what it hid, and never un-hides what was hidden before', () => {
    const undo = hideOthers(page())
    undo()
    expect(document.getElementById('app')?.hasAttribute('aria-hidden')).toBe(false)
    expect(document.getElementById('app')?.hasAttribute('data-aria-hidden')).toBe(false)
    expect(document.getElementById('already')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('never hides what it is told to keep, such as a layer open above it', () => {
    const above = document.createElement('div')
    above.innerHTML = '<div id="above"></div>'
    document.body.append(above)
    hideOthers(page(), [document.getElementById('above') as HTMLElement])
    expect(above.hasAttribute('aria-hidden')).toBe(false)
    expect(document.getElementById('app')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('keeps a node hidden until every layer that hid it has closed', () => {
    const first = page()
    const second = document.createElement('div')
    document.body.append(second)
    const undoFirst = hideOthers(first)
    const undoSecond = hideOthers(second)
    undoSecond()
    expect(document.getElementById('app')?.getAttribute('aria-hidden')).toBe('true')
    undoFirst()
    expect(document.getElementById('app')?.hasAttribute('aria-hidden')).toBe(false)
  })
})

describe('useBodyScrollLock', () => {
  it('locks the page while any caller holds a lock and unlocks after the last', () => {
    const a = useBodyScrollLock(true)
    const b = useBodyScrollLock(true)
    expect(document.body.style.overflow).toBe('hidden')
    a(false)
    expect(document.body.style.overflow).toBe('hidden')
    b(false)
    expect(document.body.style.overflow).toBe('')
  })

  it('restores the overflow the page had before', () => {
    document.body.style.overflow = 'scroll'
    const lock = useBodyScrollLock(true)
    lock(false)
    expect(document.body.style.overflow).toBe('scroll')
  })
})

describe('DismissableLayer', () => {
  /** Two layers, the second opened on top of the first. */
  function stack() {
    const onOuter = vi.fn()
    const onInner = vi.fn()
    const innerOpen = ref(true)
    const wrapper = mount(
      defineComponent({
        setup: () => () => [
          h(DismissableLayer, { onDismiss: onOuter }, () => 'outer'),
          innerOpen.value ? h(DismissableLayer, { onDismiss: onInner }, () => 'inner') : null,
        ],
      }),
      { attachTo: document.body }
    )
    return { wrapper, onOuter, onInner, innerOpen }
  }

  const escape = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))

  it('lets only the topmost layer react to Escape', async () => {
    const { onOuter, onInner, innerOpen } = stack()
    await nextTick()
    escape()
    expect(onInner).toHaveBeenCalledOnce()
    expect(onOuter).not.toHaveBeenCalled()

    innerOpen.value = false
    await nextTick()
    escape()
    expect(onOuter).toHaveBeenCalledOnce()
  })

  it('does not dismiss when the Escape handler cancels the event', async () => {
    const onDismiss = vi.fn()
    mount(DismissableLayer, {
      attrs: { onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(), onDismiss },
      attachTo: document.body,
    })
    await nextTick()
    escape()
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('makes the page inert to the pointer only while blocking, and restores it', async () => {
    document.body.style.pointerEvents = 'auto'
    const wrapper = mount(DismissableLayer, {
      props: { disableOutsidePointerEvents: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.style.pointerEvents).toBe('none')
    expect((wrapper.element as HTMLElement).style.pointerEvents).toBe('auto')
    wrapper.unmount()
    expect(document.body.style.pointerEvents).toBe('auto')
  })
})

describe('DismissableLayer outside the pointer', () => {
  const press = (target: Element) =>
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))

  function page(blocking: boolean) {
    const onOuter = vi.fn()
    const onInner = vi.fn()
    mount(
      defineComponent({
        setup: () => () => [
          h('button', { id: 'page' }, 'page'),
          h('div', { id: 'toast', 'data-dismissable-layer-branch': '' }, 'toast'),
          h(
            DismissableLayer,
            { id: 'outer', disableOutsidePointerEvents: blocking, onDismiss: onOuter },
            () => 'outer'
          ),
          h(DismissableLayer, { id: 'inner', onDismiss: onInner }, () => 'inner'),
        ],
      }),
      { attachTo: document.body }
    )
    const at = (id: string) => document.getElementById(id) as HTMLElement
    return { onOuter, onInner, at }
  }

  it('dismisses every layer the pointer is outside of, top down', async () => {
    const { onOuter, onInner, at } = page(false)
    await nextTick()
    press(at('page'))
    expect(onInner).toHaveBeenCalledOnce()
    expect(onOuter).toHaveBeenCalledOnce()
  })

  it('stops at the layer the pointer landed in', async () => {
    const { onOuter, onInner, at } = page(false)
    await nextTick()
    press(at('outer'))
    expect(onInner).toHaveBeenCalledOnce()
    expect(onOuter).not.toHaveBeenCalled()
  })

  it('leaves the layers under a modal layer alone', async () => {
    const onBottom = vi.fn()
    const onModal = vi.fn()
    mount(
      defineComponent({
        setup: () => () => [
          h('button', { id: 'page' }, 'page'),
          h(DismissableLayer, { onDismiss: onBottom }, () => 'bottom'),
          h(
            DismissableLayer,
            { disableOutsidePointerEvents: true, onDismiss: onModal },
            () => 'modal'
          ),
        ],
      }),
      { attachTo: document.body }
    )
    await nextTick()
    press(document.getElementById('page') as HTMLElement)
    expect(onModal).toHaveBeenCalledOnce()
    expect(onBottom).not.toHaveBeenCalled()
  })

  it('treats a branch as inside every layer', async () => {
    const { onOuter, onInner, at } = page(false)
    await nextTick()
    press(at('toast'))
    expect(onInner).not.toHaveBeenCalled()
    expect(onOuter).not.toHaveBeenCalled()
  })

  it('reports the pointer event, aimed at what was pressed, and can be cancelled', async () => {
    const onDismiss = vi.fn()
    let seen: PointerDownOutsideEvent | undefined
    mount(
      defineComponent({
        setup: () => () => [
          h('button', { id: 'page' }, 'page'),
          h(
            DismissableLayer,
            {
              onPointerDownOutside: (event: PointerDownOutsideEvent) => {
                seen = event
                event.preventDefault()
              },
              onDismiss,
            },
            () => 'layer'
          ),
        ],
      }),
      { attachTo: document.body }
    )
    await nextTick()
    const target = document.getElementById('page') as HTMLElement
    press(target)
    expect(seen?.target).toBe(target)
    expect(seen?.detail.originalEvent.type).toBe('pointerdown')
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('dismisses when focus moves outside, unless cancelled', async () => {
    const onDismiss = vi.fn()
    const cancel = ref(false)
    mount(
      defineComponent({
        setup: () => () => [
          h('button', { id: 'page' }, 'page'),
          h(
            DismissableLayer,
            {
              onFocusOutside: (event: FocusOutsideEvent) => cancel.value && event.preventDefault(),
              onDismiss,
            },
            () => h('button', { id: 'inside' }, 'inside')
          ),
        ],
      }),
      { attachTo: document.body }
    )
    await nextTick()
    ;(document.getElementById('inside') as HTMLElement).focus()
    expect(onDismiss).not.toHaveBeenCalled()
    cancel.value = true
    ;(document.getElementById('page') as HTMLElement).focus()
    expect(onDismiss).not.toHaveBeenCalled()
    cancel.value = false
    ;(document.getElementById('inside') as HTMLElement).focus()
    ;(document.getElementById('page') as HTMLElement).focus()
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
