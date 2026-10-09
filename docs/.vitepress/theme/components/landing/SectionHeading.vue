<script setup lang="ts">
/**
 * A landing section's heading: the label above it (THEMES, COMPONENTS…, in
 * vermilion; the modern theme's only), the title, and a lead paragraph from
 * the slot. Centred on a wide screen, flush left on a phone.
 */
withDefaults(
  defineProps<{
    id: string
    label: string
    title: string
    align?: 'center' | 'start'
  }>(),
  { align: 'center' }
)
</script>

<template>
  <div
    class="flex max-w-[720px] flex-col gap-3.5"
    :class="align === 'center' && 'md:mx-auto md:items-center md:text-center'"
  >
    <p
      class="text-[12px] leading-4 font-semibold tracking-[0.08em] text-(--lp-accent) uppercase win98:hidden"
    >
      {{ label }}
    </p>
    <h2
      :id="id"
      class="text-[26px] leading-[32px] font-semibold tracking-[-0.01em] text-foreground md:text-[32px] md:leading-[40px] win98:font-bold"
    >
      {{ title }}
    </h2>
    <p
      v-if="$slots.default"
      class="text-[17px] leading-[26px] text-muted-foreground md:text-[20px] md:leading-[30px]"
    >
      <slot />
    </p>
  </div>
</template>
