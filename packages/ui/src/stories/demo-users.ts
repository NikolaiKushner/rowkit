/**
 * Shared demo users for Storybook compositions.
 *
 * Keep this small and deterministic — stories and the playground can each grow
 * their own long lists, but Default / hero stories should agree on names,
 * status tones and column shape so the library does not look like three kits.
 */

export interface DemoUser {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
  lastActive: string
}

export const demoUsers: DemoUser[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'Owner',
    status: 'active',
    seats: 3,
    lastActive: '2 minutes ago',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'Admin',
    status: 'active',
    seats: 12,
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'Member',
    status: 'invited',
    seats: 1,
    lastActive: 'never',
  },
  {
    id: 4,
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'Member',
    status: 'suspended',
    seats: 0,
    lastActive: '3 weeks ago',
  },
  {
    id: 5,
    name: 'Barbara Liskov',
    email: 'barbara@example.com',
    role: 'Admin',
    status: 'active',
    seats: 7,
    lastActive: '20 minutes ago',
  },
  {
    id: 6,
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    role: 'Owner',
    status: 'active',
    seats: 24,
    lastActive: 'yesterday',
  },
]

export const demoStatusTone = {
  active: 'success',
  invited: 'warning',
  suspended: 'danger',
} as const

export const demoRoleOptions = [
  { label: 'Owner', value: 'Owner' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Member', value: 'Member' },
  { label: 'Billing', value: 'Billing' },
]

export const demoStatusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' },
]
