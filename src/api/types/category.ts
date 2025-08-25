/**
 * Category Types and Interfaces
 * Content categorization system types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'

// ===== Category Types =====
export interface Category extends BaseEntity {
  name: string
  slug: string
  description?: string
  parentId?: number
  image?: string
  sort: number
  status: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
  children?: Category[]
  postsCount?: number
}

export interface CategoryCreateRequest extends BaseCreateRequest {
  name: string
  slug: string
  description?: string
  parentId?: number
  image?: string
  sort?: number
  status?: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
}

export interface CategoryUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  parentId?: number
  image?: string
  sort?: number
  status?: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
}

export interface CategoryFilters extends BaseFilters {
  parentId?: number
  hasChildren?: boolean
  status?: 'active' | 'inactive'
}

export interface CategoryStats {
  total: number
  active: number
  withPosts: number
  avgPostsPerCategory: number
}
