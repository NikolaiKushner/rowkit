<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  EmptyState,
  StatusBar,
  StatusBarSection,
  Window,
  WindowBody,
  WindowTitleBar,
} from 'rowkit'

const messages = ref<string[]>([])
</script>

<template>
  <!-- An empty list inside an application window: the empty state fills the white well. -->
  <Window class="w-full max-w-[420px]">
    <WindowTitleBar title="Inbox — Mail" />
    <WindowBody class="flex h-48 items-center justify-center bg-input shadow-sunken">
      <ul v-if="messages.length" class="m-0 self-start p-2 text-ui">
        <li v-for="message in messages" :key="message">{{ message }}</li>
      </ul>
      <EmptyState
        v-else
        size="sm"
        title="No new mail"
        description="Messages you receive appear here."
        :level="3"
      >
        <template #actions>
          <Button size="sm" variant="secondary" @click="messages = ['Welcome to Mail']">
            Check now
          </Button>
        </template>
      </EmptyState>
    </WindowBody>
    <StatusBar>
      <StatusBarSection>{{ messages.length }} messages</StatusBarSection>
    </StatusBar>
  </Window>
</template>
