<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import MediaPicker from '@/components/cms/MediaPicker.vue'
import SearchPreview from '@/components/cms/SearchPreview.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import TipTapEditor from '@/components/cms/TipTapEditor.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { createPost, getDirectory, getPost, updatePost, type Directory } from '@/services/posts'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/feedback'
import { sanitizeHtml } from '@/utils/sanitize'
import { slugify } from '@/utils/slug'
import type { MediaAsset, PostInput, PostStatus, Visibility } from '@/types/cms'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const postId = ref(typeof route.params.id === 'string' ? route.params.id : '')
const loading = ref(Boolean(postId.value))
const error = ref('')
const preview = ref(false)
const pickerOpen = ref(false)
const pickerMode = ref<'featured' | 'content'>('featured')
const slugTouched = ref(false)
const saveState = ref('Saved')
const directory = ref<Directory>({ authors: [], categories: [], tags: [] })
const editorRef = ref<{ setImage: (url: string) => void } | null>(null)

const form = reactive<PostInput>({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  authorId: auth.user?.id ?? '',
  categoryId: '',
  tagIds: [],
  status: 'draft',
  visibility: 'public',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  canonicalUrl: '',
  publishedAt: '',
  scheduledAt: '',
})

const previewHtml = computed(() => sanitizeHtml(form.content))
const canPublish = computed(() => auth.can('posts.publish'))
const siteUrl = 'https://fielddesk.blog'

function toLocalInput(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function snapshot(status: PostStatus = form.status): PostInput {
  const scheduled = form.scheduledAt
  const parsed = scheduled ? new Date(scheduled) : null
  return {
    ...form,
    status,
    tagIds: [...form.tagIds],
    scheduledAt: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : scheduled,
  }
}

async function persist(status: PostStatus, announce: boolean) {
  if (!form.title.trim() || !form.slug.trim()) return
  saveState.value = 'Saving…'
  try {
    const body = snapshot(status)
    if (!postId.value) {
      const created = await createPost(body)
      postId.value = created.id
      await router.replace({ name: 'PostEdit', params: { id: created.id } })
    } else {
      await updatePost(postId.value, body)
    }
    form.status = status
    saveState.value = 'Saved'
    if (announce) toast.push(status === 'published' ? 'Post published.' : 'Post saved.')
  } catch (caught) {
    saveState.value = 'Not saved'
    toast.push(errorMessage(caught), 'error')
  }
}

let timer = 0
let ready = false

watch(
  form,
  () => {
    if (!ready) return
    saveState.value = 'Unsaved'
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      void persist(form.status, false)
    }, 1400)
  },
  { deep: true },
)

watch(
  () => form.title,
  (title) => {
    if (!slugTouched.value) form.slug = slugify(title)
  },
)

onBeforeUnmount(() => window.clearTimeout(timer))

async function load() {
  try {
    directory.value = await getDirectory()
    if (!postId.value) return
    const post = await getPost(postId.value)
    Object.assign(form, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      authorId: post.authorId,
      categoryId: post.categoryId,
      tagIds: [...post.tagIds],
      status: post.status,
      visibility: post.visibility,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      canonicalUrl: post.canonicalUrl,
      publishedAt: post.publishedAt,
      scheduledAt: toLocalInput(post.scheduledAt),
    })
    slugTouched.value = true
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
    ready = true
  }
}

void load()

function toggleTag(id: string) {
  form.tagIds = form.tagIds.includes(id) ? form.tagIds.filter((tag) => tag !== id) : [...form.tagIds, id]
}

function onPicked(asset: MediaAsset) {
  if (pickerMode.value === 'featured') form.featuredImage = asset.url
  else editorRef.value?.setImage(asset.url)
}

function openPicker(mode: 'featured' | 'content') {
  pickerMode.value = mode
  pickerOpen.value = true
}

const statuses = computed(() =>
  canPublish.value
    ? (['draft', 'pending', 'published', 'scheduled', 'archived'] as PostStatus[])
    : (['draft', 'pending', 'archived'] as PostStatus[]),
)
const visibilities: Visibility[] = ['public', 'private']
</script>

