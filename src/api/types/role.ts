/**
 * Role and Permission Types
 * Access control and permission management types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'

// ===== Role Types =====
export interface Role extends BaseEntity {
  name: string
  key: string
  description?: string
  status: 'active' | 'inactive'
  permissions: Permission[]
  sort: number
}

export interface Permission extends BaseEntity {
  name: string
  key: string
  resource: string
  action: string
  description?: string
}

export interface RoleCreateRequest extends BaseCreateRequest {
  name: string
  key: string
  description?: string
  status?: 'active' | 'inactive'
  permissionIds: number[]
  sort?: number
}

export interface RoleUpdateRequest extends BaseUpdateRequest {
  name?: string
  key?: string
  description?: string
  status?: 'active' | 'inactive'
  permissionIds?: number[]
  sort?: number
}

export interface RoleFilters extends BaseFilters {
  status?: 'active' | 'inactive'
  hasPermission?: string
}

export interface RoleStats {
  total: number
  active: number
  inactive: number
  avgPermissions: number
}
