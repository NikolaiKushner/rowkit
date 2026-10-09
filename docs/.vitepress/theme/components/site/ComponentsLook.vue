<script setup lang="ts">
import { onMounted, useId } from 'vue'
import { readSiteTheme, setSiteTheme, siteTheme, type SiteTheme } from './useSiteTheme'

/**
 * The switch for which rowkit theme the live examples
 * are drawn in. VitePress's chrome around them stays as it is — this changes
 * the components, not the site.
 *
 * Two radio buttons styled as a segmented control: one tab stop, the arrows
 * move between them, and the group is named.
 */
const looks: { value: SiteTheme; label: string }[] = [
  { value: 'win98', label: 'Windows 98' },
  { value: 'modern', label: 'Modern' },
]

/** Its own group name: the switch can be on the page twice (nav bar and phone menu). */
const name = useId()

onMounted(readSiteTheme)
</script>

<template>
  <div class="rk-look" role="radiogroup" aria-label="Theme of the examples">
    <span class="rk-look-label" aria-hidden="true">Examples in</span>
    <div class="rk-look-segments">
      <label v-for="look in looks" :key="look.value" class="rk-look-segment">
        <input
          type="radio"
          :name="name"
          :value="look.value"
          :checked="siteTheme === look.value"
          @change="setSiteTheme(look.value)"
        />
        <span>{{ look.label }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.rk-look {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
}

.rk-look-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.rk-look-segments {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
}

.rk-look-segment {
  position: relative;
  cursor: pointer;
}

.rk-look-segment input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.rk-look-segment span {
  display: block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  color: var(--vp-c-text-2);
  transition:
    color 0.2s,
    background-color 0.2s;
}

.rk-look-segment:hover span {
  color: var(--vp-c-text-1);
}

.rk-look-segment input:checked + span {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-weight: 600;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
}

.rk-look-segment input:focus-visible + span {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

/*
 * Where it shows. Plain media queries rather than utilities: these scoped
 * rules are unlayered and would beat any utility class.
 *
 * In the nav bar from 1280px, without the label (the group keeps its name);
 * above a page's content between 768 and 1279px, where the nav bar is full;
 * in the menu on a phone.
 */
.rk-look.in-nav {
  display: none;
}

.rk-look.in-nav .rk-look-label {
  display: none;
}

.rk-look.in-doc {
  display: none;
  justify-content: flex-end;
  padding: 0 0 16px;
}

@media (min-width: 1280px) {
  .rk-look.in-nav {
    display: flex;
  }
}

@media (min-width: 768px) and (max-width: 1279px) {
  .rk-look.in-doc {
    display: flex;
  }
}

/* In the phone menu the switch takes the full width, label above. */
.rk-look.in-screen {
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 0 0;
}
</style>
