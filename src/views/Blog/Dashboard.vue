<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import StatusBadge from '@/components/cms/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/api/errors'
import { getDashboard } from '@/services/site'
import { useTheme } from '@/composables/useTheme'
import { formatDate } from '@/utils/format'
import type { DashboardPayload } from '@/types/cms'

const { isDarkMode } = useTheme()
const loading = ref(true)
const error = ref('')
const mounted = ref(false)
const data = ref<DashboardPayload | null>(null)

const enabled = (id: string) => data.value?.widgets.find((widget) => widget.id === id)?.enabled !== false

const labelColor = computed(() => (isDarkMode.value ? '#98A2B3' : '#667085'))
const gridColor = computed(() => (isDarkMode.value ? '#1D2939' : '#E4E7EC'))

const areaOptions = computed<ApexOptions>(() => ({
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
  colors: ['#465FFF'],
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  grid: { borderColor: gridColor.value },
  xaxis: { categories: data.value?.months ?? [], labels: { style: { colors: labelColor.value } } },
  yaxis: { labels: { style: { colors: labelColor.value } } },
  tooltip: { theme: isDarkMode.value ? 'dark' : 'light' },
}))

const barOptions = computed<ApexOptions>(() => ({
  ...areaOptions.value,
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '40%' } },
}))

const donutOptions = computed<ApexOptions>(() => ({
  chart: { type: 'donut', fontFamily: 'Outfit, sans-serif' },
  labels: data.value?.sources.map((item) => item.label) ?? [],
  colors: ['#465FFF', '#12B76A', '#F79009', '#F04438'],
  legend: { position: 'bottom', labels: { colors: labelColor.value } },
  dataLabels: { enabled: false },
}))

const stats = computed(() => {
  const stats = data.value?.stats
  if (!stats) return []
  return [
    ['Total posts', stats.totalPosts],
    ['Published', stats.published],
    ['Drafts', stats.drafts],
    ['Scheduled', stats.scheduled],
    ['Views', stats.views],
    ['Comments', stats.comments],
    ['Authors', stats.authors],
  ] as const
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = await getDashboard()
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  mounted.value = true
})

void load()
</script>

<template>
  <PageBreadcrumb page-title="Dashboard" />
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <div v-else-if="data" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="[label, value] in stats" :key="label" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
        <p class="mt-2 text-title-sm text-gray-800 dark:text-white/90">{{ value.toLocaleString() }}</p>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <div v-if="enabled('viewsChart') && mounted" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Page views</h3>
        <VueApexCharts type="area" height="260" :options="areaOptions" :series="[{ name: 'Views', data: data.pageViews }]" />
      </div>
      <div v-if="enabled('publishedChart') && mounted" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Posts published</h3>
        <VueApexCharts type="bar" height="260" :options="barOptions" :series="[{ name: 'Posts', data: data.publishedOverTime }]" />
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <div v-if="enabled('mostViewed')" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Most viewed</h3>
        <ul class="space-y-3">
          <li v-for="item in data.mostViewed" :key="item.title" class="flex items-center justify-between gap-3 text-sm">
            <span class="text-gray-800 dark:text-white/90">{{ item.title }}</span>
            <span class="text-gray-500">{{ item.views.toLocaleString() }}</span>
          </li>
        </ul>
      </div>
      <div v-if="enabled('sources') && mounted" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Traffic sources</h3>
        <VueApexCharts type="donut" height="260" :options="donutOptions" :series="data.sources.map((item) => item.value)" />
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <div v-if="enabled('recentPosts')" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Recent posts</h3>
        <ul class="space-y-3">
          <li v-for="post in data.recentPosts" :key="post.id" class="flex items-center justify-between gap-3">
            <RouterLink :to="{ name: 'PostEdit', params: { id: post.id } }" class="text-sm text-gray-800 hover:text-brand-500 dark:text-white/90">
              {{ post.title }}
            </RouterLink>
            <StatusBadge :status="post.status" />
          </li>
        </ul>
      </div>
      <div v-if="enabled('recentComments')" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Recent comments</h3>
        <ul class="space-y-3">
          <li v-for="comment in data.recentComments" :key="comment.id">
            <p class="text-sm text-gray-800 dark:text-white/90">{{ comment.authorName }}</p>
            <p class="text-sm text-gray-500">{{ comment.body }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(comment.createdAt) }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <div v-if="enabled('topArticles')" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Top performing articles</h3>
        <ul class="space-y-3">
          <li v-for="article in data.topArticles" :key="article.title" class="flex justify-between gap-3 text-sm">
            <span class="text-gray-800 dark:text-white/90">{{ article.title }}</span>
            <span class="text-gray-500">{{ article.views.toLocaleString() }} views · {{ article.comments }} comments</span>
          </li>
        </ul>
      </div>
      <div v-if="enabled('quickActions')" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">Quick actions</h3>
        <div class="flex flex-col gap-2">
          <RouterLink :to="{ name: 'PostCreate' }"><Button class="w-full">Create post</Button></RouterLink>
          <RouterLink :to="{ name: 'Media' }"><Button class="w-full" variant="outline">Upload media</Button></RouterLink>
          <RouterLink :to="{ name: 'Comments' }"><Button class="w-full" variant="outline">Review comments</Button></RouterLink>
          <RouterLink :to="{ name: 'Settings', params: { section: 'general' } }"><Button class="w-full" variant="outline">Open settings</Button></RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
