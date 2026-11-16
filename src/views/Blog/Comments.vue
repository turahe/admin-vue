<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import StatusBadge from '@/components/cms/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { errorMessage } from '@/api/errors'
import { deleteComment, listComments, replyToComment, setCommentStatus } from '@/services/comments'
import { listPosts } from '@/services/posts'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { formatDate } from '@/utils/format'
import type { Comment, CommentStatus } from '@/types/cms'

const toast = useToastStore()
const confirm = useConfirmStore()
const loading = ref(true)
const error = ref('')
const rows = ref<Comment[]>([])
const posts = ref<{ id: string; title: string }[]>([])
const search = ref('')
const status = ref('')
const replyOpen = ref(false)
const replyTarget = ref<Comment | null>(null)
const reply = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const page = await listPosts({ page: 1, pageSize: 50 })
    posts.value = page.items.map((post) => ({ id: post.id, title: post.title }))
    rows.value = await listComments(search.value, status.value)
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function postTitle(id: string) {
  return posts.value.find((post) => post.id === id)?.title ?? 'Unknown post'
}

async function mark(comment: Comment, next: CommentStatus) {
  try {
    await setCommentStatus(comment.id, next)
    toast.push(`Marked ${next}.`)
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

async function remove(comment: Comment) {
  const ok = await confirm.ask('Delete comment', 'Delete this comment and its replies?')
  if (!ok) return
  try {
    await deleteComment(comment.id)
    toast.push('Comment deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

function startReply(comment: Comment) {
  replyTarget.value = comment
  reply.value = ''
  replyOpen.value = true
}

async function sendReply() {
  if (!replyTarget.value) return
  try {
    await replyToComment(replyTarget.value.postId, replyTarget.value.id, reply.value)
    replyOpen.value = false
    toast.push('Reply published.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

const filters: Array<CommentStatus | ''> = ['', 'pending', 'approved', 'spam', 'trash']
</script>

<template>
  <PageBreadcrumb page-title="Comments" />
  <form class="mb-4 flex flex-wrap gap-2" @submit.prevent="load">
    <Input v-model="search" placeholder="Search comments" class="max-w-sm" />
    <select v-model="status" class="h-11 rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
      <option v-for="item in filters" :key="item || 'all'" :value="item">{{ item || 'All statuses' }}</option>
    </select>
    <Button type="submit" variant="outline">Search</Button>
  </form>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!rows.length" title="No comments" description="Approved, pending, spam, and trashed comments show up here." />
  <div v-else class="space-y-3">
    <article
      v-for="comment in rows"
      :key="comment.id"
      class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3"
      :class="comment.parentId ? 'ms-6' : ''"
    >
      <div class="flex flex-wrap items-center gap-2">
        <p class="font-medium text-gray-800 dark:text-white/90">{{ comment.authorName }}</p>
        <StatusBadge :status="comment.status" />
        <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <p class="mt-1 text-xs text-gray-500">{{ postTitle(comment.postId) }} · {{ comment.authorEmail }}</p>
      <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ comment.body }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <Button size="xs" @click="mark(comment, 'approved')">Approve</Button>
        <Button size="xs" variant="outline" @click="mark(comment, 'trash')">Reject</Button>
        <Button size="xs" variant="outline" @click="mark(comment, 'spam')">Spam</Button>
        <Button size="xs" variant="outline" @click="startReply(comment)">Reply</Button>
        <Button size="xs" variant="destructive" @click="remove(comment)">Delete</Button>
      </div>
    </article>
  </div>

  <Dialog v-model:open="replyOpen">
    <DialogContent class="max-w-lg p-6">
      <DialogHeader><DialogTitle>Reply</DialogTitle></DialogHeader>
      <textarea v-model="reply" rows="4" class="mt-4 w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <DialogFooter class="mt-4 flex justify-end gap-2">
        <Button variant="outline" @click="replyOpen = false">Cancel</Button>
        <Button @click="sendReply">Publish reply</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
