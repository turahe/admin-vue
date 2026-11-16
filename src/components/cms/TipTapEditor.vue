<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  stats: [value: { words: number; characters: number }]
}>()

const lowlight = createLowlight(common)
const linkUrl = ref('')
const videoUrl = ref('')
const showLink = ref(false)
const showVideo = ref(false)

function publish(html: string, text: string) {
  emit('update:modelValue', html)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  emit('stats', { words, characters: text.length })
}

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false, autolink: true }),
    Image,
    Youtube.configure({ width: 640, height: 360 }),
    Placeholder.configure({ placeholder: 'Write the story…' }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlockLowlight.configure({ lowlight }),
  ],
  editorProps: { attributes: { class: 'tiptap-editor' } },
  onUpdate: ({ editor: instance }) => publish(instance.getHTML(), instance.getText()),
})

watch(
  () => props.modelValue,
  (value) => {
    const instance = editor.value
    if (!instance || value === instance.getHTML()) return
    instance.commands.setContent(value, { emitUpdate: false })
    publish(instance.getHTML(), instance.getText())
  },
)

const words = computed(() => {
  const text = editor.value?.getText() ?? ''
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
  }
})

function chain() {
  return editor.value?.chain().focus()
}

function applyLink() {
  if (!linkUrl.value) chain()?.unsetLink().run()
  else chain()?.extendMarkRange('link').setLink({ href: linkUrl.value }).run()
  showLink.value = false
}

function applyVideo() {
  if (videoUrl.value) chain()?.setYoutubeVideo({ src: videoUrl.value }).run()
  showVideo.value = false
  videoUrl.value = ''
}

function setImage(url: string) {
  chain()?.setImage({ src: url }).run()
}

defineExpose({ setImage, words })
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap gap-1 border-b border-gray-200 p-2 dark:border-gray-800">
      <Button size="xs" variant="outline" @click="chain()?.toggleBold().run()">B</Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleItalic().run()"><span class="italic">I</span></Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleUnderline().run()"><span class="underline">U</span></Button>
      <Button v-for="level in [1, 2, 3, 4, 5, 6]" :key="level" size="xs" variant="outline" @click="chain()?.toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()">
        H{{ level }}
      </Button>
      <Button size="xs" variant="outline" @click="chain()?.setTextAlign('left').run()">Left</Button>
      <Button size="xs" variant="outline" @click="chain()?.setTextAlign('center').run()">Center</Button>
      <Button size="xs" variant="outline" @click="chain()?.setTextAlign('right').run()">Right</Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleBulletList().run()">List</Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleOrderedList().run()">1.</Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleBlockquote().run()">Quote</Button>
      <Button size="xs" variant="outline" @click="chain()?.toggleCodeBlock().run()">Code</Button>
      <Button size="xs" variant="outline" @click="chain()?.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">Table</Button>
      <Button size="xs" variant="outline" @click="chain()?.setHorizontalRule().run()">Rule</Button>
      <Button size="xs" variant="outline" @click="showLink = !showLink">Link</Button>
      <Button size="xs" variant="outline" @click="showVideo = !showVideo">Video</Button>
      <Button size="xs" variant="outline" @click="chain()?.undo().run()">Undo</Button>
      <Button size="xs" variant="outline" @click="chain()?.redo().run()">Redo</Button>
    </div>
    <form v-if="showLink" class="flex gap-2 border-b border-gray-200 p-2 dark:border-gray-800" @submit.prevent="applyLink">
      <Input v-model="linkUrl" type="url" placeholder="https://" />
      <Button type="submit" size="sm">Apply</Button>
    </form>
    <form v-if="showVideo" class="flex gap-2 border-b border-gray-200 p-2 dark:border-gray-800" @submit.prevent="applyVideo">
      <Input v-model="videoUrl" type="url" placeholder="YouTube URL" />
      <Button type="submit" size="sm">Embed</Button>
    </form>
    <EditorContent :editor="editor" class="px-4 py-3" />
    <div class="flex justify-end gap-4 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <span>{{ words.words }} words</span>
      <span>{{ words.characters }} characters</span>
    </div>
  </div>
</template>

<style>
.tiptap-editor {
  min-height: 320px;
  outline: none;
  color: var(--color-gray-800);
}
.dark .tiptap-editor {
  color: var(--color-gray-100);
}
.tiptap-editor > * + * {
  margin-top: 0.75rem;
}
.tiptap-editor h1 { font-size: 1.875rem; font-weight: 600; }
.tiptap-editor h2 { font-size: 1.5rem; font-weight: 600; }
.tiptap-editor h3 { font-size: 1.25rem; font-weight: 600; }
.tiptap-editor ul { list-style: disc; padding-inline-start: 1.25rem; }
.tiptap-editor ol { list-style: decimal; padding-inline-start: 1.25rem; }
.tiptap-editor blockquote {
  border-inline-start: 3px solid var(--color-brand-500);
  padding-inline-start: 0.75rem;
  color: var(--color-gray-500);
}
.tiptap-editor pre {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: var(--color-gray-900);
  color: var(--color-gray-100);
  padding: 0.75rem 1rem;
}
.tiptap-editor a { color: var(--color-brand-500); text-decoration: underline; }
.tiptap-editor img { max-width: 100%; border-radius: 0.75rem; }
.tiptap-editor table { width: 100%; border-collapse: collapse; }
.tiptap-editor td,
.tiptap-editor th { border: 1px solid var(--color-gray-200); padding: 0.4rem 0.6rem; }
.dark .tiptap-editor td,
.dark .tiptap-editor th { border-color: var(--color-gray-700); }
.tiptap-editor p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: inline-start;
  height: 0;
  pointer-events: none;
  color: var(--color-gray-400);
}
</style>
