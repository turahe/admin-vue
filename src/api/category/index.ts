import request from '@/axios'
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  CategoryStats
} from '@/api/common/types'

// ===== Category CRUD Operations =====

/**
 * Get paginated list of categories with optional filters
 */
export const getCategoryListApi = (params?: PaginationParams & CategoryFilters) => {
  return request.get<ListResponse<Category>>({
    url: '/api/categories',
    params
  })
}

/**
 * Get category tree structure (hierarchical)
 */
export const getCategoryTreeApi = (filters?: CategoryFilters) => {
  return request.get<ApiResponse<Category[]>>({
    url: '/api/categories/tree',
    params: filters
  })
}

/**
 * Get all categories (no pagination)
 */
export const getAllCategoriesApi = (filters?: CategoryFilters) => {
  return request.get<ApiResponse<Category[]>>({
    url: '/api/categories/all',
    params: filters
  })
}

/**
 * Get single category by ID
 */
export const getCategoryByIdApi = (id: number) => {
  return request.get<ApiResponse<Category>>({
    url: `/api/categories/${id}`
  })
}

/**
 * Get category by slug
 */
export const getCategoryBySlugApi = (slug: string) => {
  return request.get<ApiResponse<Category>>({
    url: `/api/categories/slug/${slug}`
  })
}

/**
 * Create new category
 */
export const createCategoryApi = (data: CategoryCreateRequest) => {
  return request.post<ApiResponse<Category>>({
    url: '/api/categories',
    data
  })
}

/**
 * Update existing category
 */
export const updateCategoryApi = (id: number, data: CategoryUpdateRequest) => {
  return request.put<ApiResponse<Category>>({
    url: `/api/categories/${id}`,
    data
  })
}

/**
 * Delete category by ID
 */
export const deleteCategoryApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/categories/${id}`
  })
}

/**
 * Bulk delete categories
 */
export const bulkDeleteCategoriesApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/categories/bulk',
    data
  })
}

/**
 * Bulk update categories
 */
export const bulkUpdateCategoriesApi = (data: BulkUpdateRequest<CategoryUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/categories/bulk',
    data
  })
}

/**
 * Toggle category status
 */
export const toggleCategoryStatusApi = (id: number) => {
  return request.patch<ApiResponse<Category>>({
    url: `/api/categories/${id}/toggle-status`
  })
}

/**
 * Update category sort order
 */
export const updateCategorySortApi = (data: { id: number; sort: number }[]) => {
  return request.put<ApiResponse<void>>({
    url: '/api/categories/sort',
    data
  })
}

/**
 * Move category to different parent
 */
export const moveCategoryApi = (id: number, parentId: number | null) => {
  return request.patch<ApiResponse<Category>>({
    url: `/api/categories/${id}/move`,
    data: { parentId }
  })
}

/**
 * Get category statistics
 */
export const getCategoryStatsApi = () => {
  return request.get<ApiResponse<CategoryStats>>({
    url: '/api/categories/stats'
  })
}

/**
 * Validate category slug uniqueness
 */
export const validateCategorySlugApi = (slug: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/categories/validate-slug',
    params: { slug, excludeId }
  })
}

/**
 * Generate category slug from name
 */
export const generateCategorySlugApi = (name: string) => {
  return request.get<ApiResponse<{ slug: string }>>({
    url: '/api/categories/generate-slug',
    params: { name }
  })
}

/**
 * Get category posts
 */
export const getCategoryPostsApi = (id: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/categories/${id}/posts`,
    params
  })
}

/**
 * Get category breadcrumb
 */
export const getCategoryBreadcrumbApi = (id: number) => {
  return request.get<ApiResponse<Category[]>>({
    url: `/api/categories/${id}/breadcrumb`
  })
}

/**
 * Get popular categories (most posts)
 */
export const getPopularCategoriesApi = (limit = 10) => {
  return request.get<ApiResponse<Category[]>>({
    url: '/api/categories/popular',
    params: { limit }
  })
}

/**
 * Search categories
 */
export const searchCategoriesApi = (query: string, params?: PaginationParams) => {
  return request.get<ListResponse<Category>>({
    url: '/api/categories/search',
    params: { query, ...params }
  })
}
