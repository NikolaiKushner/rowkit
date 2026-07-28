import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'
import Field from '../Field/Field.vue'
import Select from './Select.vue'
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
  loading: boolean
  disabled: boolean
  invalid: boolean
  size: 'sm' | 'md' | 'lg'
}

/**
 * Storybook's story types expect a concrete component. `Select` is generic over
 * its value type, which cannot be expressed in that position — the generic
 * surface is covered by the typed unit tests instead.
 */
const SelectComponent = Select as unknown as ConcreteComponent<SelectArgs>

const meta: Meta<SelectArgs> = {
  title: 'Foundations/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  args: {
    options: statuses,
    placeholder: 'Select a status',
    searchable: false,
    loading: false,
    disabled: false,
    invalid: false,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { Select: SelectComponent },
    setup: () => ({ args, value: ref<string | undefined>(undefined) }),
    template: `<div class="w-80"><Select v-bind="args" v-model="value" /></div>`,
  }),
}

export default meta
type Story = StoryObj<SelectArgs>

export const Default: Story = {}

export const WithValue: Story = {
  render: (args) => ({
    components: { Select: SelectComponent },
    setup: () => ({ args, value: ref('invited') }),
    template: `<div class="w-80"><Select v-bind="args" v-model="value" /></div>`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Select: SelectComponent },
    setup: () => ({ statuses, sizes: ['sm', 'md', 'lg'] as const }),
    template: `
      <div class="flex w-80 flex-col gap-3">
        <Select v-for="size in sizes" :key="size" :size="size" :options="statuses" :placeholder="size" />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { Select: SelectComponent },
    setup: () => ({ statuses }),
    template: `
      <div class="flex w-80 flex-col gap-3">
        <Select :options="statuses" placeholder="Default" />
        <Select :options="statuses" placeholder="Invalid" invalid />
        <Select :options="statuses" placeholder="Disabled" disabled />
        <Select :options="[]" placeholder="Loading" loading />
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
 * With `manualFilter` the list is whatever the consumer put in `options` —
 * bind `searchTerm` to fetch it. Filtering locally as well would hide results
 * that matched on a field the label does not show.
 */
export const AsyncOptions: Story = {
  render: () => ({
    components: { Select: SelectComponent },
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
          :options="options"
          :loading="loading"
          :search-term="term"
          manual-filter
          searchable
          placeholder="Search countries"
          empty-text="No countries match"
          @update:search-term="onSearch"
        />
      </div>
    `,
  }),
}

export const InAField: Story = {
  render: () => ({
    components: { Field, Select: SelectComponent },
    setup: () => ({ statuses }),
    template: `
      <div class="w-80">
        <Field label="Status" hint="Controls whether the user can sign in.">
          <Select :options="statuses" placeholder="Select a status" />
        </Field>
      </div>
    `,
  }),
}

/** The primary behaviour: open, choose, and see the choice reflected. */
export const SelectingAnOption: Story = {
  render: (args) => ({
    components: { Select: SelectComponent },
    setup: () => {
      const value = ref<string | undefined>(undefined)
      return { args, value }
    },
    template: `
      <div class="w-80">
        <Select v-bind="args" v-model="value" />
        <p class="mt-2 text-sm text-text-muted">Value: <span data-testid="echo">{{ value ?? 'none' }}</span></p>
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
