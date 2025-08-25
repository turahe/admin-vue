import request from '@/axios'
import type {
  Role,
  Permission,
  RoleCreateRequest,
  RoleUpdateRequest,
  RoleFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  RoleStats
} from '@/api/common/types'

// ===== Role CRUD Operations =====

/**
 * Get paginated list of roles with optional filters
 */
export const getRoleListApi = (params?: PaginationParams & RoleFilters) => {
  return request.get<ListResponse<Role>>({
    url: '/api/roles',
    params
  })
}

/**
 * Get all roles (no pagination)
 */
export const getAllRolesApi = (filters?: RoleFilters) => {
  return request.get<ApiResponse<Role[]>>({
    url: '/api/roles/all',
    params: filters
  })
}

/**
 * Get single role by ID
 */
export const getRoleByIdApi = (id: number) => {
  return request.get<ApiResponse<Role>>({
    url: `/api/roles/${id}`
  })
}

/**
 * Create new role
 */
export const createRoleApi = (data: RoleCreateRequest) => {
  return request.post<ApiResponse<Role>>({
    url: '/api/roles',
    data
  })
}

/**
 * Update existing role
 */
export const updateRoleApi = (id: number, data: RoleUpdateRequest) => {
  return request.put<ApiResponse<Role>>({
    url: `/api/roles/${id}`,
    data
  })
}

/**
 * Delete role by ID
 */
export const deleteRoleApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/roles/${id}`
  })
}

/**
 * Bulk delete roles
 */
export const bulkDeleteRolesApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/roles/bulk',
    data
  })
}

/**
 * Bulk update roles
 */
export const bulkUpdateRolesApi = (data: BulkUpdateRequest<RoleUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/roles/bulk',
    data
  })
}

/**
 * Toggle role status
 */
export const toggleRoleStatusApi = (id: number) => {
  return request.patch<ApiResponse<Role>>({
    url: `/api/roles/${id}/toggle-status`
  })
}

/**
 * Update role sort order
 */
export const updateRoleSortApi = (data: { id: number; sort: number }[]) => {
  return request.put<ApiResponse<void>>({
    url: '/api/roles/sort',
    data
  })
}

/**
 * Get role statistics
 */
export const getRoleStatsApi = () => {
  return request.get<ApiResponse<RoleStats>>({
    url: '/api/roles/stats'
  })
}

/**
 * Validate role key uniqueness
 */
export const validateRoleKeyApi = (key: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/roles/validate-key',
    params: { key, excludeId }
  })
}

// ===== Permission Operations =====

/**
 * Get all permissions
 */
export const getPermissionsApi = () => {
  return request.get<ApiResponse<Permission[]>>({
    url: '/api/permissions'
  })
}

/**
 * Get permissions by resource
 */
export const getPermissionsByResourceApi = (resource: string) => {
  return request.get<ApiResponse<Permission[]>>({
    url: '/api/permissions/by-resource',
    params: { resource }
  })
}

/**
 * Get role permissions
 */
export const getRolePermissionsApi = (roleId: number) => {
  return request.get<ApiResponse<Permission[]>>({
    url: `/api/roles/${roleId}/permissions`
  })
}

/**
 * Assign permissions to role
 */
export const assignPermissionsApi = (roleId: number, permissionIds: number[]) => {
  return request.post<ApiResponse<void>>({
    url: `/api/roles/${roleId}/permissions`,
    data: { permissionIds }
  })
}

/**
 * Remove permissions from role
 */
export const removePermissionsApi = (roleId: number, permissionIds: number[]) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/roles/${roleId}/permissions`,
    data: { permissionIds }
  })
}

/**
 * Check if role has permission
 */
export const checkRolePermissionApi = (roleId: number, permission: string) => {
  return request.get<ApiResponse<{ hasPermission: boolean }>>({
    url: `/api/roles/${roleId}/check-permission`,
    params: { permission }
  })
}

/**
 * Get users with role
 */
export const getRoleUsersApi = (roleId: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/roles/${roleId}/users`,
    params
  })
}

// ===== Legacy Support =====
/**
 * @deprecated Use getRoleListApi instead
 */
export const getRoleListApiLegacy = () => {
  return request.get({ url: '/mock/role/table' })
}
