import type { Permission } from '@/rbac/permissions'
import { permissions } from '@/rbac/permissions'
import type { Comment, CommentStatus, MediaAsset, Post, PostStatus, User, UserRole, UserStatus } from '@/types/cms'

const uiPermissions = new Set<string>(permissions)

const permissionMap: Record<string, Permission[]> = {
  'admin.access': ['dashboard.view'],
  'post.read': ['dashboard.view', 'posts.view'],
  'post.create': ['posts.write'],
  'post.update': ['posts.write'],
  'post.publish': ['posts.publish'],
  'post.delete': ['posts.delete'],
  'category.create': ['categories.manage'],
  'category.update': ['categories.manage'],
  'category.delete': ['categories.manage'],
  'tag.create': ['tags.manage'],
  'tag.update': ['tags.manage'],
  'tag.delete': ['tags.manage'],
  'media.create': ['media.manage'],
  'media.delete': ['media.manage'],
  'comment.moderate': ['comments.moderate'],
  'comment.delete': ['comments.moderate'],
  'user.read': ['users.manage'],
  'user.create': ['users.manage'],
  'user.update': ['users.manage'],
  'role.read': ['roles.manage'],
  'role.manage': ['roles.manage'],
  'settings.read': ['settings.manage'],
  'settings.update': ['settings.manage'],
  'analytics.read': ['analytics.view', 'dashboard.view'],
  'user.activity.read_all': ['activity.view'],
}

export function uiPermissionsFor(keys: string[]): Permission[] {
  if (keys.includes('*')) return [...permissions]
  const granted = new Set<Permission>()
  for (const key of keys) {
    for (const permission of permissionMap[key] ?? []) granted.add(permission)
    if (uiPermissions.has(key)) granted.add(key as Permission)
  }
  return [...granted]
}

export function apiRoleName(role: string): string {
  if (role === 'administrator' || role === 'super_admin') return 'admin'
  return role
}

export function uiRoleName(role: string): UserRole {
  if (role === 'admin') return 'administrator'
  if (role === 'editor' || role === 'author' || role === 'contributor' || role === 'subscriber' || role === 'super_admin') {
    return role
  }
  return 'author'
}

interface RawUser {
  id: string
  email?: string
  username?: string
  fullName?: string
  status?: string
  createdAt?: string
}

export function mapUser(raw: RawUser, role = 'author'): User {
  const status: UserStatus =
    raw.status === 'suspended' || raw.status === 'deleted'
      ? 'suspended'
      : raw.status === 'pending'
        ? 'invited'
        : 'active'
  return {
    id: raw.id,
    name: raw.fullName || raw.username || raw.email || 'User',
    email: raw.email ?? '',
    role: uiRoleName(role),
    status,
    avatarUrl: '',
    lastLoginAt: '',
    createdAt: raw.createdAt ?? '',
  }
}

interface RawTag {
  id: string
  name?: string
  slug?: string
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
  tags?: RawTag[]
}

const postStatusSet = new Set<PostStatus>(['draft', 'pending', 'published', 'scheduled', 'archived'])

export function mediaUrl(id: string | null | undefined): string {
  if (!id) return ''
  return `/api/v1/media/${id}/transform?w=640`
}

export function mediaIdFromUrl(url: string): string | null {
  const match = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(url)
  return match?.[1] ?? null
}

export function mapPost(raw: RawPost, seo?: {
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  canonicalUrl?: string
}): Post {
  const status = postStatusSet.has(raw.status as PostStatus) ? (raw.status as PostStatus) : 'draft'
  return {
    id: raw.id,
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    excerpt: raw.excerpt ?? '',
    content: raw.content ?? '',
    featuredImage: mediaUrl(raw.coverImageMediaId),
    authorId: raw.authorId ?? '',
    categoryId: raw.categoryId ?? '',
    tagIds: (raw.tags ?? []).map((tag) => tag.id),
    status,
    visibility: 'public',
    seoTitle: seo?.seoTitle ?? '',
    seoDescription: seo?.seoDescription ?? '',
    seoKeywords: (seo?.seoKeywords ?? []).join(', '),
    canonicalUrl: seo?.canonicalUrl ?? '',
    publishedAt: raw.publishedAt ?? '',
    scheduledAt: '',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    views: 0,
  }
}

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

export function mapComment(raw: RawComment): Comment {
  const status: CommentStatus =
    raw.status === 'approved' || raw.status === 'spam'
      ? raw.status
      : raw.status === 'rejected' || raw.status === 'deleted'
        ? 'trash'
        : 'pending'
  return {
    id: raw.id,
    postId: raw.postId ?? '',
    parentId: raw.parentId ?? '',
    authorName: raw.author?.name ?? 'Guest',
    authorEmail: raw.authorEmail ?? '',
    body: raw.content ?? '',
    status,
    createdAt: raw.createdAt ?? '',
  }
}

interface RawMedia {
  id: string
  originalFilename?: string
  contentType?: string
  sizeBytes?: number
  width?: number | null
  height?: number | null
  createdAt?: string
  variants?: Record<string, string>
}

export function mapMedia(raw: RawMedia): MediaAsset {
  return {
    id: raw.id,
    name: raw.originalFilename ?? 'file',
    mime: raw.contentType ?? 'application/octet-stream',
    size: raw.sizeBytes ?? 0,
    width: raw.width ?? 0,
    height: raw.height ?? 0,
    url: raw.variants?.card || raw.variants?.thumbnail || mediaUrl(raw.id),
    createdAt: raw.createdAt ?? '',
  }
}
