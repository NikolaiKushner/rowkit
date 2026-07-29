import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import TablePagination from './TablePagination.vue'

const sizes = ['sm', 'md'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface TablePaginationArgs {
  total: number
  siblingCount: number
  showEdges: boolean
  hidePageSize: boolean
  hideSummary: boolean
  size: (typeof sizes)[number]
  disabled: boolean
}

/** Stateful wrapper — pagination is meaningless without somewhere to store the page. */
function stateful(args: Partial<TablePaginationArgs>, page = 1, pageSize = 10) {
  return {
    components: { TablePagination },
    setup: () => ({ args, page: ref(page), pageSize: ref(pageSize) }),
    template: `
      <div class="w-full max-w-2xl">
        <TablePagination v-bind="args" v-model:page="page" v-model:page-size="pageSize" />
      </div>
    `,
  }
}

const meta: Meta<TablePaginationArgs> = {
  title: 'Data/TablePagination',
  component: TablePagination,
  tags: ['autodocs'],
  args: {
    total: 247,
    siblingCount: 1,
    showEdges: true,
    hidePageSize: false,
    hideSummary: false,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    total: { control: 'number' },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    showEdges: { control: 'boolean' },
    hidePageSize: { control: 'boolean' },
    hideSummary: { control: 'boolean' },
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
  },
  render: (args) => stateful(args),
}

export default meta
type Story = StoryObj<TablePaginationArgs>

export const Default: Story = {}

/** Mid-list, where the ellipses and edge pages do their work. */
export const MiddleOfALongList: Story = {
  render: (args) => stateful(args, 12),
}

/** One page of results — the numbers collapse to a single control. */
export const SinglePage: Story = {
  args: { total: 8 },
}

/** Nothing matched. The summary reads "0 of 0" rather than "1–0 of 0". */
export const Empty: Story = {
  args: { total: 0 },
}

/** The last page is usually partial, and the summary has to say so. */
export const PartialLastPage: Story = {
  render: (args) => stateful(args, 25),
}

/**
 * Note the distinct `label` on each. Two landmarks sharing one accessible name
 * is an axe violation (`landmark-unique`), and it is the case you hit the
 * moment you put pagination above *and* below a long table.
 */
export const Sizes: Story = {
  render: () => ({
    components: { TablePagination },
    setup: () => ({ page: ref(3), pageSize: ref(10) }),
    template: `
      <div class="flex w-full max-w-2xl flex-col gap-6">
        <TablePagination
          size="sm"
          label="Users pagination (small)"
          :total="247"
          v-model:page="page"
          v-model:page-size="pageSize"
        />
        <TablePagination
          size="md"
          label="Users pagination (medium)"
          :total="247"
          v-model:page="page"
          v-model:page-size="pageSize"
        />
      </div>
    `,
  }),
}

/** Numbers only, for a compact toolbar. */
export const Minimal: Story = {
  args: { hidePageSize: true, hideSummary: true },
}

/** Replacing the summary — for another language, or another way of counting. */
export const CustomSummary: Story = {
  render: (args) => ({
    components: { TablePagination },
    setup: () => ({ args, page: ref(3), pageSize: ref(10) }),
    template: `
      <div class="w-full max-w-2xl">
        <TablePagination v-bind="args" v-model:page="page" v-model:page-size="pageSize">
          <template #summary="{ from, to, total }">
            Showing <strong>{{ from }}</strong> to <strong>{{ to }}</strong> of {{ total }} users
          </template>
        </TablePagination>
      </div>
    `,
  }),
}

/** Every control off, for use while a request is in flight. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => stateful(args, 3),
}

/** Paging forward updates both the current page and the range summary. */
export const PagingForward: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1–10 of 247')).toBeInTheDocument()

    await userEvent.click(canvas.getByLabelText('Next page'))

    await expect(canvas.getByText('11–20 of 247')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { current: 'page' })).toHaveTextContent('2')
  },
}

/** Jumping straight to a numbered page. */
export const JumpToPage: Story = {
  render: (args) => stateful(args, 12),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The last page is reachable in one click because `showEdges` is on.
    // Reka names page buttons "Page N" rather than the bare number.
    await userEvent.click(canvas.getByRole('button', { name: 'Page 25' }))

    await expect(canvas.getByText('241–247 of 247')).toBeInTheDocument()
  },
}

/**
 * Changing the page size emits `update:pageSize` and **nothing else** — the page
 * stays where it was. Most applications reset it to 1 in response; that is one
 * line at the call site, and it belongs there because only the application knows
 * whether it also means a refetch.
 */
export const ChangingPageSize: Story = {
  render: (args) => stateful(args, 9),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('81–90 of 247')).toBeInTheDocument()

    await userEvent.click(canvas.getByLabelText('Rows per page'))
    await userEvent.click(await within(document.body).findByRole('option', { name: '25' }))

    // Still page 9, now showing rows 201–225. The component moved nothing.
    await expect(canvas.getByRole('button', { current: 'page' })).toHaveTextContent('9')
    await expect(canvas.getByText('201–225 of 247')).toBeInTheDocument()
  },
}

/** The navigation is a landmark with an accessible name. */
export const Accessibility: Story = {
  render: (args) => stateful(args, 3),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { current: 'page' })).toHaveTextContent('3')

    // Exactly one page is current, whatever else is on screen.
    await expect(canvas.getAllByRole('button', { current: 'page' })).toHaveLength(1)
  },
}
