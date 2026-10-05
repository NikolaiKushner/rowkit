import { ref } from 'vue'

/**
 * Whether the Find window is open. One flag for the whole site, so the
 * toolbar's Find, the Start menu's «Find…» and Ctrl+K all open the same one,
 * on the desktop as well as in a docs page.
 */
export const finding = ref(false)

export function openFind(): void {
  finding.value = true
}
