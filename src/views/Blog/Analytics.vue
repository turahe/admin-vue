<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/api/errors'
import { useTheme } from '@/composables/useTheme'
import { getAnalytics } from '@/services/site'
import type { AnalyticsPayload } from '@/types/cms'

const { isDarkMode } = useTheme()
const loading = ref(true)
const error = ref('')
const mounted = ref(false)
const data = ref<AnalyticsPayload | null>(null)

const labelColor = computed(() => (isDarkMode.value ? '#98A2B3' : '#667085'))

const lineOptions = computed<ApexOptions>(() => ({
  chart: { type: 'line', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
  colors: ['#465FFF', '#12B76A'],
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  xaxis: { categories: data.value?.months ?? [], labels: { style: { colors: labelColor.value } } },
  yaxis: { labels: { style: { colors: labelColor.value } } },
  legend: { labels: { colors: labelColor.value } },
  tooltip: { theme: isDarkMode.value ? 'dark' : 'light' },
}))

const barOptions = computed<ApexOptions>(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
  colors: ['#465FFF'],
  plotOptions: { bar: { borderRadius: 6, horizontal: true } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: data.value?.regions.map((item) => item.label) ?? [],
    labels: { style: { colors: labelColor.value } },
  },
}))

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = await getAnalytics()
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
  <PageBreadcrumb page-title="Analytics" />
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <div v-else-if="data" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p class="text-sm text-gray-500">Page views</p>
        <p class="mt-2 text-title-sm text-gray-800 dark:text-white/90">{{ data.pageViews.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p class="text-sm text-gray-500">Unique visitors</p>
        <p class="mt-2 text-title-sm text-gray-800 dark:text-white/90">{{ data.uniqueVisitors.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p class="text-sm text-gray-500">Average reading time</p>
        <p class="mt-2 text-title-sm text-gray-800 dark:text-white/90">{{ data.averageReadingMinutes }} min</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p class="text-sm text-gray-500">Bounce rate</p>
        <p class="mt-2 text-title-sm text-gray-800 dark:text-white/90">{{ data.bounceRate }}%</p>
      </div>
    </div>
    <div v-if="mounted" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
      <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Views and visitors</h3>
      <VueApexCharts
        type="line"
        height="280"
        :options="lineOptions"
        :series="[
          { name: 'Views', data: data.views },
          { name: 'Visitors', data: data.visitors },
        ]"
      />
    </div>
    <div class="grid gap-4 xl:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Traffic sources</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="source in data.sources" :key="source.label" class="flex justify-between">
            <span>{{ source.label }}</span><span>{{ source.value }}%</span>
          </li>
        </ul>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Top articles</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="article in data.topArticles" :key="article.title" class="flex justify-between gap-3">
            <span>{{ article.title }}</span><span>{{ article.views.toLocaleString() }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Popular categories</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="category in data.categories" :key="category.label" class="flex justify-between">
            <span>{{ category.label }}</span><span>{{ category.value }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Devices</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="device in data.devices" :key="device.label" class="flex justify-between">
            <span>{{ device.label }}</span><span>{{ device.value }}%</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="mounted" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
      <h3 class="mb-4 font-medium text-gray-800 dark:text-white/90">Geographic distribution</h3>
      <VueApexCharts type="bar" height="280" :options="barOptions" :series="[{ name: 'Share', data: data.regions.map((item) => item.value) }]" />
    </div>
  </div>
</template>
