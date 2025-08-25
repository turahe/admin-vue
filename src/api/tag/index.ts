import request from '@/axios'
import type {
  Tag,
  TagCreateRequest,
  TagUpdateRequest,
  TagFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  TagStats
} from '@/api/common/types'

// ===== Tag CRUD Operations =====

/**
 * Get paginated list of tags with optional filters
 */
export const getTagListApi = (params?: PaginationParams & TagFilters) => {
  return request.get<ListResponse<Tag>>({
    url: '/api/tags',
    params
  })
}

/**
 * Get all tags (no pagination)
 */
export const getAllTagsApi = (filters?: TagFilters) => {
  return request.get<ApiResponse<Tag[]>>({
    url: '/api/tags/all',
    params: filters
  })
}

/**
 * Get single tag by ID
 */
export const getTagByIdApi = (id: number) => {
  return request.get<ApiResponse<Tag>>({
    url: `/api/tags/${id}`
  })
}

/**
 * Get tag by slug
 */
export const getTagBySlugApi = (slug: string) => {
  return request.get<ApiResponse<Tag>>({
    url: `/api/tags/slug/${slug}`
  })
}

/**
 * Create new tag
 */
export const createTagApi = (data: TagCreateRequest) => {
  return request.post<ApiResponse<Tag>>({
    url: '/api/tags',
    data
  })
}

/**
 * Update existing tag
 */
export const updateTagApi = (id: number, data: TagUpdateRequest) => {
  return request.put<ApiResponse<Tag>>({
    url: `/api/tags/${id}`,
    data
  })
}

/**
 * Delete tag by ID
 */
export const deleteTagApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/tags/${id}`
  })
}

/**
 * Bulk delete tags
 */
export const bulkDeleteTagsApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/tags/bulk',
    data
  })
}

/**
 * Bulk update tags
 */
export const bulkUpdateTagsApi = (data: BulkUpdateRequest<TagUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/tags/bulk',
    data
  })
}

/**
 * Toggle tag status
 */
export const toggleTagStatusApi = (id: number) => {
  return request.patch<ApiResponse<Tag>>({
    url: `/api/tags/${id}/toggle-status`
  })
}

/**
 * Get tag statistics
 */
export const getTagStatsApi = () => {
  return request.get<ApiResponse<TagStats>>({
    url: '/api/tags/stats'
  })
}

/**
 * Validate tag slug uniqueness
 */
export const validateTagSlugApi = (slug: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/tags/validate-slug',
    params: { slug, excludeId }
  })
}

/**
 * Generate tag slug from name
 */
export const generateTagSlugApi = (name: string) => {
  return request.get<ApiResponse<{ slug: string }>>({
    url: '/api/tags/generate-slug',
    params: { name }
  })
}

/**
 * Get tag posts
 */
export const getTagPostsApi = (id: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/tags/${id}/posts`,
    params
  })
}

/**
 * Get popular tags (most used)
 */
export const getPopularTagsApi = (limit = 20) => {
  return request.get<ApiResponse<Tag[]>>({
    url: '/api/tags/popular',
    params: { limit }
  })
}

/**
 * Get trending tags (recently popular)
 */
export const getTrendingTagsApi = (days = 30, limit = 10) => {
  return request.get<ApiResponse<Tag[]>>({
    url: '/api/tags/trending',
    params: { days, limit }
  })
}

/**
 * Search tags
 */
export const searchTagsApi = (query: string, params?: PaginationParams) => {
  return request.get<ListResponse<Tag>>({
    url: '/api/tags/search',
    params: { query, ...params }
  })
}

/**
 * Get tag cloud data
 */
export const getTagCloudApi = (limit = 50) => {
  return request.get<ApiResponse<Array<Tag & { weight: number }>>>({
    url: '/api/tags/cloud',
    params: { limit }
  })
}

/**
 * Get related tags
 */
export const getRelatedTagsApi = (tagId: number, limit = 10) => {
  return request.get<ApiResponse<Tag[]>>({
    url: `/api/tags/${tagId}/related`,
    params: { limit }
  })
}

/**
 * Merge tags (combine multiple tags into one)
 */
export const mergeTagsApi = (targetTagId: number, sourceTagIds: number[]) => {
  return request.post<ApiResponse<Tag>>({
    url: `/api/tags/${targetTagId}/merge`,
    data: { sourceTagIds }
  })
}

/**
 * Get tag colors palette
 */
export const getTagColorsApi = () => {
  return request.get<ApiResponse<string[]>>({
    url: '/api/tags/colors'
  })
}
