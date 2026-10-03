/*
 * Adapted from aria-hidden by Anton Korzunov (MIT), as used by Reka UI.
 * Copyright (c) 2017 Anton Korzunov
 */

/** How many open layers currently hide each node. */
let hiddenBy = new WeakMap<Element, number>()
/** Nodes that were already `aria-hidden` before any layer touched them. */
let alreadyHidden = new WeakSet<Element>()
let openLayers = 0

const MARKER = 'data-aria-hidden'

/**
 * Hides everything on the page except `target` from assistive technology, by
 * setting `aria-hidden="true"` on every sibling along the path from `target`
 * up to `<body>`. Returns the function that undoes it.
 *
 * Nested layers stack: a node hidden by two dialogs is revealed only when
 * both close. A node that was `aria-hidden` before is never un-hidden.
 * `aria-live` regions and scripts stay untouched, so toasts are still
 * announced while a dialog is open.
 */
export function hideOthers(target: Element): () => void {
  const root = target.ownerDocument.body
  const keepVisible = new Set<Element>([
    target,
    ...Array.from(root.querySelectorAll('[aria-live], script')),
  ])

  const ancestors = new Set<Element>()
  for (const el of keepVisible) {
    let node: Element | null = el
    while (node && !ancestors.has(node)) {
      ancestors.add(node)
      node = node.parentElement
    }
  }

  const hidden: Element[] = []
  const walk = (parent: Element) => {
    if (keepVisible.has(parent)) return
    for (const node of Array.from(parent.children)) {
      if (ancestors.has(node)) {
        walk(node)
        continue
      }
      const count = (hiddenBy.get(node) ?? 0) + 1
      hiddenBy.set(node, count)
      hidden.push(node)
      if (count === 1) {
        const attr = node.getAttribute('aria-hidden')
        if (attr !== null && attr !== 'false') alreadyHidden.add(node)
        else node.setAttribute('aria-hidden', 'true')
        node.setAttribute(MARKER, 'true')
      }
    }
  }
  walk(root)
  openLayers++

  return () => {
    for (const node of hidden) {
      const count = (hiddenBy.get(node) ?? 1) - 1
      hiddenBy.set(node, count)
      if (count === 0) {
        if (!alreadyHidden.has(node)) node.removeAttribute('aria-hidden')
        alreadyHidden.delete(node)
        node.removeAttribute(MARKER)
      }
    }
    openLayers--
    if (openLayers === 0) {
      hiddenBy = new WeakMap()
      alreadyHidden = new WeakSet()
    }
  }
}
