import request from '@/axios'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserCollectionResponse,
  UserResourceResponse,
  UserRoleCollectionResponse,
  UserMenuCollectionResponse
} from './types'

/**
 * Users API endpoints
 * Based on swagger specification for user management
 */

/**
 * Get all users with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with users collection
 */
export const getUsersApi = (
  limit: number = 10,
  offset: number = 0
): Promise<UserCollectionResponse> => {
  return request.get({
    url: '/users',
    params: { limit, offset }
  })
}

/**
 * Create a new user
 * @param data User creation data
 * @returns Promise with created user
 */
export const createUserApi = (data: CreateUserRequest): Promise<UserResourceResponse> => {
  return request.post({
    url: '/users',
    data
  })
}

/**
 * Get user by ID
 * @param id User ID
 * @returns Promise with user details
 */
export const getUserByIdApi = (id: string): Promise<UserResourceResponse> => {
  return request.get({
    url: `/users/${id}`
  })
}

/**
 * Update a user
 * @param id User ID
 * @param data User update data
 * @returns Promise with updated user
 */
export const updateUserApi = (
  id: string,
  data: UpdateUserRequest
): Promise<UserResourceResponse> => {
  return request.put({
    url: `/users/${id}`,
    data
  })
}

/**
 * Delete a user
 * @param id User ID
 * @returns Promise with success response
 */
export const deleteUserApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/users/${id}`
  })
}

/**
 * Change user password
 * @param id User ID
 * @param data Password change data
 * @returns Promise with success response
 */
export const changeUserPasswordApi = (id: string, data: ChangePasswordRequest): Promise<any> => {
  return request.put({
    url: `/users/${id}/password`,
    data
  })
}

/**
 * Get roles for a specific user
 * @param userId User ID
 * @returns Promise with user roles collection
 */
export const getUserRolesApi = (userId: string): Promise<UserRoleCollectionResponse> => {
  return request.get({
    url: `/users/${userId}/roles`
  })
}

/**
 * Assign a role to a user
 * @param userId User ID
 * @param roleId Role ID
 * @returns Promise with user role assignment
 */
export const assignRoleToUserApi = (userId: string, roleId: string): Promise<any> => {
  return request.post({
    url: `/users/${userId}/roles/${roleId}`
  })
}

/**
 * Remove a role from a user
 * @param userId User ID
 * @param roleId Role ID
 * @returns Promise with user role removal
 */
export const removeRoleFromUserApi = (userId: string, roleId: string): Promise<any> => {
  return request.delete({
    url: `/users/${userId}/roles/${roleId}`
  })
}

/**
 * Check if user has a specific role
 * @param userId User ID
 * @param roleId Role ID
 * @returns Promise with role check result
 */
export const checkUserRoleApi = (userId: string, roleId: string): Promise<any> => {
  return request.get({
    url: `/users/${userId}/roles/${roleId}/check`
  })
}

/**
 * Get menus for a specific user
 * @param userId User ID
 * @returns Promise with user menus collection
 */
export const getUserMenusApi = (userId: string): Promise<UserMenuCollectionResponse> => {
  return request.get({
    url: `/users/${userId}/menus`
  })
}
