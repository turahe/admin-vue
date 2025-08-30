import request from '@/axios'
import type {
  Taxonomy,
  CreateTaxonomyRequest,
  UpdateTaxonomyRequest,
  TaxonomyCollectionResponse,
  TaxonomyResourceResponse,
  TaxonomySearchResponse
} from './types'

/**
 * Taxonomies API endpoints
 * Based on swagger specification for taxonomy management
 */

/**
 * Get all taxonomies with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with taxonomies collection
 */
export const getTaxonomiesApi = (
  limit: number = 10,
  offset: number = 0
): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: '/api/v1/taxonomies',
    params: { limit, offset }
  })
}

/**
 * Create a new taxonomy
 * @param data Taxonomy creation data
 * @returns Promise with created taxonomy
 */
export const createTaxonomyApi = (
  data: CreateTaxonomyRequest
): Promise<TaxonomyResourceResponse> => {
  return request.post({
    url: '/api/v1/taxonomies',
    data
  })
}

/**
 * Get taxonomy hierarchy tree
 * @returns Promise with taxonomy hierarchy
 */
export const getTaxonomyHierarchyApi = (): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: '/api/v1/taxonomies/hierarchy'
  })
}

/**
 * Get root taxonomies (taxonomies without parent)
 * @returns Promise with root taxonomies
 */
export const getRootTaxonomiesApi = (): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: '/api/v1/taxonomies/root'
  })
}

/**
 * Search taxonomies by name, slug, or description
 * @param query Search query
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with taxonomies collection
 */
export const searchTaxonomiesApi = (
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: '/api/v1/taxonomies/search',
    params: { q: query, limit, offset }
  })
}

/**
 * Search taxonomies with advanced pagination and sorting
 * @param query Search query
 * @param page Page number (default: 1)
 * @param perPage Items per page (default: 10, max: 100)
 * @param sortBy Sort field (default: record_left)
 * @param sortDesc Sort descending (default: false)
 * @returns Promise with taxonomy search response
 */
export const searchTaxonomiesAdvancedApi = (
  query?: string,
  page: number = 1,
  perPage: number = 10,
  sortBy: string = 'record_left',
  sortDesc: boolean = false
): Promise<TaxonomySearchResponse> => {
  return request.get({
    url: '/api/v1/taxonomies/search/advanced',
    params: { query, page, per_page: perPage, sort_by: sortBy, sort_desc: sortDesc }
  })
}

/**
 * Get taxonomy by slug
 * @param slug Taxonomy slug
 * @returns Promise with taxonomy details
 */
export const getTaxonomyBySlugApi = (slug: string): Promise<TaxonomyResourceResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/slug/${slug}`
  })
}

/**
 * Get taxonomy by ID
 * @param id Taxonomy ID
 * @returns Promise with taxonomy details
 */
export const getTaxonomyByIdApi = (id: string): Promise<TaxonomyResourceResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/${id}`
  })
}

/**
 * Update a taxonomy
 * @param id Taxonomy ID
 * @param data Taxonomy update data
 * @returns Promise with updated taxonomy
 */
export const updateTaxonomyApi = (
  id: string,
  data: UpdateTaxonomyRequest
): Promise<TaxonomyResourceResponse> => {
  return request.put({
    url: `/api/v1/taxonomies/${id}`,
    data
  })
}

/**
 * Delete a taxonomy
 * @param id Taxonomy ID
 * @returns Promise with success response
 */
export const deleteTaxonomyApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/api/v1/taxonomies/${id}`
  })
}

/**
 * Get taxonomy ancestors
 * @param id Taxonomy ID
 * @returns Promise with ancestors
 */
export const getTaxonomyAncestorsApi = (id: string): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/${id}/ancestors`
  })
}

/**
 * Get taxonomy children
 * @param id Taxonomy ID
 * @returns Promise with children
 */
export const getTaxonomyChildrenApi = (id: string): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/${id}/children`
  })
}

/**
 * Get taxonomy descendants
 * @param id Taxonomy ID
 * @returns Promise with descendants
 */
export const getTaxonomyDescendantsApi = (id: string): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/${id}/descendants`
  })
}

/**
 * Get taxonomy siblings
 * @param id Taxonomy ID
 * @returns Promise with siblings
 */
export const getTaxonomySiblingsApi = (id: string): Promise<TaxonomyCollectionResponse> => {
  return request.get({
    url: `/api/v1/taxonomies/${id}/siblings`
  })
}
