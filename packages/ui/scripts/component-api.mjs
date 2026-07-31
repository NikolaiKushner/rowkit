/**
 * Reads the public API of every rowkit component out of the source.
 *
 * One extraction, two consumers: `generate-props.mjs` turns the props into the
 * tables on each docs page, and `generate-agents.mjs` turns the whole thing into
 * `AGENTS.md`. Splitting it here is what stops the two from disagreeing about
 * what a component accepts.
 *
 * Props come from `types.ts` through the TypeScript **checker**, because the
 * interesting types are indirect — `NonNullable<BadgeVariants['variant']>` is
 * what the source says and `'neutral' | 'primary' | …` is what a reader needs.
 * Models, events and slots come from the SFC's own `defineModel`, `defineEmits`
 * and `defineSlots` calls, parsed rather than pattern-matched.
 */
import { readFile } from 'node:fs/promises'
import { globSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { parse as parseSfc } from 'vue/compiler-sfc'

export const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const repoRoot = resolve(packageRoot, '../..')

/**
 * Types whose resolved form is technically accurate and useless to read.
 *
 * `HTMLAttributes['class']` expands to Vue's four-way union including
 * `Record<string, any>`, and `PrimitiveProps['as']` to Reka's full component
 * union. A consumer needs to know what to pass, not what the type system will
 * tolerate, so these are stated as written rather than as resolved.
 */
const TYPE_ALIASES = new Map([
  ["HTMLAttributes['class']", 'string'],
  ["PrimitiveProps['as']", 'string | Component'],
  ["PrimitiveProps['asChild']", 'boolean'],
])

const TYPE_FORMAT =
  ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType

/**
 * The type a consumer needs to read, which is rarely the one the source says.
 *
 * Unions are expanded to their constituents rather than printed as whatever
 * alias happens to name them: `TooltipPlacement` tells a reader nothing, and
 * `'top' | 'right' | 'bottom' | 'left'` tells them everything. The optionality
 * wrapper goes too — anywhere this is shown, a default is shown beside it.
 */
function stringifyType(checker, type) {
  const nonNullable = checker.getNonNullableType(type)
  if (!nonNullable.isUnion()) return checker.typeToString(nonNullable, undefined, TYPE_FORMAT)

  const constituents = nonNullable.types
    .filter((member) => (member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) === 0)
    .map((member) => checker.typeToString(member, undefined, TYPE_FORMAT))

  // `boolean` is internally `true | false`, and nobody wants to read that.
  const collapsed = constituents.filter((name) => name !== 'true' && name !== 'false')
  if (collapsed.length !== constituents.length) collapsed.unshift('boolean')

  return collapsed.join(' | ')
}

/** Collapses a JSDoc comment to one line for a table cell. */
export function summarise(comment, limit = 140) {
  const [paragraph = ''] = comment.split(/\n\s*\n/)
  const collapsed = paragraph.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= limit) return collapsed
  const [firstSentence] = collapsed.match(/^.*?[.!?](?=\s|$)/) ?? [collapsed]
  return firstSentence
}

/** The JSDoc text attached to a node in a standalone (checker-less) parse. */
function jsDocOf(node) {
  const blocks = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
  return blocks
    .map((block) => (typeof block.comment === 'string' ? block.comment : ''))
    .join('\n')
    .trim()
}

/** Members of a type literal, seeing through an intersection. */
function typeMembers(node) {
  if (node === undefined) return []
  if (ts.isTypeLiteralNode(node)) return [...node.members]
  // `defineSlots<{ … } & Record<\`cell:${string}\`, …>>()` — the mapped half
  // carries no names to document, so only the literal contributes.
  if (ts.isIntersectionTypeNode(node)) return node.types.flatMap(typeMembers)
  return []
}

