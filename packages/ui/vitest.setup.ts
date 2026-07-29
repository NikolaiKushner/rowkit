import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeAll } from 'vitest'

beforeAll(() => {
  // jsdom implements no layout, so it has no scrollIntoView. Reka calls it
  // whenever the highlighted option moves, which is every keypress in an open
  // listbox.
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => undefined
  }
})

/**
 * Components that render through a portal attach outside the wrapper, so a
 * test that does not unmount leaves list items on the page for the next one to
 * find.
 *
 * Unmounting is the fix, not clearing `document.body` — a live component whose
 * teleport anchor has been deleted from under it crashes on its next update.
 */
enableAutoUnmount(afterEach)
