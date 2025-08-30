import request from '@/axios'
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  MoveOrganizationRequest,
  OrganizationCollectionResponse,
  OrganizationResourceResponse,
  OrganizationTreeResponse,
  OrganizationStatsResponse
} from './types'

/**
 * Organizations API endpoints
 * Based on swagger specification for organization management
 */

/**
 * Get all organizations with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with organizations collection
 */
export const getOrganizationsApi = (
  limit: number = 10,
  offset: number = 0
): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: '/organizations',
    params: { limit, offset }
  })
}

/**
 * Create a new organization
 * @param data Organization creation data
 * @returns Promise with created organization
 */
export const createOrganizationApi = (
  data: CreateOrganizationRequest
): Promise<OrganizationResourceResponse> => {
  return request.post({
    url: '/organizations',
    data
  })
}

/**
 * Get root organizations (organizations without parent)
 * @returns Promise with root organizations
 */
export const getRootOrganizationsApi = (): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: '/organizations/root'
  })
}

/**
 * Search organizations
 * @param query Search query
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with organizations collection
 */
export const searchOrganizationsApi = (
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: '/organizations/search',
    params: { query, limit, offset }
  })
}

/**
 * Get organization tree structure
 * @returns Promise with organization tree
 */
export const getOrganizationTreeApi = (): Promise<OrganizationTreeResponse> => {
  return request.get({
    url: '/organizations/tree'
  })
}

/**
 * Validate organization hierarchy
 * @returns Promise with validation result
 */
export const validateOrganizationHierarchyApi = (): Promise<any> => {
  return request.get({
    url: '/organizations/validate-hierarchy'
  })
}

/**
 * Get organization by ID
 * @param id Organization ID
 * @returns Promise with organization details
 */
export const getOrganizationByIdApi = (id: string): Promise<OrganizationResourceResponse> => {
  return request.get({
    url: `/organizations/${id}`
  })
}

/**
 * Update an organization
 * @param id Organization ID
 * @param data Organization update data
 * @returns Promise with updated organization
 */
export const updateOrganizationApi = (
  id: string,
  data: UpdateOrganizationRequest
): Promise<OrganizationResourceResponse> => {
  return request.put({
    url: `/organizations/${id}`,
    data
  })
}

/**
 * Delete an organization
 * @param id Organization ID
 * @returns Promise with success response
 */
export const deleteOrganizationApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/organizations/${id}`
  })
}

/**
 * Get organization ancestors
 * @param id Organization ID
 * @returns Promise with ancestors
 */
export const getOrganizationAncestorsApi = (
  id: string
): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: `/organizations/${id}/ancestors`
  })
}

/**
 * Get organization children
 * @param id Organization ID
 * @returns Promise with children
 */
export const getOrganizationChildrenApi = (id: string): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: `/organizations/${id}/children`
  })
}

/**
 * Get organization descendants
 * @param id Organization ID
 * @returns Promise with descendants
 */
export const getOrganizationDescendantsApi = (
  id: string
): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: `/organizations/${id}/descendants`
  })
}

/**
 * Move organization in hierarchy
 * @param id Organization ID
 * @param data Move organization data
 * @returns Promise with success response
 */
export const moveOrganizationApi = (id: string, data: MoveOrganizationRequest): Promise<any> => {
  return request.put({
    url: `/organizations/${id}/move`,
    data
  })
}

/**
 * Get organization path
 * @param id Organization ID
 * @returns Promise with organization path
 */
export const getOrganizationPathApi = (id: string): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: `/organizations/${id}/path`
  })
}

/**
 * Get organization siblings
 * @param id Organization ID
 * @returns Promise with siblings
 */
export const getOrganizationSiblingsApi = (id: string): Promise<OrganizationCollectionResponse> => {
  return request.get({
    url: `/organizations/${id}/siblings`
  })
}

/**
 * Get organization statistics
 * @param id Organization ID
 * @returns Promise with organization stats
 */
export const getOrganizationStatsApi = (id: string): Promise<OrganizationStatsResponse> => {
  return request.get({
    url: `/organizations/${id}/stats`
  })
}

/**
 * Get organization status
 * @param id Organization ID
 * @returns Promise with organization status
 */
export const getOrganizationStatusApi = (id: string): Promise<any> => {
  return request.get({
    url: `/organizations/${id}/status`
  })
}

/**
 * Get organization subtree
 * @param id Organization ID
 * @returns Promise with organization subtree
 */
export const getOrganizationSubtreeApi = (id: string): Promise<OrganizationTreeResponse> => {
  return request.get({
    url: `/organizations/${id}/subtree`
  })
}
