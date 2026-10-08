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
 * Attached to the document because the panel renders through a portal — it
 * lands outside the wrapper's element, so it can only be found on the page.
 */
function mountSelect(props: Record<string, unknown> = {}) {
  return mount(Harness, { props, attachTo: document.body }) as VueWrapper
}

/** The combobox itself: the input, not the drop button. */
function control(wrapper: VueWrapper) {
  return wrapper.find('input')
}

async function open(wrapper: VueWrapper) {
  await control(wrapper).trigger('click')
  await nextTick()
  await nextTick()
}

/** The search box at the top of an open searchable list. */
function searchBox(): HTMLInputElement {
  const input = document.querySelector<HTMLInputElement>('[data-slot="select-search"] input')
  if (!input) throw new Error('no search box rendered')
  return input
}

async function search(term: string) {
  const input = searchBox()
  input.value = term
  input.dispatchEvent(new Event('input'))
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

  it('keeps the closed panel out of the page', () => {
    mountSelect()
    expect(document.querySelector('[role="listbox"]')).toBeNull()
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

    it('does not let the drop button steal the accessible name', () => {
      const wrapper = mountSelect()
      expect(control(wrapper).attributes('aria-label')).toBeUndefined()
      expect(wrapper.find('button').attributes('aria-label')).toBe('Show options')
    })

    it('keeps the control read-only, searchable or not: the search box is in the list', () => {
      expect(control(mountSelect()).attributes('readonly')).toBeDefined()
      expect(control(mountSelect({ searchable: true })).attributes('readonly')).toBeDefined()
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
    await search('inv')

    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual(['inv'])
    wrapper.unmount()
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

describe('keyboard', () => {
  const key = async (wrapper: VueWrapper, name: string) => {
    await control(wrapper).trigger('keydown', { key: name })
    await nextTick()
    await nextTick()
  }
  const highlighted = () =>
    document.querySelector('[role="option"][data-highlighted]')?.textContent?.trim()

  it('highlights the selected option on open, else the first', async () => {
    const withValue = mountSelect({ modelValue: 'invited' })
    await key(withValue, 'ArrowDown')
    expect(highlighted()).toBe('Invited')
    withValue.unmount()

    const empty = mountSelect()
    await key(empty, 'ArrowDown')
    expect(highlighted()).toBe('Active')
  })

  it('skips disabled options and stops at the ends', async () => {
    const wrapper = mountSelect()
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'ArrowDown')
    // Suspended is disabled, so Invited is the last reachable option.
    expect(highlighted()).toBe('Invited')
    await key(wrapper, 'Home')
    expect(highlighted()).toBe('Active')
    await key(wrapper, 'End')
    expect(highlighted()).toBe('Invited')
  })

  it('chooses the highlighted option on Enter and closes', async () => {
    const wrapper = mountSelect()
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['invited'])
    expect(control(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('closes on Escape without changing the value', async () => {
    const wrapper = mountSelect({ modelValue: 'active' })
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'ArrowDown')
    await key(wrapper, 'Escape')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(control(wrapper).element.value).toBe('Active')
  })

  it('jumps to an option by its first letters when not searchable', async () => {
    const wrapper = mountSelect()
    await key(wrapper, 'i')
    expect(control(wrapper).attributes('aria-expanded')).toBe('true')
    expect(highlighted()).toBe('Invited')
  })
})

describe('searching', () => {
  it('filters ignoring case and accents', async () => {
    const wrapper = mountSelect({
      searchable: true,
      options: [
        { label: 'Émile', value: 'emile' },
        { label: 'Zoë', value: 'zoe' },
      ],
    })
    await open(wrapper)
    await search('EMI')
    const shown = optionElements().filter((el) => el.style.display !== 'none')
    expect(shown.map((el) => el.textContent?.trim())).toEqual(['Émile'])
  })

  it('shows the empty text when nothing matches', async () => {
    const wrapper = mountSelect({ searchable: true })
    await open(wrapper)
    await search('zzz')
    expect(document.body.textContent).toContain('No results found')
    wrapper.unmount()
  })

  it('moves focus into the search box as the list opens', async () => {
    const wrapper = mountSelect({ searchable: true })
    await open(wrapper)
    await nextTick()
    expect(document.activeElement).toBe(searchBox())
    wrapper.unmount()
  })

  it('makes the search box the combobox that owns the list', async () => {
    const wrapper = mountSelect({ searchable: true, modelValue: 'invited' })
    await open(wrapper)
    const box = searchBox()
    expect(box.getAttribute('role')).toBe('combobox')
    expect(box.getAttribute('aria-label')).toBe('Search')
    expect(box.getAttribute('aria-controls')).toBe(document.querySelector('[role="listbox"]')?.id)
    const invited = optionElements().find((item) => item.textContent?.includes('Invited'))
    expect(box.getAttribute('aria-activedescendant')).toBe(invited?.id)
    // The control no longer points at the highlight: focus is not there.
    expect(control(wrapper).attributes('aria-activedescendant')).toBeUndefined()
    wrapper.unmount()
  })

  it('chooses with the arrows and Enter from the search box, then returns focus', async () => {
    const wrapper = mountSelect({ searchable: true })
    await open(wrapper)
    await nextTick()
    const box = searchBox()
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['invited'])
    expect(document.activeElement).toBe(control(wrapper).element)
    wrapper.unmount()
  })

  it('closes on Escape from the search box, keeping the value and the focus', async () => {
    const wrapper = mountSelect({ searchable: true, modelValue: 'active' })
    await open(wrapper)
    await nextTick()
    await search('inv')
    searchBox().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(control(wrapper).attributes('aria-expanded')).toBe('false')
    expect(control(wrapper).element.value).toBe('Active')
    expect(document.activeElement).toBe(control(wrapper).element)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('opens and starts the search with a letter typed on the control', async () => {
    const wrapper = mountSelect({ searchable: true })
    await control(wrapper).trigger('keydown', { key: 'i' })
    await nextTick()
    await nextTick()
    expect(searchBox().value).toBe('i')
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual(['i'])
    wrapper.unmount()
  })

  it('keeps the Field label, error and description on the control, not the search box', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Field, Select: SelectComponent, SelectTrigger, SelectContent },
        template: `
          <Field label="Country" error="Pick one">
            <Select searchable><SelectTrigger /><SelectContent /></Select>
          </Field>
        `,
      }),
      { attachTo: document.body }
    )
    const input = wrapper.find('input')
    await input.trigger('click')
    await nextTick()
    await nextTick()
    const box = searchBox()
    expect(box.id).not.toBe(input.attributes('id'))
    expect(box.getAttribute('aria-describedby')).toBeNull()
    expect(box.getAttribute('aria-invalid')).toBeNull()
    expect(input.attributes('aria-describedby')).toBeDefined()
    wrapper.unmount()
  })
})

describe('forms', () => {
  it('submits the value under its name', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          Select: SelectComponent,
          SelectTrigger,
          SelectContent,
          SelectItem: SelectItemComponent,
        },
        template: `
          <Select name="status" model-value="invited">
            <SelectTrigger />
            <SelectContent><SelectItem value="invited" label="Invited" /></SelectContent>
          </Select>
        `,
      }),
      { attachTo: document.body }
    )
    await nextTick()
    const hidden = wrapper.find('input[type="hidden"]')
    expect(hidden.attributes('name')).toBe('status')
    expect((hidden.element as HTMLInputElement).value).toBe('invited')
  })
})

