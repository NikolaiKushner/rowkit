import { inject, type InjectionKey, type Ref } from 'vue'

/**
 * Set by `DialogDescription` while it is mounted, so `DialogContent` can tell
 * a missing description from one that is still rendering.
 */
export const dialogHasDescriptionKey: InjectionKey<Ref<boolean>> = Symbol('dialogHasDescription')

/** What `Dialog` shares with its parts. */
export interface DialogContext {
  open: Ref<boolean>
  setOpen: (open: boolean) => void
  /** The element focus returns to on close: the trigger, or whatever opened it. */
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const dialogContextKey: InjectionKey<DialogContext> = Symbol('dialog')

export function useDialogContext(part: string): DialogContext {
  const context = inject(dialogContextKey, null)
  if (!context) throw new Error(`<${part}> must be used inside <Dialog>.`)
  return context
}
