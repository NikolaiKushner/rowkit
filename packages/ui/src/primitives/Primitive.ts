import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  mergeProps,
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
  /** The element or component to render. Ignored when `asChild` is set. */
  as?: string | Component
}

/** Void elements: rendering them with children is invalid, so they get none. */
const VOID_TAGS = new Set(['area', 'img', 'input'])

/**
 * Renders `as`, or with `asChild` hands its attributes to the slot's first
 * real element.
 *
 * The rules, chosen so swapping an element for `as-child` changes nothing else: fragments are flattened, comment nodes
 * skipped, the child's own props win where both sides set the same one (with
 * classes, styles and listeners merged rather than replaced), and the child's
 * `ref` is dropped so it does not shadow the part's.
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
      if (props.asChild) return renderAsChild(attrs, slots.default?.())
      if (typeof props.as === 'string' && VOID_TAGS.has(props.as)) return h(props.as, attrs)
      return h(props.as, attrs, { default: slots.default })
    }
  },
})

function renderAsChild(
  attrs: Record<string, unknown>,
  slotContent: VNode[] | undefined
): VNode | VNode[] | null {
  if (!slotContent) return null
  const children = flatten(slotContent)
  const index = children.findIndex((child) => child.type !== Comment)
  const child = children[index]
  if (child === undefined) return children

  const childProps = { ...child.props }
  delete childProps.ref
  const cloned = cloneVNode({ ...child, props: {} }, mergeProps(attrs, childProps))

  if (children.length === 1) return cloned
  children[index] = cloned
  return children
}

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Fragment && Array.isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node]
  )
}