/** Parses one SFC for its models, events and slots. */
function readSfcApi(source, componentName) {
  const { descriptor } = parseSfc(source)
  const script = descriptor.scriptSetup ?? descriptor.script
  const api = { defaults: new Map(), models: [], events: [], slots: [] }
  if (script === null) return api

  const ast = ts.createSourceFile(
    `${componentName}.ts`,
    script.content,
    ts.ScriptTarget.ES2022,
    true
  )
  const text = (node) => node.getText(ast)

  /**
   * The parameter list of a slot signature.
   *
   * Unwraps unions and parentheses, because an optional slot in a `Record` is
   * written `((props: X) => unknown) | undefined` — reading only a bare
   * function type reports "no props" for exactly the slots that have them.
   */
  const paramsOf = (node) => {
    if (node === undefined) return ''
    if (ts.isParenthesizedTypeNode(node)) return paramsOf(node.type)
    if (ts.isUnionTypeNode(node)) {
      for (const member of node.types) {
        const found = paramsOf(member)
        if (found !== '') return found
      }
      return ''
    }
    if (ts.isFunctionTypeNode(node)) {
      return node.parameters.map((parameter) => text(parameter)).join(', ')
    }
    return ''
  }

  /*
   * Slot props are often declared as a local alias in the SFC — `CellSlotProps`
   * on `DataTable`. That name is meaningless to anyone reading this outside the
   * file, and it is not exported, so it is inlined rather than named.
   */
  const localAliases = new Map()
  ts.forEachChild(ast, (node) => {
    if (ts.isTypeAliasDeclaration(node)) localAliases.set(node.name.text, text(node.type))
  })
  const inlineAliases = (signature) =>
    [...localAliases].reduce(
      (out, [name, definition]) => out.replace(new RegExp(`\\b${name}\\b`, 'g'), definition),
      signature
    )

  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const macro = node.expression.text
      const [typeArg] = node.typeArguments ?? []

      if (macro === 'withDefaults' && ts.isObjectLiteralExpression(node.arguments[1] ?? {})) {
        for (const property of node.arguments[1].properties) {
          if (ts.isPropertyAssignment(property)) {
            api.defaults.set(text(property.name), text(property.initializer))
          }
        }
      }

      if (macro === 'defineModel') {
        const [first] = node.arguments
        const named = first !== undefined && ts.isStringLiteralLike(first)
        api.models.push({
          // An unnamed `defineModel()` is `v-model`, which Vue calls
          // `modelValue` on the props side.
          name: named ? first.text : 'modelValue',
          type: typeArg === undefined ? 'unknown' : text(typeArg),
          // The comment sits on the enclosing `const x = defineModel(…)`.
          description: jsDocOf(node.parent?.parent?.parent ?? node),
        })
      }

      if (macro === 'defineEmits') {
        for (const member of typeMembers(typeArg)) {
          if (!ts.isPropertySignature(member)) continue
          api.events.push({
            name: text(member.name).replace(/^'|'$/g, ''),
            payload: member.type === undefined ? '[]' : text(member.type),
            description: jsDocOf(member),
          })
        }
      }

      if (macro === 'defineSlots') {
        /*
         * `defineSlots<{ … } & Record<\`cell:${string}\`, …>>()` — the mapped
         * half is where `DataTable`'s per-column slots live, and dropping it
         * would hide the single most useful thing anyone needs to know about
         * rendering a cell.
         */
        for (const part of typeArg === undefined ? [] : [typeArg]) {
          const references = ts.isIntersectionTypeNode(part) ? part.types : [part]
          for (const reference of references) {
            if (!ts.isTypeReferenceNode(reference)) continue
            if (text(reference.typeName) !== 'Record') continue
            const [key, value] = reference.typeArguments ?? []
            if (key === undefined) continue
            api.slots.push({
              // `cell:${string}` is precise and unreadable; `cell:<key>` is
              // what a person or an agent needs to write.
              name: text(key).replace(/^`|`$/g, '').replace('${string}', '<key>'),
              props: inlineAliases(paramsOf(value)),
              description: 'Per-key slot. Resolution order: this, then the general slot.',
              dynamic: true,
            })
          }
        }

        for (const member of typeMembers(typeArg)) {
          if (!ts.isPropertySignature(member)) continue
          api.slots.push({
            name: text(member.name).replace(/^'|'$/g, ''),
            props: inlineAliases(paramsOf(member.type)),
            description: jsDocOf(member),
          })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)

  return api
}

/**
 * Every component's public API, keyed by component name.
 *
 * `Field` and `Input` are separate entries even though they share a docs page:
 * they are separate components with separate props.
 */
export async function buildComponentApi() {
  const files = globSync('src/components/*/types.ts', { cwd: packageRoot })
    .map((file) => join(packageRoot, file))
    .sort()

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    exactOptionalPropertyTypes: true,
    skipLibCheck: true,
  })
  const checker = program.getTypeChecker()
  const components = new Map()

  for (const file of files) {
    const componentDir = dirname(file)
    const componentName = componentDir.split('/').at(-1)

    let sfc = ''
    try {
      sfc = await readFile(join(componentDir, `${componentName}.vue`), 'utf8')
    } catch {
      // A directory with types but no SFC has nothing more to report.
    }
    const { defaults, models, events, slots } = readSfcApi(sfc, componentName)
    const sourceFile = program.getSourceFile(file)

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isInterfaceDeclaration(node)) return
      if (!node.name.text.endsWith('Props')) return

      const props = []
      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || member.name === undefined) continue

        const name = member.name.getText(sourceFile)
        const declared = member.type?.getText(sourceFile) ?? ''
        const symbol = checker.getSymbolAtLocation(member.name)
        const type =
          TYPE_ALIASES.get(declared) ??
          stringifyType(checker, checker.getTypeOfSymbolAtLocation(symbol, member))
        const required = member.questionToken === undefined
        /*
         * An optional `boolean` with no entry in `withDefaults` still defaults
         * to `false`, not to absent: Vue casts a missing Boolean prop rather
         * than leaving it `undefined`. Reporting nothing there would describe a
         * state the component cannot be in.
         */
        const fallback = defaults.get(name) ?? (type === 'boolean' ? 'false' : undefined)

        props.push({
          name,
          type,
          required,
          default: required ? undefined : fallback,
          description: ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim(),
        })
      }

      if (props.length === 0) return

      components.set(componentName, {
        component: componentName,
        propsType: node.name.text,
        props,
        models,
        events,
        slots,
      })
    })
  }

  return components
}
