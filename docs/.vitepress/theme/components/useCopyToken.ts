import { ref } from 'vue'

/**
 * Copy-on-click for a token name, with a short confirmation.
 *
 * Shared by `ColorScale` and `TokenGrid` so the two cannot drift on timing or
 * on what actually lands in the clipboard: the CSS custom property, because
 * that is what a consumer pastes into a stylesheet. The raw value is on the
 * page for reading; it is not what anyone wants on their clipboard.
 */
export function useCopyToken(timeout = 1200) {
  const copied = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(token: string): Promise<void> {
    // Older browsers and any non-secure origin have no clipboard API. Failing
    // silently is right here — the token is already visible on the page.
    try {
      await navigator.clipboard.writeText(token)
    } catch {
      return
    }

    copied.value = token
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = null), timeout)
  }

  return { copied, copy }
}
