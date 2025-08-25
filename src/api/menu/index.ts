import request from '@/axios'
import type {
  Menu,
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkResponse,
  MenuStats
} from '@/api/common/types'

// ===== Menu CRUD Operations =====

/**
 * Get paginated list of menus with optional filters
 */
export const getMenuListApi = (params?: PaginationParams & MenuFilters) => {
  return request.get<ListResponse<Menu>>({
    url: '/api/menus',
    params
  })
}

/**
 * Get menu tree structure (hierarchical)
 */
export const getMenuTreeApi = (filters?: MenuFilters) => {
  return request.get<ApiResponse<Menu[]>>({
    url: '/api/menus/tree',
    params: filters
  })
}

/**
 * Get single menu by ID
 */
export const getMenuByIdApi = (id: number) => {
  return request.get<ApiResponse<Menu>>({
    url: `/api/menus/${id}`
  })
}

/**
 * Create new menu
 */
export const createMenuApi = (data: MenuCreateRequest) => {
  return request.post<ApiResponse<Menu>>({
    url: '/api/menus',
    data
  })
}

/**
 * Update existing menu
 */
export const updateMenuApi = (id: number, data: MenuUpdateRequest) => {
  return request.put<ApiResponse<Menu>>({
    url: `/api/menus/${id}`,
    data
  })
}

/**
 * Delete menu by ID
 */
export const deleteMenuApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/menus/${id}`
  })
}

/**
 * Bulk delete menus
 */
export const bulkDeleteMenusApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/menus/bulk',
    data
  })
}

/**
 * Update menu sort order
 */
export const updateMenuSortApi = (data: { id: number; sort: number }[]) => {
  return request.put<ApiResponse<void>>({
    url: '/api/menus/sort',
    data
  })
}

/**
 * Toggle menu visibility
 */
export const toggleMenuVisibilityApi = (id: number) => {
  return request.patch<ApiResponse<Menu>>({
    url: `/api/menus/${id}/toggle-visibility`
  })
}

/**
 * Get menu statistics
 */
export const getMenuStatsApi = () => {
  return request.get<ApiResponse<MenuStats>>({
    url: '/api/menus/stats'
  })
}

/**
 * Validate menu path uniqueness
 */
export const validateMenuPathApi = (path: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/menus/validate-path',
    params: { path, excludeId }
  })
}

/**
 * Get menu permissions
 */
export const getMenuPermissionsApi = () => {
  return request.get<ApiResponse<string[]>>({
    url: '/api/menus/permissions'
  })
}
