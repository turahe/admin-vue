/**
 * Tag Types and Interfaces
 * Content tagging system types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'

// ===== Tag Types =====
export interface Tag extends BaseEntity {
  name: string
  slug: string
  description?: string
  color?: string
  status: 'active' | 'inactive'
  postsCount?: number
}

export interface TagCreateRequest extends BaseCreateRequest {
  name: string
  slug: string
  description?: string
  color?: string
  status?: 'active' | 'inactive'
}

export interface TagUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  color?: string
  status?: 'active' | 'inactive'
}

export interface TagFilters extends BaseFilters {
  color?: string
  status?: 'active' | 'inactive'
}

export interface TagStats {
  total: number
  active: number
  mostUsed: Tag[]
  avgUsage: number
}
