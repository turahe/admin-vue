export const postStatuses = ['draft', 'pending', 'published', 'scheduled', 'archived'] as const
export type PostStatus = (typeof postStatuses)[number]

export const visibilities = ['public', 'private'] as const
export type Visibility = (typeof visibilities)[number]

export const commentStatuses = ['pending', 'approved', 'spam', 'trash'] as const
export type CommentStatus = (typeof commentStatuses)[number]

export const userRoles = [
  'super_admin',
  'administrator',
  'editor',
  'author',
  'contributor',
  'subscriber',
] as const
export type UserRole = (typeof userRoles)[number]

export const userStatuses = ['active', 'invited', 'suspended'] as const
export type UserStatus = (typeof userStatuses)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl: string
  lastLoginAt: string
  createdAt: string
}

export interface AuthSession {
  user: User
  permissions: string[]
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  authorId: string
  categoryId: string
  tagIds: string[]
  status: PostStatus
  visibility: Visibility
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  canonicalUrl: string
  publishedAt: string
  scheduledAt: string
  createdAt: string
  updatedAt: string
  views: number
}

export interface PostInput {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  authorId: string
  categoryId: string
  tagIds: string[]
  status: PostStatus
  visibility: Visibility
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  canonicalUrl: string
  publishedAt: string
  scheduledAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string
  imageUrl: string
  createdAt: string
}

export interface CategoryInput {
  name: string
  slug: string
  description: string
  parentId: string
  imageUrl: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string
  createdAt: string
}

export interface TagInput {
  name: string
  slug: string
  description: string
}

export interface MediaAsset {
  id: string
  name: string
  mime: string
  size: number
  width: number
  height: number
  url: string
  createdAt: string
}

export interface MediaInput {
  name: string
  mime: string
  size: number
  width: number
  height: number
  url: string
}

export interface Comment {
  id: string
  postId: string
  parentId: string
  authorName: string
  authorEmail: string
  body: string
  status: CommentStatus
  createdAt: string
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface SiteSettings {
  general: {
    name: string
    description: string
    url: string
    logoUrl: string
    faviconUrl: string
    language: 'en' | 'id'
    timezone: string
  }
  reading: {
    postsPerPage: number
    homepageDisplay: 'latest' | 'static'
    defaultVisibility: Visibility
  }
  seo: {
    title: string
    description: string
    focusKeyword: string
    canonicalUrl: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    robotsIndex: boolean
    robotsFollow: boolean
    sitemapEnabled: boolean
  }
  social: {
    facebook: string
    instagram: string
    x: string
    linkedin: string
    youtube: string
  }
}

export interface ActivityEntry {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
}

export interface MenuLink {
  id: string
  label: string
  url: string
}

export interface WidgetToggle {
  id: string
  enabled: boolean
}

export interface DashboardPayload {
  stats: {
    totalPosts: number
    published: number
    drafts: number
    scheduled: number
    views: number
    comments: number
    authors: number
  }
  months: string[]
  pageViews: number[]
  publishedOverTime: number[]
  mostViewed: { title: string; views: number }[]
  sources: { label: string; value: number }[]
  recentPosts: Post[]
  recentComments: Comment[]
  topArticles: { title: string; views: number; comments: number }[]
  widgets: WidgetToggle[]
}

export interface AnalyticsPayload {
  pageViews: number
  uniqueVisitors: number
  averageReadingMinutes: number
  bounceRate: number
  months: string[]
  views: number[]
  visitors: number[]
  sources: { label: string; value: number }[]
  topArticles: { title: string; views: number }[]
  categories: { label: string; value: number }[]
  devices: { label: string; value: number }[]
  regions: { label: string; value: number }[]
}
