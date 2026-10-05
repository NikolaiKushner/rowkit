import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  Text,
  type Component,
  type PropType,
  type VNode,
} from 'vue'

/**
 * The `as` / `as-child` contract every rowkit part that renders a single
 * element shares.
 *
 * Owned here so rowkit carries no behaviour library: Button, Badge,
 * Skeleton, EmptyState and every trigger render through it.
 */
export interface PrimitiveProps {
  /**
   * Render the single child the consumer passes instead of a wrapper, merging
   * this part's attributes, classes and listeners onto it.
   */
  asChild?: boolean
  /** The element or component to render. Defaults to `div`. */
  as?: string | Component
}

/** Elements that cannot have children; slot content is dropped for them. */
const EMPTY_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
])

/**
 * Walks the slot output in render order and returns the first node that will
 * actually produce an element: fragments are opened, comments and
 * whitespace-only text are passed over.
 */
export function firstRenderable(nodes: readonly unknown[]): VNode | undefined {
  for (const node of nodes) {
    if (Array.isArray(node)) {
      const found = firstRenderable(node)
      if (found) return found
      continue
    }
    if (node === null || typeof node !== 'object') continue
    const vnode = node as VNode
    if (vnode.type === Comment) continue
    if (vnode.type === Text && (typeof vnode.children !== 'string' || vnode.children.trim() === ''))
      continue
    if (vnode.type === Fragment) {
      const found = firstRenderable(Array.isArray(vnode.children) ? vnode.children : [])
      if (found) return found
      continue
    }
    return vnode
  }
  return undefined
}

/**
 * Hands the part's attributes to the consumer's element.
 *
 * Attributes are merged once, with the child listed last: where both set the
 * same plain attribute the child's value stands, while classes, styles and
 * listeners from both sides are kept. A `ref` on the child stays where it was,
 * so whoever placed it — the consumer or an enclosing part — still reaches the
 * element; a ref on this component resolves to the same element through `$el`.
 */
function adopt(child: VNode, attrs: Record<string, unknown>): VNode {
  const copy = cloneVNode(child, {}, false)
  copy.props = mergeProps(attrs, child.props ?? {})
  return copy
}

/**
 * Renders `as`, or with `asChild` lends its attributes to the first element
 * the consumer's slot produces.
 *
 * Swapping a wrapper for `as-child` is meant to change nothing else: the same
 * attributes, classes and listeners end up on the rendered element either way.
 */
export const Primitive = defineComponent({
  name: 'RkPrimitive',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
    as: { type: [String, Object] as PropType<string | Component>, default: 'div' },
  },
  setup(props, { attrs, slots }) {
    return () => {
      if (props.asChild) {
        const child = firstRenderable(slots.default?.() ?? [])
        return child ? adopt(child, attrs) : null
      }
      const childless = typeof props.as === 'string' && EMPTY_ELEMENTS.has(props.as)
      return h(props.as, attrs, childless ? undefined : slots.default)
    }
  },
})
