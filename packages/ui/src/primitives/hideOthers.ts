/**
 * Makes everything outside `target` invisible to assistive technology while a
 * modal layer is open, and returns a function that undoes exactly that.
 *
 * Walking up from the target to `<body>`, every sibling at every level gets
 * `aria-hidden="true"`, plus `data-aria-hidden` so the change can be told
 * apart from markup that was hidden on purpose. Three things are left alone:
 *
 * - live regions (`aria-live`), so a toast that appears while a dialog is open
 *   is still announced;
 * - elements that were already `aria-hidden` before any layer opened;
 * - `<script>`, `<style>` and `<template>`, which are never read anyway.
 *
 * Layers stack. Each element remembers how many open layers hid it, and only
 * the last one to close brings it back. `keep` lists elements that must stay
 * visible — the layers already open above this one, which a dialog opening
 * in the same tick as its own nested dialog would otherwise hide.
 */
export function hideOthers(target: Element, keep: readonly Element[] = []): () => void {
  const touched: Element[] = []

  for (
    let node: Element = target;
    node.parentElement && node !== document.body;
    node = node.parentElement
  ) {
    for (const sibling of Array.from(node.parentElement.children)) {
      if (sibling === node || !shouldHide(sibling)) continue
      if (keep.some((element) => sibling.contains(element))) continue
      claim(sibling)
      touched.push(sibling)
    }
  }

  let undone = false
  return () => {
    if (undone) return
    undone = true
    for (const element of touched) release(element)
  }
}

/** How many open layers currently hide each element that rowkit hid. */
const holders = new WeakMap<Element, number>()

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE'])

function shouldHide(element: Element): boolean {
  if (SKIPPED_TAGS.has(element.tagName)) return false
  if (element.hasAttribute('aria-live')) return false
  // Hidden by rowkit already: stack another hold on it.
  if (holders.has(element)) return true
  // Hidden by the page itself: not ours to change, now or later.
  return element.getAttribute('aria-hidden') !== 'true'
}

function claim(element: Element): void {
  const count = holders.get(element) ?? 0
  if (count === 0) {
    element.setAttribute('aria-hidden', 'true')
    element.setAttribute('data-aria-hidden', '')
  }
  holders.set(element, count + 1)
}

function release(element: Element): void {
  const count = (holders.get(element) ?? 1) - 1
  if (count > 0) {
    holders.set(element, count)
    return
  }
  holders.delete(element)
  element.removeAttribute('aria-hidden')
  element.removeAttribute('data-aria-hidden')
}
