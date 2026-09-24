import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, type Component } from 'vue'
import Field from '../Field/Field.vue'
import Select from './Select.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'
import SelectTrigger from './SelectTrigger.vue'
import type { SelectOption } from './types'

const options: SelectOption<string>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended', disabled: true },
]

const SelectComponent = Select as unknown as Component
const SelectItemComponent = SelectItem as unknown as Component

const Harness = defineComponent({
  components: {
    Select: SelectComponent,
    SelectTrigger,
    SelectContent,
    SelectItem: SelectItemComponent,
  },
  props: {
    modelValue: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    searchable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: undefined },
    size: { type: String, default: undefined },
    surfaceClass: { type: String, default: undefined },
    options: { type: Array, default: () => options },
  },
  emits: ['update:modelValue', 'update:searchTerm'],
  template: `
    <Select
      :model-value="modelValue"
      :searchable="searchable"
      :disabled="disabled"
      @update:model-value="$emit('update:modelValue', $event)"
      @update:search-term="$emit('update:searchTerm', $event)"
    >
      <SelectTrigger :placeholder="placeholder" :size="size" :class="surfaceClass" />
      <SelectContent :loading="loading" :loading-text="loadingText">
        <SelectItem
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled"
        />
      </SelectContent>
    </Select>
  `,
})

/**
 * Attached to the document because Reka renders the panel through a portal —
 * it lands outside the wrapper's element, so it can only be found on the page.
 */
function mountSelect(props: Record<string, unknown> = {}) {
  return mount(Harness, { props, attachTo: document.body }) as VueWrapper
}

/** The combobox itself: the input, not the chevron button. */
function control(wrapper: VueWrapper) {
  return wrapper.find('input')
}

async function open(wrapper: VueWrapper) {
  await control(wrapper).trigger('click')
  await nextTick()
  await nextTick()
}

function optionElements(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="option"]')]
}

describe('Select', () => {
  it('shows the placeholder while nothing is selected', () => {
    const input = control(mountSelect({ placeholder: 'Pick a status' }))
    expect(input.attributes('placeholder')).toBe('Pick a status')
    expect(input.element.value).toBe('')
  })

  it('shows the label of the selected option', async () => {
    const wrapper = mountSelect({ modelValue: 'invited' })
    await nextTick()
    expect(control(wrapper).element.value).toBe('Invited')
  })

  describe('accessibility of the closed control', () => {
    it('exposes the input as the combobox', () => {
      const input = control(mountSelect())
      expect(input.attributes('role')).toBe('combobox')
      expect(input.attributes('aria-expanded')).toBe('false')
    })

    it('keeps the control in the tab order', () => {
      expect(control(mountSelect()).attributes('tabindex')).not.toBe('-1')
    })

    it('does not let the chevron steal the accessible name', () => {
      const wrapper = mountSelect()
      expect(control(wrapper).attributes('aria-label')).toBeUndefined()
      expect(wrapper.find('button').attributes('aria-label')).toBe('Show options')
    })

    it('makes a non-searchable select read-only rather than typable', () => {
      expect(control(mountSelect()).attributes('readonly')).toBeDefined()
      expect(control(mountSelect({ searchable: true })).attributes('readonly')).toBeUndefined()
    })
  })

  it('opens on click and lists every option', async () => {
    const wrapper = mountSelect()
    await open(wrapper)

    expect(control(wrapper).attributes('aria-expanded')).toBe('true')
    expect(optionElements().map((item) => item.textContent?.trim())).toEqual([
      'Active',
      'Invited',
      'Suspended',
    ])
  })

  it('marks a disabled option as disabled rather than hiding it', async () => {
    const wrapper = mountSelect()
    await open(wrapper)

    const suspended = optionElements().find((item) => item.textContent?.includes('Suspended'))
    expect(suspended?.getAttribute('data-disabled')).not.toBeNull()
  })

  it('emits the chosen value when an option is picked', async () => {
    const wrapper = mountSelect()
    await open(wrapper)

    optionElements()
      .find((item) => item.textContent?.includes('Invited'))
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['invited'])
  })

  it('marks the selected option as selected', async () => {
    const wrapper = mountSelect({ modelValue: 'active' })
    await open(wrapper)

    const active = optionElements().find((item) => item.textContent?.includes('Active'))
    expect(active?.getAttribute('aria-selected')).toBe('true')
  })

  it('opens on ArrowDown from the keyboard', async () => {
    const wrapper = mountSelect()
    await control(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    expect(control(wrapper).attributes('aria-expanded')).toBe('true')
  })

  it('publishes the search term so options can be fetched', async () => {
    const wrapper = mountSelect({ searchable: true })
    await open(wrapper)
    await control(wrapper).setValue('inv')

    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual(['inv'])
  })

  it('shows the loading text instead of the list', async () => {
    const wrapper = mountSelect({ loading: true, loadingText: 'Fetching…' })
    await open(wrapper)

    expect(document.body.textContent).toContain('Fetching…')
    expect(optionElements()).toHaveLength(0)
  })

  it('does not open while disabled', async () => {
    const wrapper = mountSelect({ disabled: true })
    await open(wrapper)
    expect(control(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('lets a consumer class beat the control class', () => {
    const wrapper = mountSelect({ size: 'sm', surfaceClass: 'h-12' })
    const anchor = wrapper.find('input').element.parentElement
    expect(anchor?.className).toContain('h-12')
    expect(anchor?.className).not.toContain('h-8')
  })

  describe('inside a Field', () => {
    function mountInField(fieldProps: Record<string, unknown>) {
      return mount(
        defineComponent({
          components: {
            Field,
            Select: SelectComponent,
            SelectTrigger,
            SelectContent,
            SelectItem: SelectItemComponent,
          },
          setup: () => ({ fieldProps, options }),
          template: `
            <Field v-bind="fieldProps">
              <Select>
                <SelectTrigger />
                <SelectContent>
                  <SelectItem
                    v-for="option in options"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :disabled="option.disabled"
                  />
                </SelectContent>
              </Select>
            </Field>
          `,
        }),
        { attachTo: document.body }
      )
    }

    it('takes the generated id so the label points at the control', () => {
      const wrapper = mountInField({ label: 'Status' })
      const forAttr = wrapper.find('label').attributes('for')
      expect(forAttr).toBeTruthy()
      expect(wrapper.find('input').attributes('id')).toBe(forAttr)
    })

    it('is described by the field error and marked invalid', () => {
      const wrapper = mountInField({ label: 'Status', error: 'Pick one' })
      const input = wrapper.find('input')
      expect(input.attributes('aria-invalid')).toBe('true')
      const describedBy = input.attributes('aria-describedby')
      expect(describedBy).toBeTruthy()
      expect(wrapper.find(`#${describedBy}`).text()).toBe('Pick one')
    })

    it('inherits disabled', () => {
      const wrapper = mountInField({ label: 'Status', disabled: true })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })
  })
})

describe('stale ARIA references', () => {
  it('drops aria-activedescendant when the panel closes', async () => {
    const wrapper = mountSelect()
    await open(wrapper)
    expect(control(wrapper).attributes('aria-activedescendant')).toBeDefined()

    await control(wrapper).trigger('keydown', { key: 'Escape' })
    await nextTick()
    await nextTick()

    expect(control(wrapper).attributes('aria-expanded')).toBe('false')
    expect(control(wrapper).attributes('aria-activedescendant')).toBeUndefined()
  })
})
