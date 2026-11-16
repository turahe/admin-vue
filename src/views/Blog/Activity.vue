<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import PaginationBar from '@/components/cms/PaginationBar.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { listActivity } from '@/services/site'
import { formatDate } from '@/utils/format'
import type { ActivityEntry } from '@/types/cms'

const loading = ref(true)
const error = ref('')
const rows = ref<ActivityEntry[]>([])
const total = ref(0)
const page = ref(1)
const search = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const result = await listActivity(page.value, search.value)
    rows.value = result.items
    total.value = result.total
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()
</script>

<template>
  <PageBreadcrumb page-title="Activity logs" />
  <form class="mb-4 flex gap-2" @submit.prevent="page = 1; load()">
    <Input v-model="search" placeholder="Search actor, action, or target" class="max-w-sm" />
    <Button type="submit" variant="outline">Search</Button>
  </form>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!rows.length" title="No activity" description="Publishing, edits, and sign-ins are recorded here." />
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start">When</th>
          <th class="p-3 text-start">Who</th>
          <th class="p-3 text-start">Action</th>
          <th class="p-3 text-start">Target</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in rows" :key="entry.id" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3 whitespace-nowrap">{{ formatDate(entry.createdAt) }}</td>
          <td class="p-3">{{ entry.actor }}</td>
          <td class="p-3">{{ entry.action }}</td>
          <td class="p-3">{{ entry.target }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="!loading && !error" class="mt-4">
    <PaginationBar :page="page" :page-size="8" :total="total" @update:page="page = $event; load()" />
  </div>
</template>
