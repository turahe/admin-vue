<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import PaginationBar from '@/components/cms/PaginationBar.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import StatusBadge from '@/components/cms/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import {
  bulkPosts,
  deletePost,
  duplicatePost,
  getDirectory,
  listPosts,
  toPostInput,
  updatePost,
  type Directory,
} from '@/services/posts'
import { useAuthStore } from '@/stores/auth'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { formatDate } from '@/utils/format'
import type { Post, PostStatus } from '@/types/cms'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()
const confirm = useConfirmStore()

const loading = ref(true)
const error = ref('')
const posts = ref<Post[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 5
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const status = ref('')
const categoryId = ref('')
const authorId = ref('')
const sort = ref<'updatedAt' | 'title' | 'views'>('updatedAt')
const order = ref<'asc' | 'desc'>('desc')
const selected = ref<string[]>([])
const directory = ref<Directory>({ authors: [], categories: [], tags: [] })

const allSelected = computed(() => posts.value.length > 0 && posts.value.every((post) => selected.value.includes(post.id)))

function nameOf(id: string, rows: { id: string; name: string }[]) {
  return rows.find((row) => row.id === id)?.name ?? '—'
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    directory.value = await getDirectory()
    const result = await listPosts({
      page: page.value,
      pageSize,
      search: search.value,
      status: status.value,
      categoryId: categoryId.value,
      authorId: authorId.value,
      sort: sort.value,
      order: order.value,
    })
    posts.value = result.items
    total.value = result.total
    selected.value = []
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

watch([page, status, categoryId, authorId, sort, order], () => void load())
watch(
  () => route.query.q,
  (value) => {
    search.value = typeof value === 'string' ? value : ''
    page.value = 1
    void load()
  },
)

void load()

function toggleAll() {
  selected.value = allSelected.value ? [] : posts.value.map((post) => post.id)
}

function toggle(id: string) {
  selected.value = selected.value.includes(id) ? selected.value.filter((item) => item !== id) : [...selected.value, id]
}

async function runBulk(action: 'delete' | 'publish') {
  if (!selected.value.length) return
  if (action === 'delete') {
    const ok = await confirm.ask('Delete posts', `Delete ${selected.value.length} selected posts?`)
    if (!ok) return
  }
  try {
    await bulkPosts(selected.value, action)
    toast.push(action === 'delete' ? 'Posts deleted.' : 'Posts published.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

async function remove(post: Post) {
  const ok = await confirm.ask('Delete post', `Delete “${post.title}”?`)
  if (!ok) return
  try {
    await deletePost(post.id)
    toast.push('Post deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

async function duplicate(post: Post) {
  try {
    const copy = await duplicatePost(post.id)
    toast.push('Post duplicated.')
    await router.push({ name: 'PostEdit', params: { id: copy.id } })
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

async function publish(post: Post) {
  try {
    await updatePost(post.id, toPostInput(post, { status: 'published' }))
    toast.push('Post published.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

const statuses: Array<PostStatus | ''> = ['', 'draft', 'pending', 'published', 'scheduled', 'archived']
</script>

<template>
  <PageBreadcrumb page-title="All posts" />
  <div class="mb-4 flex flex-wrap items-center gap-2">
    <form class="flex min-w-64 flex-1 gap-2" @submit.prevent="page = 1; load()">
      <Input v-model="search" placeholder="Search title, slug, or excerpt" />
      <Button type="submit" variant="outline">Search</Button>
    </form>
    <RouterLink v-if="auth.can('posts.write')" :to="{ name: 'PostCreate' }">
      <Button>Create post</Button>
    </RouterLink>
  </div>
  <div class="mb-4 grid gap-2 md:grid-cols-4">
    <select v-model="status" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" @change="page = 1">
      <option v-for="item in statuses" :key="item || 'all'" :value="item">{{ item || 'All statuses' }}</option>
    </select>
    <select v-model="categoryId" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" @change="page = 1">
      <option value="">All categories</option>
      <option v-for="category in directory.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
    </select>
    <select v-model="authorId" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" @change="page = 1">
      <option value="">All authors</option>
      <option v-for="author in directory.authors" :key="author.id" :value="author.id">{{ author.name }}</option>
    </select>
    <select v-model="sort" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
      <option value="updatedAt">Sort by date</option>
      <option value="title">Sort by title</option>
      <option value="views">Sort by views</option>
    </select>
  </div>
  <div class="mb-4 flex flex-wrap gap-2">
    <Button size="sm" variant="outline" @click="order = order === 'asc' ? 'desc' : 'asc'">
      {{ order === 'asc' ? 'Ascending' : 'Descending' }}
    </Button>
    <Button v-if="auth.can('posts.delete')" size="sm" variant="destructive" :disabled="!selected.length" @click="runBulk('delete')">
      Delete selected
    </Button>
    <Button v-if="auth.can('posts.publish')" size="sm" :disabled="!selected.length" @click="runBulk('publish')">
      Publish selected
    </Button>
  </div>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!posts.length" title="No posts match" description="Try another filter or write a new post." />
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-start text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <tr>
          <th class="p-3"><input type="checkbox" :checked="allSelected" @change="toggleAll" /></th>
          <th class="p-3 font-medium">Title</th>
          <th class="p-3 font-medium">Status</th>
          <th class="p-3 font-medium">Author</th>
          <th class="p-3 font-medium">Category</th>
          <th class="p-3 font-medium">Views</th>
          <th class="p-3 font-medium">Updated</th>
          <th class="p-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3"><input type="checkbox" :checked="selected.includes(post.id)" @change="toggle(post.id)" /></td>
          <td class="p-3">
            <p class="font-medium text-gray-800 dark:text-white/90">{{ post.title }}</p>
            <p class="text-xs text-gray-500">/{{ post.slug }}</p>
          </td>
          <td class="p-3"><StatusBadge :status="post.status" /></td>
          <td class="p-3 text-gray-600 dark:text-gray-300">{{ nameOf(post.authorId, directory.authors) }}</td>
          <td class="p-3 text-gray-600 dark:text-gray-300">{{ nameOf(post.categoryId, directory.categories) }}</td>
          <td class="p-3">{{ post.views.toLocaleString() }}</td>
          <td class="p-3 whitespace-nowrap">{{ formatDate(post.updatedAt) }}</td>
          <td class="p-3">
            <div class="flex flex-wrap gap-2">
              <RouterLink :to="{ name: 'PostEdit', params: { id: post.id } }"><Button size="xs" variant="outline">Edit</Button></RouterLink>
              <RouterLink :to="{ name: 'PostPreview', params: { id: post.id } }"><Button size="xs" variant="outline">Preview</Button></RouterLink>
              <Button size="xs" variant="outline" @click="duplicate(post)">Duplicate</Button>
              <Button v-if="auth.can('posts.publish') && post.status !== 'published'" size="xs" @click="publish(post)">Publish</Button>
              <Button v-if="auth.can('posts.delete')" size="xs" variant="destructive" @click="remove(post)">Delete</Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="!loading && !error" class="mt-4">
    <PaginationBar :page="page" :page-size="pageSize" :total="total" @update:page="page = $event" />
  </div>
</template>
