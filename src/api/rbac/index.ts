import request from '@/axios'
import type {
  Policy,
  CreatePolicyRequest,
  UpdatePolicyRequest,
  PolicyCollectionResponse,
  PolicyResourceResponse,
  UserRoleResourceResponse
} from './types'

/**
 * RBAC (Role-Based Access Control) API endpoints
 * Based on swagger specification for RBAC management
 */

/**
 * Get all policies with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with policies collection
 */
export const getPoliciesApi = (
  limit: number = 10,
  offset: number = 0
): Promise<PolicyCollectionResponse> => {
  return request.get({
    url: '/rbac/policies',
    params: { limit, offset }
  })
}

/**
 * Create a new policy
 * @param data Policy creation data
 * @returns Promise with created policy
 */
export const createPolicyApi = (data: CreatePolicyRequest): Promise<PolicyResourceResponse> => {
  return request.post({
    url: '/rbac/policies',
    data
  })
}

/**
 * Get policy by ID
 * @param id Policy ID
 * @returns Promise with policy details
 */
export const getPolicyByIdApi = (id: string): Promise<PolicyResourceResponse> => {
  return request.get({
    url: `/rbac/policies/${id}`
  })
}

/**
 * Update a policy
 * @param id Policy ID
 * @param data Policy update data
 * @returns Promise with updated policy
 */
export const updatePolicyApi = (
  id: string,
  data: UpdatePolicyRequest
): Promise<PolicyResourceResponse> => {
  return request.put({
    url: `/rbac/policies/${id}`,
    data
  })
}

/**
 * Delete a policy
 * @param id Policy ID
 * @returns Promise with success response
 */
export const deletePolicyApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/rbac/policies/${id}`
  })
}

/**
 * Get users for a specific role
 * @param role Role name or ID
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with users collection
 */
export const getRoleUsersApi = (
  role: string,
  limit: number = 10,
  offset: number = 0
): Promise<any> => {
  return request.get({
    url: `/rbac/roles/${role}/users`,
    params: { limit, offset }
  })
}

/**
 * Get roles for a specific user
 * @param user User ID or username
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with roles collection
 */
export const getUserRolesApi = (
  user: string,
  limit: number = 10,
  offset: number = 0
): Promise<any> => {
  return request.get({
    url: `/rbac/users/${user}/roles`,
    params: { limit, offset }
  })
}

/**
 * Assign a role to a user
 * @param user User ID or username
 * @param role Role name or ID
 * @returns Promise with user role assignment
 */
export const assignRoleToUserApi = (
  user: string,
  role: string
): Promise<UserRoleResourceResponse> => {
  return request.post({
    url: `/rbac/users/${user}/roles/${role}`
  })
}

/**
 * Remove a role from a user
 * @param user User ID or username
 * @param role Role name or ID
 * @returns Promise with user role removal
 */
export const removeRoleFromUserApi = (
  user: string,
  role: string
): Promise<UserRoleResourceResponse> => {
  return request.delete({
    url: `/rbac/users/${user}/roles/${role}`
  })
}
