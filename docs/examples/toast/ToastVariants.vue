<script setup lang="ts">
import { Button, useToast } from 'rowkit'

const { toast, success, warning, danger, dismissAll } = useToast()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="secondary" @click="toast('Export started')">neutral</Button>
    <Button variant="secondary" @click="success('Changes saved')">success</Button>
    <Button variant="secondary" @click="warning('Two seats left on this plan')">warning</Button>
    <Button variant="secondary" @click="danger('Payment failed')">danger</Button>
    <Button variant="ghost" @click="dismissAll()">Dismiss all</Button>
  </div>
</template>
