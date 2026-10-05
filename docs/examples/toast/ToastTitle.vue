<script setup lang="ts">
import { Button, useToast } from 'rowkit'

const { success } = useToast()
</script>

<template>
  <!-- A bold title over the message, for a toast that needs both. -->
  <Button
    variant="secondary"
    @click="success('3 people can now edit «Apollo».', { title: 'Invitations sent' })"
  >
    Send invitations
  </Button>
</template>
