<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { listMedia } from '@/services/media'
import type { MediaAsset } from '@/types/cms'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [asset: MediaAsset] }>()

const items = ref<MediaAsset[]>([])
const search = ref('')
const error = ref('')

async function load() {
  error.value = ''
  try {
    items.value = await listMedia(search.value, 'image')
  } catch (caught) {
    error.value = errorMessage(caught)
  }
}

watch(open, (value) => {
  if (value) void load()
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-3xl p-6">
      <DialogHeader>
        <DialogTitle>Choose an image</DialogTitle>
      </DialogHeader>
      <form class="mt-4 flex gap-2" @submit.prevent="load">
        <Input v-model="search" placeholder="Search files" />
        <Button type="submit" variant="outline">Search</Button>
      </form>
      <p v-if="error" class="mt-3 text-sm text-error-600">{{ error }}</p>
      <div class="mt-4 grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
        <button
          v-for="asset in items"
          :key="asset.id"
          type="button"
          class="rounded-xl border border-gray-200 p-2 text-start hover:border-brand-400 dark:border-gray-800"
          @click="emit('select', asset); open = false"
        >
          <img :src="asset.url" :alt="asset.name" class="h-24 w-full rounded-lg object-contain" />
          <span class="mt-2 block truncate text-xs text-gray-600 dark:text-gray-300">{{ asset.name }}</span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
