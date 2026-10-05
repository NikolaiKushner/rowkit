import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ArrowLeft32Icon from '../icons/ArrowLeft32Icon.vue'
import ArrowRight32Icon from '../icons/ArrowRight32Icon.vue'
import ArrowUp32Icon from '../icons/ArrowUp32Icon.vue'
import Book32Icon from '../icons/Book32Icon.vue'
import CalendarIcon from '../icons/CalendarIcon.vue'
import CheckGlyphIcon from '../icons/CheckGlyphIcon.vue'
import CloseGlyphIcon from '../icons/CloseGlyphIcon.vue'
import Code32Icon from '../icons/Code32Icon.vue'
import CodeIcon from '../icons/CodeIcon.vue'
import Computer32Icon from '../icons/Computer32Icon.vue'
import ComputerIcon from '../icons/ComputerIcon.vue'
import CopyIcon from '../icons/CopyIcon.vue'
import Document32Icon from '../icons/Document32Icon.vue'
import DocumentIcon from '../icons/DocumentIcon.vue'
import EditIcon from '../icons/EditIcon.vue'
import Error32Icon from '../icons/Error32Icon.vue'
import ErrorIcon from '../icons/ErrorIcon.vue'
import FilterIcon from '../icons/FilterIcon.vue'
import Folder32Icon from '../icons/Folder32Icon.vue'
import FolderEmpty32Icon from '../icons/FolderEmpty32Icon.vue'
import FolderIcon from '../icons/FolderIcon.vue'
import FolderOpenIcon from '../icons/FolderOpenIcon.vue'
import HourglassIcon from '../icons/HourglassIcon.vue'
import Info32Icon from '../icons/Info32Icon.vue'
import InfoIcon from '../icons/InfoIcon.vue'
import MaximizeGlyphIcon from '../icons/MaximizeGlyphIcon.vue'
import MinimizeGlyphIcon from '../icons/MinimizeGlyphIcon.vue'
import PlusIcon from '../icons/PlusIcon.vue'
import QuestionIcon from '../icons/QuestionIcon.vue'
import RestoreGlyphIcon from '../icons/RestoreGlyphIcon.vue'
import Search32Icon from '../icons/Search32Icon.vue'
import SearchIcon from '../icons/SearchIcon.vue'
import SuccessIcon from '../icons/SuccessIcon.vue'
import Trash32Icon from '../icons/Trash32Icon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import TriangleDownIcon from '../icons/TriangleDownIcon.vue'
import TriangleLeftIcon from '../icons/TriangleLeftIcon.vue'
import TriangleRightIcon from '../icons/TriangleRightIcon.vue'
import TriangleUpIcon from '../icons/TriangleUpIcon.vue'
import UserIcon from '../icons/UserIcon.vue'
import Warning32Icon from '../icons/Warning32Icon.vue'
import WarningIcon from '../icons/WarningIcon.vue'

/**
 * Every icon in the Windows 98 pixel set, at its own size, on the silver face
 * and on white. Pixel art: a blurred edge here means something scaled it.
 */
const meta: Meta = {
  title: 'Foundations/Icons',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const all = {
  ArrowLeft32Icon,
  ArrowRight32Icon,
  ArrowUp32Icon,
  Book32Icon,
  CalendarIcon,
  CheckGlyphIcon,
  CloseGlyphIcon,
  Code32Icon,
  CodeIcon,
  Computer32Icon,
  ComputerIcon,
  CopyIcon,
  Document32Icon,
  DocumentIcon,
  EditIcon,
  Error32Icon,
  ErrorIcon,
  FilterIcon,
  Folder32Icon,
  FolderEmpty32Icon,
  FolderIcon,
  FolderOpenIcon,
  HourglassIcon,
  Info32Icon,
  InfoIcon,
  MaximizeGlyphIcon,
  MinimizeGlyphIcon,
  PlusIcon,
  QuestionIcon,
  RestoreGlyphIcon,
  Search32Icon,
  SearchIcon,
  SuccessIcon,
  Trash32Icon,
  TrashIcon,
  TriangleDownIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
  TriangleUpIcon,
  UserIcon,
  Warning32Icon,
  WarningIcon,
}

export const AllIcons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ names: Object.keys(all) }),
    template: `
      <div class="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3 text-ui">
        <figure v-for="name in names" :key="name" class="m-0 flex flex-col items-center gap-1">
          <span class="flex size-10 items-center justify-center bg-input shadow-sunken">
            <component :is="name" />
          </span>
          <figcaption>{{ name }}</figcaption>
        </figure>
      </div>
    `,
  }),
}
