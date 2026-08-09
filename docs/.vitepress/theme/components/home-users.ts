/**
 * Demo roster behind the homepage money shot.
 *
 * Big enough to page through — the hero is claiming rowkit is for data-dense
 * screens, and a six-row table with a single page of results quietly says the
 * opposite. Several pages at 25 rows is the smallest set that reads as a real
 * workspace rather than a fixture.
 *
 * Generated from a name list rather than written out, because eighty literal
 * objects is eighty chances for the demo data to drift out of shape, and none
 * of the fields carry meaning beyond looking plausible. Derivations are pure
 * index arithmetic so the table is identical on every render and in every
 * screenshot — a hero that reshuffles itself makes visual diffs useless.
 */

export interface HomeUser {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
  lastActive: string
}

const NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Barbara Liskov',
  'Katherine Johnson',
  'Margaret Hamilton',
  'Edsger Dijkstra',
  'Donald Knuth',
  'Frances Allen',
  'Ken Thompson',
  'Dennis Ritchie',
  'Radia Perlman',
  'Leslie Lamport',
  'Adele Goldberg',
  'Alan Kay',
  'Jean Bartik',
  'Tim Berners-Lee',
  'Sophie Wilson',
  'Vint Cerf',
  'Karen Spärck Jones',
  'Niklaus Wirth',
  'Shafi Goldwasser',
  'John McCarthy',
  'Evelyn Boyd Granville',
  'Peter Naur',
  'Erna Hoover',
  'Tony Hoare',
  'Mary Kenneth Keller',
  'Douglas Engelbart',
  'Lynn Conway',
  'Bjarne Stroustrup',
  'Anita Borg',
  'Rasmus Lerdorf',
  'Carol Shaw',
  'Guido van Rossum',
  'Roberta Williams',
  'James Gosling',
  'Elizabeth Feinler',
  'Brendan Eich',
  'Susan Kare',
  'Linus Torvalds',
  'Kathleen Booth',
  'Yukihiro Matsumoto',
  'Ruzena Bajcsy',
  'Brian Kernighan',
  'Irene Greif',
  'Rich Hickey',
  'Barbara Grosz',
  'Anders Hejlsberg',
  'Éva Tardos',
  'John Backus',
  'Nancy Lynch',
  'Robert Metcalfe',
  'Manuela Veloso',
  'Butler Lampson',
  'Deborah Estrin',
  'Fernando Corbató',
  'Cynthia Dwork',
  'Ivan Sutherland',
  'Maria Klawe',
  'Whitfield Diffie',
  'Jeannette Wing',
  'Martin Hellman',
  'Dina Katabi',
  'Ronald Rivest',
  'Susan Landau',
  'Adi Shamir',
  'Bonnie Berger',
  'Michael Stonebraker',
  'Andrea Goldsmith',
  'Jim Gray',
  'Daphne Koller',
  'Charles Bachman',
  'Kunle Olukotun',
  'Jeff Dean',
  'Fei-Fei Li',
  'Sanjay Ghemawat',
  'Regina Barzilay',
  'Doug Cutting',
  'Latanya Sweeney',
]

const LAST_ACTIVE = [
  '2 minutes ago',
  '20 minutes ago',
  '1 hour ago',
  '3 hours ago',
  'yesterday',
  '2 days ago',
  'last week',
  '3 weeks ago',
]

/** `Ada Lovelace` → `ada.lovelace` — unique per row, since every name is. */
function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]+/g, '.')
    .replace(/^\.|\.$/g, '')
}

function roleAt(i: number): string {
  if (i % 17 === 0) return 'Owner'
  if (i % 3 === 1) return 'Admin'
  return 'Member'
}

function statusAt(i: number): HomeUser['status'] {
  if (i % 11 === 6) return 'invited'
  if (i % 19 === 9) return 'suspended'
  return 'active'
}

export const homeUsers: HomeUser[] = NAMES.map((name, i) => {
  const status = statusAt(i)
  return {
    id: i + 1,
    name,
    email: `${slug(name)}@example.com`,
    role: roleAt(i),
    status,
    // A suspended seat is a released seat; an invite has not claimed one yet.
    seats: status === 'active' ? ((i * 7) % 23) + 1 : 0,
    lastActive: status === 'invited' ? 'never' : LAST_ACTIVE[i % LAST_ACTIVE.length],
  }
})