describe('pointer', () => {
  const press = (target: Element, pointerType = 'mouse') =>
    target.dispatchEvent(
      Object.assign(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }), {
        pointerType,
      })
    )
  const release = (target: Element) =>
    target.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, button: 0 }))

  it('opens on a mouse press, before the button comes up', async () => {
    const wrapper = mountSelect()
    press(control(wrapper).element)
    await nextTick()
    await nextTick()
    expect(optionElements()).toHaveLength(3)
    wrapper.unmount()
  })

  it('chooses the option a press on the field is dragged to and released over', async () => {
    const wrapper = mountSelect()
    press(control(wrapper).element)
    await nextTick()
    await nextTick()
    const invited = optionElements()[1]
    if (!invited) throw new Error('no option rendered')
    release(invited)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['invited'])
    wrapper.unmount()
  })

  it('does not choose on a release that did not start on the field', async () => {
    const wrapper = mountSelect()
    await open(wrapper)
    const invited = optionElements()[1]
    if (!invited) throw new Error('no option rendered')
    release(invited)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('opens from the drop button and keeps focus on the combobox', async () => {
    const wrapper = mountSelect()
    const button = wrapper.find('[data-slot="select-button"]')
    press(button.element)
    await nextTick()
    await nextTick()
    expect(optionElements()).toHaveLength(3)
    expect(document.activeElement).toBe(control(wrapper).element)
    wrapper.unmount()
  })
})

describe('invalid', () => {
  it('shows the quiet error mark and nothing red', () => {
    const wrapper = mount(
      defineComponent({
        components: { Select: SelectComponent, SelectTrigger, SelectContent },
        template: `<Select invalid><SelectTrigger /><SelectContent /></Select>`,
      }),
      { attachTo: document.body }
    )
    expect(wrapper.find('[data-slot="select-error-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="select-trigger"]').classes().join(' ')).not.toMatch(/danger/)
    wrapper.unmount()
  })
})
