import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'
import Field from '../Field/Field.vue'
import Select from './Select.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'
import SelectTrigger from './SelectTrigger.vue'
import type { SelectOption } from './types'

const statuses: SelectOption<string>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended', disabled: true },
]

const countries: SelectOption<string>[] = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'India',
  'Ireland',
  'Italy',
  'Japan',
  'Kenya',
  'Latvia',
  'Mexico',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Spain',
  'Sweden',
  'Ukraine',
  'United Kingdom',
].map((label) => ({ label, value: label.toLowerCase().replace(/\s+/g, '-') }))

/**
 * Select is generic over its value type, which Storybook's inferred arg types
 * cannot express at all — hence an explicit interface rather than
 * `Meta<typeof Select>`.
 */
interface SelectArgs {
  options: SelectOption<string>[]
  placeholder: string
  searchable: boolean
  manualFilter: boolean
  loading: boolean
  disabled: boolean
  invalid: boolean
  size: 'sm' | 'md' | 'lg'
  emptyText: string
}

/**
 * Storybook's story types expect a concrete component. `Select` is generic over
 * its value type, which cannot be expressed in that position — the generic
 * surface is covered by the typed unit tests instead.
 */
const SelectComponent = Select as unknown as ConcreteComponent<SelectArgs>
const SelectItemComponent = SelectItem as unknown as ConcreteComponent
const parts = {
  Select: SelectComponent,
  SelectTrigger,
  SelectContent,
  SelectItem: SelectItemComponent,
}

const meta: Meta<SelectArgs> = {
  title: 'Foundations/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  args: {
    options: statuses,
    placeholder: 'Select a status',
    searchable: false,
    manualFilter: false,
    loading: false,
    disabled: false,
    invalid: false,
    size: 'md',
    emptyText: 'No results',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: parts,
    setup: () => ({ args, value: ref<string | undefined>(undefined) }),
    template: `
      <div class="w-80">
        <Select
          v-model="value"
          :searchable="args.searchable"
          :manual-filter="args.manualFilter"
          :disabled="args.disabled"
          :invalid="args.invalid"
        >
          <SelectTrigger :placeholder="args.placeholder" :size="args.size" />
          <SelectContent :loading="args.loading" :empty-text="args.emptyText">
            <SelectItem
              v-for="option in args.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            />
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<SelectArgs>

export const Default: Story = {
  render: (args) => ({
    components: parts,
    setup: () => ({ args, value: ref('active') }),
    template: `
      <div class="w-80">
        <Select v-model="value" :searchable="args.searchable">
          <SelectTrigger :placeholder="args.placeholder" :size="args.size" />
          <SelectContent>
            <SelectItem
              v-for="option in args.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            />
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const Empty: Story = {}

export const WithValue: Story = {
  render: (args) => ({
    components: parts,
    setup: () => ({ args, value: ref('invited') }),
    template: `
      <div class="w-80">
        <Select v-model="value">
          <SelectTrigger :placeholder="args.placeholder" />
          <SelectContent>
            <SelectItem
              v-for="option in args.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            />
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ statuses, sizes: ['sm', 'md', 'lg'] as const }),
    template: `
      <div class="flex w-80 flex-col gap-3">
        <Select v-for="size in sizes" :key="size">
          <SelectTrigger :size="size" :placeholder="size" />
          <SelectContent>
            <SelectItem
              v-for="option in statuses"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            />
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ statuses }),
    template: `
      <div class="flex w-80 flex-col gap-3">
        <Select>
          <SelectTrigger placeholder="Default" />
          <SelectContent>
            <SelectItem v-for="option in statuses" :key="option.value" :value="option.value" :label="option.label" :disabled="option.disabled" />
          </SelectContent>
        </Select>
        <Select invalid>
          <SelectTrigger placeholder="Invalid" />
          <SelectContent>
            <SelectItem v-for="option in statuses" :key="option.value" :value="option.value" :label="option.label" :disabled="option.disabled" />
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger placeholder="Disabled" />
          <SelectContent>
            <SelectItem v-for="option in statuses" :key="option.value" :value="option.value" :label="option.label" :disabled="option.disabled" />
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger placeholder="Loading" />
          <SelectContent loading />
        </Select>
      </div>
    `,
  }),
}

