import request from '@/axios'
import type {
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
  RoleFilters,
  RoleStats,
  Permission,
  RoleListResponse,
  RoleResponse,
  PermissionListResponse
} from './types'

/**
 * Role API endpoints
 * Based on swagger specification for role management
 */

/**
 * Get all roles with pagination and filters
 * @param params Query parameters for filtering and pagination
 * @returns Promise with roles collection
 */
export const getRoleListApi = (params?: RoleFilters) => {
  return request.get({
    url: '/api/v1/roles',
    params
  })
}

/**
 * Get roles for table display with pagination
 * @param params Query parameters for filtering and pagination
 * @returns Promise with roles collection
 */
export const getRoleTableApi = (params: RoleFilters) => {
  return request.get({
    url: '/api/v1/roles',
    params
  })
}

/**
 * Get role by ID
 * @param id Role ID
 * @returns Promise with role details
 */
export const getRoleByIdApi = (id: string) => {
  return request.get({
    url: `/api/v1/roles/${id}`
  })
}

/**
 * Create a new role
 * @param data Role creation data
 * @returns Promise with created role
 */
export const createRoleApi = (data: RoleCreateRequest) => {
  return request.post({
    url: '/api/v1/roles',
    data
  })
}

/**
 * Update a role
 * @param id Role ID
 * @param data Role update data
 * @returns Promise with updated role
 */
export const updateRoleApi = (id: string, data: RoleUpdateRequest) => {
  return request.put({
    url: `/api/v1/roles/${id}`,
    data
  })
}

/**
 * Delete roles (single or batch)
 * @param ids Array of role IDs to delete
 * @returns Promise with success response
 */
export const deleteRoleApi = (ids: string[] | number[]) => {
  return request.delete({
    url: '/api/v1/roles',
    data: { ids }
  })
}

/**
 * Delete a single role by ID
 * @param id Role ID
 * @returns Promise with success response
 */
export const deleteRoleByIdApi = (id: string) => {
  return request.delete({
    url: `/api/v1/roles/${id}`
  })
}

/**
 * Update role status
 * @param id Role ID
 * @param status New status
 * @returns Promise with success response
 */
export const updateRoleStatusApi = (id: string, status: 'active' | 'inactive') => {
  return request.put({
    url: `/api/v1/roles/${id}/status`,
    data: { status }
  })
}

/**
 * Search roles by name or description
 * @param query Search query
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with roles collection
 */
export const searchRolesApi = (query: string, limit: number = 10, offset: number = 0) => {
  return request.get({
    url: '/api/v1/roles/search',
    params: { query, limit, offset }
  })
}

/**
 * Get role by slug/key
 * @param key Role key/slug
 * @returns Promise with role details
 */
export const getRoleByKeyApi = (key: string) => {
  return request.get({
    url: `/api/v1/roles/key/${key}`
  })
}

/**
 * Activate a role
 * @param id Role ID
 * @returns Promise with success response
 */
export const activateRoleApi = (id: string) => {
  return request.put({
    url: `/api/v1/roles/${id}/activate`
  })
}

/**
 * Deactivate a role
 * @param id Role ID
 * @returns Promise with success response
 */
export const deactivateRoleApi = (id: string) => {
  return request.put({
    url: `/api/v1/roles/${id}/deactivate`
  })
}

/**
 * Get users for a specific role
 * @param roleId Role ID
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with users collection
 */
export const getRoleUsersApi = (roleId: string, limit: number = 10, offset: number = 0) => {
  return request.get({
    url: `/api/v1/roles/${roleId}/users`,
    params: { limit, offset }
  })
}

/**
 * Get user count for a specific role
 * @param roleId Role ID
 * @returns Promise with user count
 */
export const getRoleUserCountApi = (roleId: string) => {
  return request.get({
    url: `/api/v1/roles/${roleId}/users/count`
  })
}

/**
 * Get role statistics
 * @returns Promise with role statistics
 */
export const getRoleStatsApi = () => {
  return request.get({
    url: '/api/v1/roles/stats'
  })
}

/**
 * Get all permissions for role assignment
 * @returns Promise with permissions collection
 */
export const getPermissionsApi = () => {
  return request.get({
    url: '/api/v1/permissions'
  })
}

/**
 * Assign permissions to a role
 * @param roleId Role ID
 * @param permissionIds Array of permission IDs
 * @returns Promise with success response
 */
export const assignPermissionsToRoleApi = (roleId: string, permissionIds: number[]) => {
  return request.post({
    url: `/api/v1/roles/${roleId}/permissions`,
    data: { permissionIds }
  })
}

/**
 * Remove permissions from a role
 * @param roleId Role ID
 * @param permissionIds Array of permission IDs
 * @returns Promise with success response
 */
export const removePermissionsFromRoleApi = (roleId: string, permissionIds: number[]) => {
  return request.delete({
    url: `/api/v1/roles/${roleId}/permissions`,
    data: { permissionIds }
  })
}

/**
 * Get role permissions
 * @param roleId Role ID
 * @returns Promise with permissions collection
 */
export const getRolePermissionsApi = (roleId: string) => {
  return request.get({
    url: `/api/v1/roles/${roleId}/permissions`
  })
}
// Export types for external use
export type { Role, RoleCreateRequest, RoleUpdateRequest, RoleFilters, RoleStats, Permission }
