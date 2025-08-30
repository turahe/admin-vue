import request from '@/axios'
import { RoleListResponse, RoleParams, RoleCreateData, RoleUpdateData } from './types'

/**
 * Role API endpoints
 * Based on swagger specification for role management
 */

export const getRoleListApi = () => {
  return request.get<RoleListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`
  })
}

export const getRoleTableApi = (params: RoleParams) => {
  return request.get<RoleListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`,
    params
  })
}

export const getRoleByIdApi = (id: string) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}` })
}

export const createRoleApi = (data: RoleCreateData) => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles`, data })
}

export const updateRoleApi = (id: string, data: RoleUpdateData) => {
  return request.put({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}`, data })
}

export const deleteRoleApi = (ids: string[] | number[]) => {
  return request.delete({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`,
    data: { ids }
  })
}

export const updateRoleStatusApi = (id: string, status: string) => {
  return request.put({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}/status`,
    data: { status }
  })
}

/**
 * Enhanced role endpoints from swagger specification
 */

/**
 * Search roles by name or description
 * @param query Search query
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with roles collection
 */
export const searchRolesApi = (
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<any> => {
  return request.get({
    url: '/roles/search',
    params: { query, limit, offset }
  })
}

/**
 * Get role by slug
 * @param slug Role slug
 * @returns Promise with role details
 */
export const getRoleBySlugApi = (slug: string): Promise<any> => {
  return request.get({
    url: `/roles/slug/${slug}`
  })
}

/**
 * Activate a role
 * @param id Role ID
 * @returns Promise with success response
 */
export const activateRoleApi = (id: string): Promise<any> => {
  return request.put({
    url: `/roles/${id}/activate`
  })
}

/**
 * Deactivate a role
 * @param id Role ID
 * @returns Promise with success response
 */
export const deactivateRoleApi = (id: string): Promise<any> => {
  return request.put({
    url: `/roles/${id}/deactivate`
  })
}

/**
 * Get users for a specific role
 * @param roleId Role ID
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with users collection
 */
export const getRoleUsersApi = (
  roleId: string,
  limit: number = 10,
  offset: number = 0
): Promise<any> => {
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
export const getRoleUserCountApi = (roleId: string): Promise<any> => {
  return request.get({
    url: `/api/v1/roles/${roleId}/users/count`
  })
}

// Export types for external use
export type { RoleListResponse, RoleParams, RoleCreateData, RoleUpdateData }
export type { Role } from './types'
