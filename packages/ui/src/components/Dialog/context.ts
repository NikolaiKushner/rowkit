import type { InjectionKey, Ref } from 'vue'

/**
 * Set by `DialogDescription` while it is mounted, so `DialogContent` can tell
 * a missing description from one that is still rendering.
 */
export const dialogHasDescriptionKey: InjectionKey<Ref<boolean>> = Symbol('dialogHasDescription')
