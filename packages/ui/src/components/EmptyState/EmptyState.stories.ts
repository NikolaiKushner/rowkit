import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import Button from '../Button/Button.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import EmptyState from './EmptyState.vue'

const sizes = ['sm', 'md', 'lg'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface EmptyStateArgs {
  title: string
  description?: string
  reason: 'no-data' | 'no-results' | 'error'
  size: (typeof sizes)[number]
  level: 1 | 2 | 3 | 4 | 5 | 6
  announce: boolean
}

/** A plain box icon. Decorative, so it is hidden from assistive technology. */
const boxIcon = `
  <svg viewBox="0 0 24 24" fill="none" class="size-full" aria-hidden="true">
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    <path d="m3 7.5 9 4.5m0 0 9-4.5M12 12v9" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
  </svg>
`

const meta: Meta<EmptyStateArgs> = {
  title: 'Data/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description: 'Projects group your work and control who can see it.',
    reason: 'no-data',
    size: 'md',
    level: 2,
    announce: false,
  },
  argTypes: {
    reason: { control: 'inline-radio', options: ['no-data', 'no-results', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: sizes },
    level: { control: { type: 'number', min: 1, max: 6 } },
    announce: { control: 'boolean' },
  },
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args }),
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<EmptyStateArgs>

export const Default: Story = {}

/**
 * The three reasons side by side. They look alike and mean completely different
 * things: only `no-data` should offer "create", `no-results` wants the filter
 * undone, and `error` must not read as "this worked and there is nothing here".
 */
export const Reasons: Story = {
  render: () => ({
    components: { EmptyState, Button },
    template: `
      <div class="flex w-full max-w-lg flex-col gap-4">
        <div class="rounded-lg border border-border bg-card">
          <EmptyState
            reason="no-data"
            title="No projects yet"
            description="Projects group your work and control who can see it."
          >
            <template #actions><Button size="sm">Create a project</Button></template>
          </EmptyState>
        </div>
        <div class="rounded-lg border border-border bg-card">
          <EmptyState announce reason="no-results" title="No projects match those filters">
            <template #actions><Button variant="ghost" size="sm">Clear filters</Button></template>
          </EmptyState>
        </div>
        <div class="rounded-lg border border-border bg-card">
          <EmptyState announce reason="error" title="Could not load projects">
            <template #actions><Button variant="ghost" size="sm">Try again</Button></template>
          </EmptyState>
        </div>
      </div>
    `,
  }),
}

/**
 * `no-results` and `error` supply their own explanation, because that copy is
 * genuinely generic. `no-data` supplies none — what to do when nothing exists
 * yet depends entirely on the domain.
 */
export const DefaultCopy: Story = {
  args: { reason: 'no-results', title: 'No users match those filters' },
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args }),
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState v-bind="args" />
      </div>
    `,
  }),
}

/**
 * Title alone, when the situation genuinely needs no explanation.
 *
 * Rendered without the prop rather than with `description: undefined` — under
 * `exactOptionalPropertyTypes` an explicit undefined is not the same as an
 * omission.
 */
export const TitleOnly: Story = {
  render: () => ({
    components: { EmptyState },
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState title="No projects yet" />
      </div>
    `,
  }),
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args, boxIcon }),
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState v-bind="args">
          <template #icon><span v-html="boxIcon" /></template>
        </EmptyState>
      </div>
    `,
  }),
}

/**
 * The first-run case: nothing exists yet, so the job is to get the user to
 * create the first one. One primary action, no competing choices.
 */
export const FirstRun: Story = {
  render: () => ({
    components: { EmptyState, Button },
    setup: () => ({ boxIcon }),
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState
          title="No projects yet"
          description="Projects group your work and control who can see it."
        >
          <template #icon><span v-html="boxIcon" /></template>
          <template #actions>
            <Button>Create a project</Button>
            <Button variant="ghost">Learn more</Button>
          </template>
        </EmptyState>
      </div>
    `,
  }),
}

/**
 * The filtered case, and the one most libraries get wrong. Nothing matched, so
 * the useful action is undoing the filter — not creating a record.
 *
 * `announce` is on: this replaced a table of results, and without it a screen
 * reader user gets no indication that the list emptied.
 */
export const NoResults: Story = {
  render: () => ({
    components: { EmptyState, Button },
    template: `
      <div class="w-full max-w-lg rounded-lg border border-border bg-card">
        <EmptyState
          announce
          title="No users match those filters"
          description="Try removing a filter or searching for a different name."
        >
          <template #actions>
            <Button variant="ghost">Clear filters</Button>
          </template>
        </EmptyState>
      </div>
    `,
  }),
}

/** Sized down to sit inside a table body without dwarfing the header. */
export const InATable: Story = {
  render: () => ({
    components: { EmptyState, Button },
    template: `
      <table class="w-full max-w-lg border-collapse rounded-lg text-sm">
        <thead>
          <tr class="border-b border-border text-left">
            <th class="p-2 font-medium text-muted-foreground">User</th>
            <th class="p-2 font-medium text-muted-foreground">Role</th>
            <th class="p-2 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3">
              <EmptyState
                size="sm"
                :level="3"
                title="No users yet"
                description="Invite someone to get started."
              >
                <template #actions>
                  <Button size="sm">Invite a teammate</Button>
                </template>
              </EmptyState>
            </td>
          </tr>
        </tbody>
      </table>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { EmptyState },
    setup: () => ({ sizes }),
    template: `
      <div class="flex w-full max-w-lg flex-col gap-4">
        <div v-for="size in sizes" :key="size" class="rounded-lg border border-border bg-card">
          <EmptyState :size="size" :title="size" description="Every part scales together." />
        </div>
      </div>
    `,
  }),
}

/**
 * Loading and empty are different states and should look it. This is the pair
 * DataTable composes: `Skeleton` while the request is in flight, `EmptyState`
 * once it comes back with nothing.
 */
export const AgainstLoading: Story = {
  render: () => ({
    components: { EmptyState, Skeleton },
    template: `
      <div class="flex w-full max-w-lg flex-col gap-4">
        <div class="rounded-lg border border-border bg-card p-4">
          <div role="status" aria-busy="true" aria-label="Loading projects" class="flex flex-col gap-3">
            <Skeleton v-for="row in 3" :key="row" />
          </div>
        </div>
        <div class="rounded-lg border border-border bg-card">
          <EmptyState title="No projects yet" description="Projects group your work." />
        </div>
      </div>
    `,
  }),
}

/**
 * The accessibility contract: a heading that can be navigated to, and an
 * announcement only when the state replaced something.
 */
export const Announces: Story = {
  args: { announce: true, title: 'No users match those filters' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const region = canvas.getByRole('status')
    await expect(region).toHaveTextContent('No users match those filters')

    // The title is reachable by heading navigation, not just visually bold.
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'No users match those filters' })
    ).toBeInTheDocument()
  },
}

/** Unannounced by default — a first-run empty state is not a change. */
export const Silent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('status')).toBeNull()
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument()
  },
}

/** Continuing an existing outline rather than restarting it. */
export const HeadingLevel: Story = {
  args: { level: 4, title: 'No comments' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 4, name: 'No comments' })).toBeInTheDocument()
  },
}
