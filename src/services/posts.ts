import { api, read } from '@/api/client'
import { ApiError } from '@/api/errors'
import { mapPost, mediaIdFromUrl } from '@/api/map'
import type { PageResult, Post, PostInput, PostStatus } from '@/types/cms'

export interface PostQuery {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  categoryId?: string
  authorId?: string
  sort?: 'updatedAt' | 'title' | 'views'
  order?: 'asc' | 'desc'
}

export interface Directory {
  authors: { id: string; name: string }[]
  categories: { id: string; name: string; parentId: string }[]
  tags: { id: string; name: string }[]
}

interface RawPost {
  id: string
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  authorId?: string
  categoryId?: string | null
  coverImageMediaId?: string | null
  status?: string
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
  tags?: { id: string; name?: string; slug?: string }[]
}

interface RawSeo {
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  canonicalUrl?: string
}

async function tagNames(ids: string[]): Promise<string[]> {
  if (ids.length === 0) return []
  const { data } = await read<{ id: string; name: string }[]>(api.get('/api/v1/tags'))
  const names = new Map(data.map((tag) => [tag.id, tag.name]))
  return ids.map((id) => names.get(id) ?? id)
}

async function applyStatus(id: string, status: PostStatus): Promise<void> {
  if (status === 'pending' || status === 'scheduled') {
    throw new ApiError('This API publishes, unpublishes, and archives posts. Pending and scheduled are not available.', 400)
  }
  const path =
    status === 'published' ? 'publish' : status === 'archived' ? 'archive' : status === 'draft' ? 'unpublish' : ''
  if (!path) return
  try {
    await read(api.post(`/api/v1/admin/posts/${id}/${path}`))
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) return
    throw error
  }
}

async function applySeo(id: string, input: PostInput): Promise<void> {
  if (!input.seoTitle && !input.seoDescription && !input.seoKeywords && !input.canonicalUrl) return
  await read(
    api.put(`/api/v1/admin/posts/${id}/seo`, {
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoKeywords: input.seoKeywords
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      canonicalUrl: input.canonicalUrl,
    }),
  )
}

async function applyCover(id: string, featuredImage: string): Promise<void> {
  const mediaAssetId = mediaIdFromUrl(featuredImage)
  if (!mediaAssetId) return
  await read(
    api.patch(`/api/v1/admin/posts/${id}/media`, {
      items: [{ mediaAssetId, kind: 'cover', sortOrder: 0 }],
    }),
  )
}

function bodyOf(input: PostInput, tags: string[]) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content.trim() ? input.content : ' ',
    categoryId: input.categoryId || null,
    tags,
  }
}

export async function getDirectory(): Promise<Directory> {
  const [categories, tags, users] = await Promise.all([
    read<{ id: string; name: string; parentId?: string | null }[]>(api.get('/api/v1/admin/categories')),
    read<{ id: string; name: string }[]>(api.get('/api/v1/tags')),
    read<{ id: string; fullName?: string; username?: string; email?: string }[]>(
      api.get('/api/v1/admin/users', { params: { perPage: 100 } }),
    ),
  ])
  return {
    authors: users.data.map((user) => ({ id: user.id, name: user.fullName || user.username || user.email || 'User' })),
    categories: categories.data.map((category) => ({
      id: category.id,
      name: category.name,
      parentId: category.parentId ?? '',
    })),
    tags: tags.data,
  }
}

export async function listPosts(query: PostQuery): Promise<PageResult<Post>> {
  const { data, meta } = await read<RawPost[]>(
    api.get('/api/v1/admin/posts', {
      params: {
        page: query.page ?? 1,
        perPage: query.pageSize ?? 10,
        q: query.search || undefined,
        status: query.status || undefined,
        categoryId: query.categoryId || undefined,
        authorId: query.authorId || undefined,
      },
    }),
  )
  return {
    items: data.map((post) => mapPost(post)),
    total: meta.total ?? data.length,
    page: meta.currentPage ?? query.page ?? 1,
    pageSize: meta.perPage ?? query.pageSize ?? 10,
  }
}

export async function getPost(id: string): Promise<Post> {
  const [post, seo] = await Promise.all([
    read<RawPost>(api.get(`/api/v1/admin/posts/${id}`)),
    read<RawSeo>(api.get(`/api/v1/admin/posts/${id}/seo`)).catch(() => ({ data: {} as RawSeo, meta: {} })),
  ])
  return mapPost(post.data, seo.data)
}

export async function createPost(input: PostInput): Promise<Post> {
  const tags = await tagNames(input.tagIds)
  const { data } = await read<RawPost>(api.post('/api/v1/admin/posts', bodyOf(input, tags)))
  await applyStatus(data.id, input.status)
  await applySeo(data.id, input)
  await applyCover(data.id, input.featuredImage)
  return getPost(data.id)
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  const tags = await tagNames(input.tagIds)
  await read(api.patch(`/api/v1/admin/posts/${id}`, bodyOf(input, tags)))
  await applyStatus(id, input.status)
  await applySeo(id, input)
  await applyCover(id, input.featuredImage)
  return getPost(id)
}

export async function deletePost(id: string): Promise<void> {
  await read(api.delete(`/api/v1/admin/posts/${id}`))
}

export async function duplicatePost(id: string): Promise<Post> {
  const post = await getPost(id)
  return createPost({
    ...toPostInput(post),
    title: `${post.title} (copy)`,
    slug: `${post.slug}-copy`,
    status: 'draft',
  })
}

export async function bulkPosts(ids: string[], action: 'delete' | 'publish'): Promise<void> {
  await Promise.all(ids.map((id) => (action === 'delete' ? deletePost(id) : applyStatus(id, 'published'))))
}

export function toPostInput(post: Post, patch: Partial<PostInput> = {}): PostInput {
  return {
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
    scheduledAt: post.scheduledAt,
    ...patch,
  }
}