/**
 * Worth turning on somewhere around twenty options. Below that the search box
 * costs a keystroke and saves nothing.
 */
export const Searchable: Story = {
  args: { options: countries, searchable: true, placeholder: 'Select a country' },
}

/**
 * With `manualFilter` the list is whatever the consumer rendered — bind
 * `searchTerm` to fetch it. Filtering locally as well would hide results that
 * matched on a field the label does not show.
 */
export const AsyncOptions: Story = {
  render: () => ({
    components: parts,
    setup: () => {
      const term = ref('')
      const loading = ref(false)
      const options = ref<SelectOption<string>[]>([])
      let seq = 0

      const onSearch = (value: string) => {
        term.value = value
        const run = ++seq
        loading.value = true
        setTimeout(() => {
          // A stale response must not overwrite a newer one.
          if (run !== seq) return
          options.value = countries.filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          )
          loading.value = false
        }, 400)
      }

      return { term, loading, options, onSearch }
    },
    template: `
      <div class="w-80">
        <Select
          :search-term="term"
          manual-filter
          searchable
          @update:search-term="onSearch"
        >
          <SelectTrigger placeholder="Search countries" />
          <SelectContent :loading="loading" empty-text="No countries match">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const InAField: Story = {
  render: () => ({
    components: { ...parts, Field },
    setup: () => ({ statuses }),
    template: `
      <div class="w-80">
        <Field label="Status" hint="Controls whether the user can sign in.">
          <Select>
            <SelectTrigger placeholder="Select a status" />
            <SelectContent>
              <SelectItem
                v-for="option in statuses"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :disabled="option.disabled"
              />
            </SelectContent>
          </Select>
        </Field>
      </div>
    `,
  }),
}

/** The primary behaviour: open, choose, and see the choice reflected. */
export const SelectingAnOption: Story = {
  render: (args) => ({
    components: parts,
    setup: () => {
      const value = ref<string | undefined>(undefined)
      return { args, value }
    },
    template: `
      <div class="w-80">
        <Select v-model="value">
          <SelectTrigger :placeholder="args.placeholder" />
          <SelectContent>
            <SelectItem
              v-for="option in args.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            />
          </SelectContent>
        </Select>
        <p class="mt-2 text-sm text-muted-foreground">Value: <span data-testid="echo">{{ value ?? 'none' }}</span></p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('combobox')

    await userEvent.click(control)
    // The listbox is portalled out of the story root, so it is found on the page.
    const invited = await within(document.body).findByRole('option', { name: 'Invited' })
    await userEvent.click(invited)

    await expect(canvas.getByTestId('echo')).toHaveTextContent('invited')
  },
}

/** Regression guard: the control has to be operable without a mouse. */
export const KeyboardOnly: Story = {
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('combobox')

    control.focus()
    await expect(control).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(control).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    await expect(control).toHaveAttribute('aria-expanded', 'false')
  },
}

/**
 * Tabbing to the trigger paints a visible focus ring.
 *
 * `outline-none` removes the browser's own indicator, so the replacement has to
 * actually render — and it is a `box-shadow`, which nothing in the class list
 * can confirm. A trigger that lost its ring looks identical at rest and is
 * unusable by keyboard.
 */
export const FocusRingIsVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')

    // The ring paints on the anchor, not on the input that holds focus.
    const anchor = trigger.parentElement
    if (!anchor) throw new Error('no anchor around the combobox')

    // `shadow-xs` is already on the anchor at rest, so "has a box-shadow" is
    // true whether or not the ring works. The only assertion that separates the
    // two is that focusing *changes* it.
    const resting = getComputedStyle(anchor).boxShadow

    // Keyboard, not `.focus()` — `:focus-visible` is what the recipe hangs on,
    // and browsers deliberately withhold it from a pointer click.
    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    const focused = getComputedStyle(anchor).boxShadow
    await expect(focused).not.toBe(resting)
    await expect(focused).not.toBe('none')

    // The input keeps its own outline suppressed, or two indicators stack.
    await expect(getComputedStyle(trigger).outlineStyle).toBe('none')
  },
}
