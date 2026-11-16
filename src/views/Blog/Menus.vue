<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { getMenus, saveMenus } from '@/services/site'
import { useToastStore } from '@/stores/feedback'
import type { MenuLink } from '@/types/cms'

const toast = useToastStore()
const loading = ref(true)
const error = ref('')
const links = ref<MenuLink[]>([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    links.value = await getMenus()
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function add() {
  links.value = [...links.value, { id: '', label: '', url: '/' }]
}

function remove(index: number) {
  links.value = links.value.filter((_, item) => item !== index)
}

async function save() {
  try {
    links.value = await saveMenus(links.value)
    toast.push('Navigation saved.')
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Navigation menus" />
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <form v-else class="max-w-3xl space-y-3" @submit.prevent="save">
    <div v-for="(link, index) in links" :key="`${link.id}-${index}`" class="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_1fr_auto] dark:border-gray-800 dark:bg-white/3">
      <Input v-model="link.label" placeholder="Label" />
      <Input v-model="link.url" placeholder="/path" />
      <Button type="button" variant="destructive" @click="remove(index)">Remove</Button>
    </div>
    <div class="flex gap-2">
      <Button type="button" variant="outline" @click="add">Add link</Button>
      <Button type="submit">Save menu</Button>
    </div>
  </form>
</template>
