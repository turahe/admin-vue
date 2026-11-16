<script setup lang="ts">
import { computed, ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { errorMessage } from '@/api/errors'
import { deleteMedia, listMedia, uploadMedia } from '@/services/media'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { formatBytes, formatDate } from '@/utils/format'
import type { MediaAsset } from '@/types/cms'

const toast = useToastStore()
const confirm = useConfirmStore()
const loading = ref(true)
const error = ref('')
const items = ref<MediaAsset[]>([])
const search = ref('')
const type = ref('')
const view = ref<'grid' | 'list'>('grid')
const dragging = ref(false)
const active = ref<MediaAsset | null>(null)

const filteredLabel = computed(() => `${items.value.length} files`)

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await listMedia(search.value, type.value)
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

async function take(files: FileList | File[]) {
  const list = [...files]
  try {
    for (const file of list) await uploadMedia(file)
    toast.push(list.length === 1 ? 'File uploaded.' : `${list.length} files uploaded.`)
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

function onDrop(event: DragEvent) {
  dragging.value = false
  if (event.dataTransfer?.files.length) void take(event.dataTransfer.files)
}

async function copy(asset: MediaAsset) {
  await navigator.clipboard.writeText(asset.url)
  toast.push('URL copied.')
}

async function remove(asset: MediaAsset) {
  const ok = await confirm.ask('Delete file', `Delete “${asset.name}”?`)
  if (!ok) return
  try {
    await deleteMedia(asset.id)
    active.value = null
    toast.push('File deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Media library" />
  <form class="mb-4 flex flex-wrap gap-2" @submit.prevent="load">
    <Input v-model="search" placeholder="Search files" class="max-w-sm" />
    <select v-model="type" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
      <option value="">All types</option>
      <option value="image">Images</option>
      <option value="video">Video</option>
    </select>
    <Button type="submit" variant="outline">Search</Button>
    <Button type="button" variant="outline" @click="view = view === 'grid' ? 'list' : 'grid'">
      {{ view === 'grid' ? 'List view' : 'Grid view' }}
    </Button>
    <label class="ms-auto">
      <input class="sr-only" type="file" multiple @change="take(($event.target as HTMLInputElement).files ?? [])" />
      <span class="inline-flex h-11 cursor-pointer items-center rounded-[10px] bg-brand-500 px-4 text-sm text-white">Upload</span>
    </label>
  </form>

  <div
    class="mb-4 rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-gray-500"
    :class="dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-300 dark:border-gray-700'"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    Drop files here. Uploads stay in this session until an S3-compatible store is connected.
  </div>

  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!items.length" title="No files" description="Upload an image to use it as a featured image." />
  <div v-else-if="view === 'grid'" class="grid grid-cols-2 gap-3 md:grid-cols-4">
    <button
      v-for="asset in items"
      :key="asset.id"
      type="button"
      class="rounded-2xl border border-gray-200 bg-white p-3 text-start dark:border-gray-800 dark:bg-white/3"
      @click="active = asset"
    >
      <img :src="asset.url" :alt="asset.name" class="h-28 w-full object-contain" />
      <p class="mt-2 truncate text-sm text-gray-800 dark:text-white/90">{{ asset.name }}</p>
      <p class="text-xs text-gray-500">{{ formatBytes(asset.size) }}</p>
    </button>
  </div>
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start">Name</th>
          <th class="p-3 text-start">Type</th>
          <th class="p-3 text-start">Size</th>
          <th class="p-3 text-start">Dimensions</th>
          <th class="p-3 text-start">Added</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in items" :key="asset.id" class="cursor-pointer border-b border-gray-100 dark:border-gray-800" @click="active = asset">
          <td class="p-3">{{ asset.name }}</td>
          <td class="p-3">{{ asset.mime }}</td>
          <td class="p-3">{{ formatBytes(asset.size) }}</td>
          <td class="p-3">{{ asset.width }}×{{ asset.height }}</td>
          <td class="p-3">{{ formatDate(asset.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-if="!loading" class="mt-3 text-xs text-gray-500">{{ filteredLabel }}</p>

  <Dialog :open="active !== null" @update:open="active = null">
    <DialogContent v-if="active" class="max-w-lg p-6">
      <DialogHeader><DialogTitle>{{ active.name }}</DialogTitle></DialogHeader>
      <img :src="active.url" :alt="active.name" class="mt-4 max-h-64 w-full object-contain" />
      <dl class="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex justify-between gap-3"><dt>Type</dt><dd>{{ active.mime }}</dd></div>
        <div class="flex justify-between gap-3"><dt>Size</dt><dd>{{ formatBytes(active.size) }}</dd></div>
        <div class="flex justify-between gap-3"><dt>Dimensions</dt><dd>{{ active.width }}×{{ active.height }}</dd></div>
        <div class="flex justify-between gap-3"><dt>Added</dt><dd>{{ formatDate(active.createdAt) }}</dd></div>
      </dl>
      <div class="mt-4 flex gap-2">
        <Button variant="outline" @click="copy(active)">Copy URL</Button>
        <Button variant="destructive" @click="remove(active)">Delete</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
