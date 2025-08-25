/**
 * Menu Types and Interfaces
 * Navigation and menu system types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'

// ===== Menu Types =====
export interface Menu extends BaseEntity {
  name: string
  path: string
  component?: string
  icon?: string
  parentId?: number
  sort: number
  visible: boolean
  permission?: string
  meta?: MenuMeta
  children?: Menu[]
}

export interface MenuMeta {
  title: string
  icon?: string
  noCache?: boolean
  breadcrumb?: boolean
  activeMenu?: string
}

export interface MenuCreateRequest extends BaseCreateRequest {
  name: string
  path: string
  component?: string
  icon?: string
  parentId?: number
  sort?: number
  visible?: boolean
  permission?: string
  meta?: MenuMeta
}

export interface MenuUpdateRequest extends BaseUpdateRequest {
  name?: string
  path?: string
  component?: string
  icon?: string
  parentId?: number
  sort?: number
  visible?: boolean
  permission?: string
  meta?: MenuMeta
}

export interface MenuFilters extends BaseFilters {
  parentId?: number
  visible?: boolean
  permission?: string
  status?: 'active' | 'inactive'
}

export interface MenuStats {
  total: number
  visible: number
  hidden: number
  withChildren: number
}
