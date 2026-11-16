<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/api/errors'
import { getWidgets, saveWidgets } from '@/services/site'
import { useToastStore } from '@/stores/feedback'
import type { WidgetToggle } from '@/types/cms'

const labels: Record<string, string> = {
  viewsChart: 'Page views chart',
  publishedChart: 'Posts published chart',
  mostViewed: 'Most viewed articles',
  sources: 'Traffic sources',
  recentPosts: 'Recent posts',
  recentComments: 'Recent comments',
  topArticles: 'Top performing articles',
  quickActions: 'Quick actions',
}

const toast = useToastStore()
const loading = ref(true)
const error = ref('')
const widgets = ref<WidgetToggle[]>([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    widgets.value = await getWidgets()
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

async function save() {
  try {
    widgets.value = await saveWidgets(widgets.value)
    toast.push('Widgets saved.')
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Widgets" />
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <form v-else class="max-w-xl space-y-3" @submit.prevent="save">
    <label
      v-for="widget in widgets"
      :key="widget.id"
      class="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-white/3"
    >
      <span class="text-gray-800 dark:text-white/90">{{ labels[widget.id] ?? widget.id }}</span>
      <input v-model="widget.enabled" type="checkbox" />
    </label>
    <Button type="submit">Save widgets</Button>
  </form>
</template>
