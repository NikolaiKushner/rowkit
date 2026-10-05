<script setup lang="ts">
import { Button, ButtonGroup, Separator } from 'rowkit'
</script>

<template>
  <!--
    Groups inside a group sit 4px apart; a vertical Separator draws the etched
    line. Small buttons keep a toolbar of four on one line on a phone.
  -->
  <ButtonGroup aria-label="Selection">
    <ButtonGroup>
      <Button variant="ghost" size="sm">Export</Button>
      <Button variant="ghost" size="sm">Delete</Button>
    </ButtonGroup>
    <Separator orientation="vertical" />
    <ButtonGroup>
      <Button variant="ghost" size="sm">Archive</Button>
      <Button variant="ghost" size="sm">Report</Button>
    </ButtonGroup>
  </ButtonGroup>
</template>
