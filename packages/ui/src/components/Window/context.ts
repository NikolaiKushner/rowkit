import { inject, provide, type InjectionKey } from 'vue'

export interface WindowContext {
  /** Id of the title, which names the window. */
  titleId: string
}

const windowContextKey: InjectionKey<WindowContext> = Symbol('window')

export function provideWindowContext(context: WindowContext): void {
  provide(windowContextKey, context)
}

export function useWindowContext(part: string): WindowContext {
  const context = inject(windowContextKey, null)
  if (!context) throw new Error(`${part} must be used inside Window`)
  return context
}
