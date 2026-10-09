import { computed, ref, watch } from 'vue'
import { useClientSort } from 'rowkit'
import type { DataTableColumn, DataTableSort, FilterChip } from 'rowkit'
import { homeUsers, type HomeUser } from '../home-users'

/**
 * The live table at the top of the landing page: a Users list with search, a
 * status filter, sorting, selection and paging. The pencil edits a row and the
 * bin removes it — from this tab's copy of the list, nowhere else.
 */
export function useLandingDemo() {
  const people = ref<HomeUser[]>([...homeUsers])

  const search = ref('')
  // Seeded so the table opens with a chip, as the Figma hero draws it.
  const status = ref<HomeUser['status'] | undefined>('active')
  const sort = ref<DataTableSort<HomeUser> | undefined>({ key: 'name', direction: 'asc' })
  // Alan Turing and Barbara Liskov: both on page one under the seeded sort.
  const selected = ref<number[]>([3, 4])
  const page = ref(1)
  const pageSize = ref(25)

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
  watch([search, status, pageSize], () => {
    page.value = 1
  })

  const chips = computed<FilterChip[]>(() =>
    status.value ? [{ id: 'status', label: 'Status', value: label[status.value] }] : []
  )

  const sorted = useClientSort(filtered, sort, columns)

  const pageRows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return sorted.value.slice(start, start + pageSize.value)
  })

  function removeFilter(): void {
    status.value = undefined
  }

  function clearFilters(): void {
    search.value = ''
    status.value = undefined
  }

  function remove(id: number): void {
    people.value = people.value.filter((row) => row.id !== id)
    selected.value = selected.value.filter((other) => other !== id)
  }

  /** Writes an edited row back, by id. */
  function update(user: HomeUser): void {
    people.value = people.value.map((row) => (row.id === user.id ? user : row))
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
    removeFilter,
    clearFilters,
    remove,
    update,
  }
}

export const columns: DataTableColumn<HomeUser>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '170px' },
  { key: 'email', header: 'Email', width: '220px' },
  { key: 'role', header: 'Role', sortable: true, width: '96px' },
  { key: 'status', header: 'Status', width: '104px' },
  { key: 'seats', header: 'Seats', sortable: true, numeric: true, width: '72px' },
  { id: 'actions', header: 'Actions', headerSrOnly: true, width: '64px' },
]

/** The phone's table (Figma Landing, 390): name and status. */
export const phoneColumns = columns.filter(
  (column) => 'key' in column && (column.key === 'name' || column.key === 'status')
)

/** Status as the badges read it. */
export const label = { active: 'Active', invited: 'Invited', suspended: 'Suspended' } as const

export const tone = { active: 'success', invited: 'warning', suspended: 'danger' } as const
