<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/api/errors'
import { getPost } from '@/services/posts'
import { sanitizeHtml } from '@/utils/sanitize'
import type { Post } from '@/types/cms'

const route = useRoute()
const post = ref<Post | null>(null)
const error = ref('')
const html = ref('')

async function load() {
  const id = typeof route.params.id === 'string' ? route.params.id : ''
  try {
    const next = await getPost(id)
    post.value = next
    html.value = sanitizeHtml(next.content)
  } catch (caught) {
    error.value = errorMessage(caught)
  }
}

void load()
</script>

<template>
  <PageBreadcrumb page-title="Preview" />
  <p v-if="error" class="text-sm text-error-600">{{ error }}</p>
  <article v-else-if="post" class="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
    <p class="text-sm text-gray-500">{{ post.status }} · {{ post.visibility }}</p>
    <h1 class="mt-2 text-title-md text-gray-800 dark:text-white/90">{{ post.title }}</h1>
    <p class="mt-3 text-gray-600 dark:text-gray-300">{{ post.excerpt }}</p>
    <img v-if="post.featuredImage" :src="post.featuredImage" alt="" class="mt-6 max-h-64 w-full object-contain" />
    <div class="cms-preview mt-6 text-gray-800 dark:text-white/90" v-html="html" />
    <RouterLink :to="{ name: 'PostEdit', params: { id: post.id } }" class="mt-6 inline-block">
      <Button variant="outline">Back to editor</Button>
    </RouterLink>
  </article>
</template>
