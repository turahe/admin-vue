<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { boolean, number, object, string } from 'yup'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SearchPreview from '@/components/cms/SearchPreview.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { getSettings, saveSettings } from '@/services/site'
import { useToastStore } from '@/stores/feedback'
import type { SiteSettings } from '@/types/cms'

const route = useRoute()
const toast = useToastStore()
const loading = ref(true)
const error = ref('')
const section = computed(() => (typeof route.params.section === 'string' ? route.params.section : 'general'))

const schema = toTypedSchema(
  object({
    general: object({
      name: string().required('Website name is required'),
      description: string().required('Description is required'),
      url: string().url('Enter a valid URL').required(),
      logoUrl: string().default(''),
      faviconUrl: string().default(''),
      language: string().oneOf(['en', 'id']).required(),
      timezone: string().required(),
    }),
    reading: object({
      postsPerPage: number().min(1).max(50).required(),
      homepageDisplay: string().oneOf(['latest', 'static']).required(),
      defaultVisibility: string().oneOf(['public', 'private']).required(),
    }),
    seo: object({
      title: string().max(70).required(),
      description: string().max(160).required(),
      focusKeyword: string().default(''),
      canonicalUrl: string().default(''),
      ogTitle: string().default(''),
      ogDescription: string().default(''),
      ogImage: string().default(''),
      robotsIndex: boolean().required(),
      robotsFollow: boolean().required(),
      sitemapEnabled: boolean().required(),
    }),
    social: object({
      facebook: string().default(''),
      instagram: string().default(''),
      x: string().default(''),
      linkedin: string().default(''),
      youtube: string().default(''),
    }),
  }),
)

const { handleSubmit, errors, defineField, resetForm, values } = useForm({ validationSchema: schema })
const [name] = defineField('general.name')
const [description] = defineField('general.description')
const [url] = defineField('general.url')
const [logoUrl] = defineField('general.logoUrl')
const [faviconUrl] = defineField('general.faviconUrl')
const [language] = defineField('general.language')
const [timezone] = defineField('general.timezone')
const [postsPerPage] = defineField('reading.postsPerPage')
const [homepageDisplay] = defineField('reading.homepageDisplay')
const [defaultVisibility] = defineField('reading.defaultVisibility')
const [seoTitle] = defineField('seo.title')
const [seoDescription] = defineField('seo.description')
const [focusKeyword] = defineField('seo.focusKeyword')
const [canonicalUrl] = defineField('seo.canonicalUrl')
const [ogTitle] = defineField('seo.ogTitle')
const [ogDescription] = defineField('seo.ogDescription')
const [ogImage] = defineField('seo.ogImage')
const [robotsIndex] = defineField('seo.robotsIndex')
const [robotsFollow] = defineField('seo.robotsFollow')
const [sitemapEnabled] = defineField('seo.sitemapEnabled')
const [facebook] = defineField('social.facebook')
const [instagram] = defineField('social.instagram')
const [x] = defineField('social.x')
const [linkedin] = defineField('social.linkedin')
const [youtube] = defineField('social.youtube')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const settings = await getSettings()
    resetForm({ values: settings })
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.section, () => void load())
void load()

const save = handleSubmit(async (input) => {
  try {
    const saved = await saveSettings(input as SiteSettings)
    resetForm({ values: saved })
    toast.push('Settings saved.')
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
})

const titles: Record<string, string> = {
  general: 'General settings',
  reading: 'Reading settings',
  seo: 'SEO settings',
  social: 'Social media',
}
</script>

<template>
  <PageBreadcrumb :page-title="titles[section] ?? 'Settings'" />
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <form v-else class="max-w-2xl space-y-4" @submit.prevent="save">
    <template v-if="section === 'general'">
      <Input v-model="name" placeholder="Website name" />
      <p v-if="errors['general.name']" class="text-sm text-error-600">{{ errors['general.name'] }}</p>
      <textarea v-model="description" rows="3" class="w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <Input v-model="url" placeholder="Website URL" />
      <Input v-model="logoUrl" placeholder="Logo URL" />
      <Input v-model="faviconUrl" placeholder="Favicon URL" />
      <select v-model="language" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
        <option value="en">English</option>
        <option value="id">Indonesian</option>
      </select>
      <Input v-model="timezone" placeholder="Timezone" />
    </template>
    <template v-else-if="section === 'reading'">
      <label class="block text-sm text-gray-500">Posts per page
        <Input v-model="postsPerPage" type="number" class="mt-1" />
      </label>
      <select v-model="homepageDisplay" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
        <option value="latest">Latest posts</option>
        <option value="static">A static page</option>
      </select>
      <select v-model="defaultVisibility" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </template>
    <template v-else-if="section === 'seo'">
      <Input v-model="seoTitle" placeholder="Default meta title" />
      <textarea v-model="seoDescription" rows="3" placeholder="Default meta description" class="w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <Input v-model="focusKeyword" placeholder="Focus keyword" />
      <Input v-model="canonicalUrl" placeholder="Canonical URL" />
      <Input v-model="ogTitle" placeholder="Open Graph title" />
      <textarea v-model="ogDescription" rows="2" placeholder="Open Graph description" class="w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <Input v-model="ogImage" placeholder="Open Graph image URL" />
      <label class="flex items-center gap-2 text-sm"><input v-model="robotsIndex" type="checkbox" /> Allow indexing</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="robotsFollow" type="checkbox" /> Allow following links</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="sitemapEnabled" type="checkbox" /> Publish a sitemap</label>
      <SearchPreview :title="String(seoTitle ?? '')" :url="String(canonicalUrl || url || '')" :description="String(seoDescription ?? '')" />
    </template>
    <template v-else>
      <Input v-model="facebook" placeholder="Facebook URL" />
      <Input v-model="instagram" placeholder="Instagram URL" />
      <Input v-model="x" placeholder="X URL" />
      <Input v-model="linkedin" placeholder="LinkedIn URL" />
      <Input v-model="youtube" placeholder="YouTube URL" />
    </template>
    <Button type="submit">Save settings</Button>
    <p class="sr-only">{{ values.general?.name }}</p>
  </form>
</template>
