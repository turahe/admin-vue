/**
 * Role and Permission Types
 * Access control and permission management types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'

// ===== Role Types =====
export interface Role extends BaseEntity {
  id: string
  name: string
  key: string
  description?: string
  status: 'active' | 'inactive'
  permissions: Permission[]
  sort: number
  roleName?: string // For backward compatibility
  createTime?: string // For backward compatibility
  remark?: string // For backward compatibility
}

export interface Permission extends BaseEntity {
  id: string
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
  roleName?: string
}

export interface RoleStats {
  total: number
  active: number
  inactive: number
  avgPermissions: number
}

// API Response types
export interface RoleListResponse {
  data: Role[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface RoleResponse {
  data: Role
}

export interface PermissionListResponse {
  data: Permission[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
