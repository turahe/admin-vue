import { api, read } from '@/api/client'
import { mapComment } from '@/api/map'
import type { Comment, CommentStatus } from '@/types/cms'

interface RawComment {
  id: string
  postId?: string
  parentId?: string | null
  content?: string
  status?: string
  author?: { name?: string } | null
  authorEmail?: string | null
  createdAt?: string
}

const actionFor: Record<CommentStatus, string> = {
  approved: 'approve',
  spam: 'spam',
  trash: 'reject',
  pending: 'restore',
}

const statusQuery: Record<string, string> = {
  pending: 'pending,flagged',
  approved: 'approved',
  spam: 'spam',
  trash: 'rejected,deleted',
}

export async function listComments(search = '', status = ''): Promise<Comment[]> {
  const { data } = await read<RawComment[]>(
    api.get('/api/v1/admin/comments', {
      params: { status: statusQuery[status] || undefined, perPage: 100, sort: 'newest' },
    }),
  )
  const needle = search.trim().toLowerCase()
  return data
    .map(mapComment)
    .filter((comment) => !needle || comment.body.toLowerCase().includes(needle) || comment.authorName.toLowerCase().includes(needle))
}

export async function setCommentStatus(id: string, status: CommentStatus): Promise<Comment> {
  const { data } = await read<RawComment>(
    api.post(`/api/v1/admin/comments/${id}/moderate`, { action: actionFor[status] }),
  )
  return mapComment(data)
}

export async function replyToComment(postId: string, parentId: string, body: string): Promise<Comment> {
  const { data } = await read<RawComment>(
    api.post(`/api/v1/posts/${postId}/comments`, { content: body, parentId: parentId || undefined }),
  )
  return mapComment(data)
}

export async function deleteComment(id: string): Promise<void> {
  await read(api.delete(`/api/v1/admin/comments/${id}`))
}
