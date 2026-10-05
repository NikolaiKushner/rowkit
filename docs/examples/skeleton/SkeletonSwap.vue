<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button, Skeleton } from 'rowkit'

interface Profile {
  name: string
  role: string
  bio: string
}

const profile = ref<Profile>()

async function load(): Promise<void> {
  profile.value = undefined
  await new Promise((resolve) => setTimeout(resolve, 1500))
  profile.value = {
    name: 'Grace Hopper',
    role: 'Rear admiral, programmer',
    bio: 'Wrote the first compiler and popularised the word «debugging».',
  }
}

onMounted(load)
</script>

<template>
  <!--
    The placeholder holds the content's size, so nothing jumps when it
    arrives. One label for the whole region, not one per bar.
  -->
  <div class="flex flex-col items-start gap-2">
    <div class="w-72 bg-card p-3 shadow-window">
      <div v-if="profile" class="text-ui">
        <b>{{ profile.name }}</b>
        <p class="m-0 text-text-subtle">{{ profile.role }}</p>
        <p class="m-0 mt-2">{{ profile.bio }}</p>
      </div>
      <div v-else class="flex flex-col gap-2">
        <Skeleton :lines="2" label="Loading the profile" />
        <Skeleton :lines="2" />
      </div>
    </div>
    <Button size="sm" variant="secondary" @click="load">Reload</Button>
  </div>
</template>
