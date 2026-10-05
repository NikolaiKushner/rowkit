<script setup lang="ts">
import { Badge, DataTable, type DataTableColumn } from 'rowkit'

interface Entry {
  id: number
  time: string
  level: 'info' | 'warn' | 'error'
  source: string
  message: string
}

const columns: DataTableColumn<Entry>[] = [
  { key: 'time', header: 'Time', numeric: true, align: 'start', width: '80px' },
  { key: 'level', header: 'Level', width: '64px' },
  { key: 'source', header: 'Source', width: '90px' },
  { key: 'message', header: 'Message' },
]

const messages = [
  ['info', 'api', 'GET /users 200 in 41 ms'],
  ['info', 'worker', 'Export job 812 started'],
  ['warn', 'api', 'Slow query on users.email, 1.2 s'],
  ['info', 'auth', 'Session renewed for ada@example.com'],
  ['error', 'worker', 'Export job 812 failed: disk full'],
  ['info', 'api', 'POST /invoices 201 in 88 ms'],
] as const

// Forty lines of a log, generated so the page renders the same everywhere.
const log: Entry[] = Array.from({ length: 40 }, (_, i) => {
  const [level, source, message] = messages[i % messages.length] ?? messages[0]
  const seconds = String((i * 7) % 60).padStart(2, '0')
  return {
    id: i + 1,
    time: `14:${String(10 + Math.floor(i / 8))}:${seconds}`,
    level,
    source,
    message,
  }
})

const tone = { info: 'neutral', warn: 'warning', error: 'danger' } as const
</script>

<template>
  <!-- 18px rows and the drawn Windows 98 scroll bars, for a log you read a lot of. -->
  <DataTable
    :rows="log"
    :columns="columns"
    caption="Server log"
    size="sm"
    scrollbars="drawn"
    class="h-56"
  >
    <template #[`cell:level`]="{ row }">
      <Badge :variant="tone[row.level]" size="sm">{{ row.level }}</Badge>
    </template>
  </DataTable>
</template>