<template>
  <PageBreadcrumb :page-title="postId ? 'Edit post' : 'Create post'" />
  <SkeletonRows v-if="loading" />
  <p v-else-if="error" class="text-sm text-error-600">{{ error }}</p>
  <div v-else class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
    <section class="space-y-4">
      <Input v-model="form.title" placeholder="Post title" class="h-14 text-lg" />
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Slug
        <Input v-model="form.slug" class="mt-1" @input="slugTouched = true" />
      </label>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" @click="preview = !preview">{{ preview ? 'Editor' : 'Preview' }}</Button>
        <Button variant="outline" size="sm" @click="openPicker('content')">Insert image</Button>
        <span class="ms-auto self-center text-xs text-gray-500 dark:text-gray-400">{{ saveState }}</span>
      </div>
      <article
        v-if="preview"
        class="cms-preview rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        v-html="previewHtml"
      />
      <TipTapEditor v-else ref="editorRef" v-model="form.content" />
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Excerpt
        <textarea
          v-model="form.excerpt"
          rows="3"
          class="mt-1 w-full rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </label>
    </section>

    <aside class="space-y-4">
      <div class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <h3 class="text-sm font-medium text-gray-800 dark:text-white/90">Publish</h3>
        <label class="block text-sm text-gray-500">
          Status
          <select v-model="form.status" class="mt-1 h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </label>
        <label class="block text-sm text-gray-500">
          Visibility
          <select v-model="form.visibility" class="mt-1 h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
            <option v-for="item in visibilities" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <label v-if="form.status === 'scheduled'" class="block text-sm text-gray-500">
          Schedule
          <Input v-model="form.scheduledAt" type="datetime-local" class="mt-1" />
        </label>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" @click="persist('draft', true)">Save draft</Button>
          <Button v-if="canPublish" size="sm" @click="persist('published', true)">Publish</Button>
          <Button v-if="canPublish" variant="outline" size="sm" @click="persist('scheduled', true)">Schedule</Button>
        </div>
      </div>

      <div class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <h3 class="text-sm font-medium text-gray-800 dark:text-white/90">Featured image</h3>
        <img v-if="form.featuredImage" :src="form.featuredImage" alt="" class="h-28 w-full rounded-xl object-contain" />
        <Button variant="outline" size="sm" @click="openPicker('featured')">Select image</Button>
      </div>

      <div class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <label class="block text-sm text-gray-500">
          Category
          <select v-model="form.categoryId" class="mt-1 h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
            <option value="">None</option>
            <option v-for="category in directory.categories" :key="category.id" :value="category.id">
              {{ category.parentId ? '— ' : '' }}{{ category.name }}
            </option>
          </select>
        </label>
        <label v-if="canPublish" class="block text-sm text-gray-500">
          Author
          <select v-model="form.authorId" class="mt-1 h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
            <option v-for="author in directory.authors" :key="author.id" :value="author.id">{{ author.name }}</option>
          </select>
        </label>
        <div>
          <p class="text-sm text-gray-500">Tags</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="tag in directory.tags"
              :key="tag.id"
              type="button"
              class="rounded-full border px-3 py-1 text-xs"
              :class="form.tagIds.includes(tag.id) ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15' : 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <h3 class="text-sm font-medium text-gray-800 dark:text-white/90">SEO</h3>
        <Input v-model="form.seoTitle" placeholder="SEO title" />
        <textarea v-model="form.seoDescription" rows="3" placeholder="Meta description" class="w-full rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <Input v-model="form.seoKeywords" placeholder="Keywords" />
        <Input v-model="form.canonicalUrl" placeholder="Canonical URL" />
        <SearchPreview
          :title="form.seoTitle || form.title"
          :url="form.canonicalUrl || `${siteUrl}/${form.slug}`"
          :description="form.seoDescription || form.excerpt"
        />
      </div>
    </aside>
    <MediaPicker v-model:open="pickerOpen" @select="onPicked" />
  </div>
</template>

<style>
.cms-preview h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1rem; }
.cms-preview p { margin-top: 0.75rem; }
.cms-preview ul { list-style: disc; padding-inline-start: 1.25rem; }
.cms-preview blockquote { border-inline-start: 3px solid var(--color-brand-500); padding-inline-start: 0.75rem; }
</style>
