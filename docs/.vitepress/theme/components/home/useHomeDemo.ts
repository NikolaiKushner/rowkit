import { computed, ref, watch } from 'vue'
import { useClientSort } from 'rowkit'
import type { DataTableColumn, DataTableSort, FilterChip } from 'rowkit'
import { homeUsers, type HomeUser } from '../home-users'

/**
 * The live demo on the home page: a Users list with search, a status filter,
 * sorting, selection, paging, and actions that really act — Export downloads
 * the selected rows, Delete removes them from this tab's copy of the list,
 * and in the modern theme New user adds one.
 */
export function useHomeDemo() {
  const people = ref<HomeUser[]>([...homeUsers])

  const search = ref('')
  // Seeded so the window opens with a chip, as the Figma desktop shows it.
  const status = ref<HomeUser['status'] | undefined>('active')
  const sort = ref<DataTableSort<HomeUser> | undefined>({ key: 'name', direction: 'asc' })
  // Alan Turing and Katherine Johnson: on page one under the seeded sort.
  const selected = ref<number[]>([3, 5])
  const page = ref(1)
  const pageSize = 25

  const filtered = computed(() => {
    const query = search.value.trim().toLowerCase()
    return people.value.filter((row) => {
      if (status.value && row.status !== status.value) return false
      if (!query) return true
      return row.name.toLowerCase().includes(query) || row.email.toLowerCase().includes(query)
    })
  })

  // Pagination never moves the page itself; the application does, so a
  // narrowed list does not leave the reader on an empty page.
  watch([search, status], () => {
    page.value = 1
  })

  const chips = computed<FilterChip[]>(() =>
    status.value ? [{ id: 'status', label: 'Status', value: label[status.value] }] : []
  )

  const sorted = useClientSort(filtered, sort, columns)

  const pageRows = computed(() => {
    const start = (page.value - 1) * pageSize
    return sorted.value.slice(start, start + pageSize)
  })

  const range = computed(() => {
    const total = filtered.value.length
    if (total === 0) return '0 of 0'
    const from = (page.value - 1) * pageSize + 1
    return `${String(from)}–${String(Math.min(total, from + pageSize - 1))} of ${String(total)}`
  })

  function removeFilter(): void {
    status.value = undefined
  }

  function clearFilters(): void {
    search.value = ''
    status.value = undefined
  }

  function remove(ids: number[]): void {
    people.value = people.value.filter((row) => !ids.includes(row.id))
    selected.value = selected.value.filter((id) => !ids.includes(id))
  }

  /** A row not yet in the list, for New user: saved through `add`. */
  function blank(): HomeUser {
    const id = Math.max(0, ...people.value.map((row) => row.id)) + 1
    return {
      id,
      name: '',
      email: '',
      role: 'Member',
      status: 'invited',
      seats: 0,
      lastActive: 'never',
    }
  }

  /** Adds a new row and selects it, so it is easy to find in the list. */
  function add(user: HomeUser): void {
    people.value = [...people.value, user]
    selected.value = [user.id]
  }

  /** Writes an edited row back, by id. */
  function update(user: HomeUser): void {
    people.value = people.value.map((row) => (row.id === user.id ? user : row))
  }

  /** The selected rows as a CSV file, downloaded. */
  function exportSelected(): void {
    const rows = people.value.filter((row) => selected.value.includes(row.id))
    const lines = [
      'Name,Email,Role,Status,Seats',
      ...rows.map((row) => [row.name, row.email, row.role, row.status, row.seats].join(',')),
    ]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    const link = Object.assign(document.createElement('a'), { href: url, download: 'users.csv' })
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    search,
    status,
    sort,
    selected,
    page,
    pageSize,
    filtered,
    chips,
    pageRows,
    range,
    removeFilter,
    clearFilters,
    remove,
    blank,
    add,
    update,
    exportSelected,
  }
}

export const columns: DataTableColumn<HomeUser>[] = [
  // The modern window has 12px margins round the table; `modern.css` narrows
  // Name and Seats there so the actions column is not cut off.
  { key: 'name', header: 'Name', sortable: true, width: 'var(--rk-demo-name-width, 150px)' },
  { key: 'email', header: 'Email', width: '170px' },
  { key: 'role', header: 'Role', sortable: true, width: '96px' },
  { key: 'status', header: 'Status', width: '96px' },
  {
    key: 'seats',
    header: 'Seats',
    sortable: true,
    numeric: true,
    width: 'var(--rk-demo-seats-width, 80px)',
  },
  { id: 'actions', header: 'Actions', headerSrOnly: true, width: '56px' },
]

/** Status as the badges read it. */
export const label = { active: 'Active', invited: 'Invited', suspended: 'Suspended' } as const

export const tone = { active: 'success', invited: 'warning', suspended: 'danger' } as const
