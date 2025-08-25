/**
 * Blog Types and Interfaces
 * Blog/Post content management types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'
import type { Category } from './category'
import type { Tag } from './tag'

// ===== Blog Types =====
export interface Blog extends BaseEntity {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  authorId: number
  author?: Author
  categoryId?: number
  category?: Category
  tags: Tag[]
  seoTitle?: string
  seoDescription?: string
  viewsCount: number
  likesCount: number
  commentsCount: number
  readingTime?: number
}

export interface Author {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface BlogCreateRequest extends BaseCreateRequest {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status?: 'draft' | 'published' | 'scheduled'
  publishedAt?: string
  categoryId?: number
  tagIds?: number[]
  seoTitle?: string
  seoDescription?: string
}

export interface BlogUpdateRequest extends BaseUpdateRequest {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  featuredImage?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  categoryId?: number
  tagIds?: number[]
  seoTitle?: string
  seoDescription?: string
}

export interface BlogFilters extends BaseFilters {
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  authorId?: number
  categoryId?: number
  tagId?: number
  featured?: boolean
}

export interface BlogStats {
  total: number
  published: number
  draft: number
  scheduled: number
  totalViews: number
  totalLikes: number
  avgReadingTime: number
}
