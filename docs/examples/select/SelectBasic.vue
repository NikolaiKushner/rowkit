<script setup lang="ts">
import { ref } from 'vue'
import { Field, Select, SelectContent, SelectItem, SelectTrigger, type SelectOption } from 'rowkit'

type Role = 'owner' | 'admin' | 'member'

const roles: SelectOption<Role>[] = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
]

// Typed by the values you pass: Role | undefined.
const role = ref<Role>()
</script>

<template>
  <Field label="Role" class="w-52">
    <Select v-model="role">
      <SelectTrigger placeholder="Choose a role" />
      <SelectContent>
        <SelectItem
          v-for="option in roles"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </SelectContent>
    </Select>
  </Field>
</template>
