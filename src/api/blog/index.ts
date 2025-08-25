import request from '@/axios'
import type {
  Blog,
  BlogCreateRequest,
  BlogUpdateRequest,
  BlogFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  BlogStats
} from '@/api/common/types'

// ===== Blog CRUD Operations =====

/**
 * Get paginated list of blogs with optional filters
 */
export const getBlogListApi = (params?: PaginationParams & BlogFilters) => {
  return request.get<ListResponse<Blog>>({
    url: '/api/blogs',
    params
  })
}

/**
 * Get published blogs only
 */
export const getPublishedBlogsApi = (params?: PaginationParams & Omit<BlogFilters, 'status'>) => {
  return request.get<ListResponse<Blog>>({
    url: '/api/blogs/published',
    params
  })
}

/**
 * Get single blog by ID
 */
export const getBlogByIdApi = (id: number) => {
  return request.get<ApiResponse<Blog>>({
    url: `/api/blogs/${id}`
  })
}

/**
 * Get blog by slug
 */
export const getBlogBySlugApi = (slug: string) => {
  return request.get<ApiResponse<Blog>>({
    url: `/api/blogs/slug/${slug}`
  })
}

/**
 * Create new blog
 */
export const createBlogApi = (data: BlogCreateRequest) => {
  return request.post<ApiResponse<Blog>>({
    url: '/api/blogs',
    data
  })
}

/**
 * Update existing blog
 */
export const updateBlogApi = (id: number, data: BlogUpdateRequest) => {
  return request.put<ApiResponse<Blog>>({
    url: `/api/blogs/${id}`,
    data
  })
}

/**
 * Delete blog by ID
 */
export const deleteBlogApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/blogs/${id}`
  })
}

/**
 * Bulk delete blogs
 */
export const bulkDeleteBlogsApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/blogs/bulk',
    data
  })
}

/**
 * Bulk update blogs
 */
export const bulkUpdateBlogsApi = (data: BulkUpdateRequest<BlogUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/blogs/bulk',
    data
  })
}

/**
 * Publish blog
 */
export const publishBlogApi = (id: number, publishedAt?: string) => {
  return request.patch<ApiResponse<Blog>>({
    url: `/api/blogs/${id}/publish`,
    data: { publishedAt }
  })
}

/**
 * Unpublish blog (set to draft)
 */
export const unpublishBlogApi = (id: number) => {
  return request.patch<ApiResponse<Blog>>({
    url: `/api/blogs/${id}/unpublish`
  })
}

/**
 * Archive blog
 */
export const archiveBlogApi = (id: number) => {
  return request.patch<ApiResponse<Blog>>({
    url: `/api/blogs/${id}/archive`
  })
}

/**
 * Schedule blog publication
 */
export const scheduleBlogApi = (id: number, publishedAt: string) => {
  return request.patch<ApiResponse<Blog>>({
    url: `/api/blogs/${id}/schedule`,
    data: { publishedAt }
  })
}

/**
 * Duplicate blog
 */
export const duplicateBlogApi = (id: number) => {
  return request.post<ApiResponse<Blog>>({
    url: `/api/blogs/${id}/duplicate`
  })
}

/**
 * Get blog statistics
 */
export const getBlogStatsApi = () => {
  return request.get<ApiResponse<BlogStats>>({
    url: '/api/blogs/stats'
  })
}

/**
 * Validate blog slug uniqueness
 */
export const validateBlogSlugApi = (slug: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/blogs/validate-slug',
    params: { slug, excludeId }
  })
}

/**
 * Generate blog slug from title
 */
export const generateBlogSlugApi = (title: string) => {
  return request.get<ApiResponse<{ slug: string }>>({
    url: '/api/blogs/generate-slug',
    params: { title }
  })
}

/**
 * Search blogs
 */
export const searchBlogsApi = (query: string, params?: PaginationParams) => {
  return request.get<ListResponse<Blog>>({
    url: '/api/blogs/search',
    params: { query, ...params }
  })
}

/**
 * Get related blogs
 */
export const getRelatedBlogsApi = (blogId: number, limit = 5) => {
  return request.get<ApiResponse<Blog[]>>({
    url: `/api/blogs/${blogId}/related`,
    params: { limit }
  })
}

/**
 * Get popular blogs
 */
export const getPopularBlogsApi = (days = 30, limit = 10) => {
  return request.get<ApiResponse<Blog[]>>({
    url: '/api/blogs/popular',
    params: { days, limit }
  })
}

/**
 * Get featured blogs
 */
export const getFeaturedBlogsApi = (limit = 5) => {
  return request.get<ApiResponse<Blog[]>>({
    url: '/api/blogs/featured',
    params: { limit }
  })
}

/**
 * Get latest blogs
 */
export const getLatestBlogsApi = (limit = 10) => {
  return request.get<ApiResponse<Blog[]>>({
    url: '/api/blogs/latest',
    params: { limit }
  })
}

/**
 * Get blogs by author
 */
export const getBlogsByAuthorApi = (authorId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Blog>>({
    url: `/api/blogs/by-author/${authorId}`,
    params
  })
}

/**
 * Get blogs by category
 */
export const getBlogsByCategoryApi = (categoryId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Blog>>({
    url: `/api/blogs/by-category/${categoryId}`,
    params
  })
}

/**
 * Get blogs by tag
 */
export const getBlogsByTagApi = (tagId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Blog>>({
    url: `/api/blogs/by-tag/${tagId}`,
    params
  })
}

/**
 * Like blog
 */
export const likeBlogApi = (id: number) => {
  return request.post<ApiResponse<{ likesCount: number }>>({
    url: `/api/blogs/${id}/like`
  })
}

/**
 * Unlike blog
 */
export const unlikeBlogApi = (id: number) => {
  return request.delete<ApiResponse<{ likesCount: number }>>({
    url: `/api/blogs/${id}/like`
  })
}

/**
 * Increment blog views
 */
export const incrementBlogViewsApi = (id: number) => {
  return request.post<ApiResponse<{ viewsCount: number }>>({
    url: `/api/blogs/${id}/view`
  })
}

/**
 * Get blog reading time
 */
export const calculateReadingTimeApi = (content: string) => {
  return request.post<ApiResponse<{ readingTime: number }>>({
    url: '/api/blogs/reading-time',
    data: { content }
  })
}

/**
 * Get blog SEO analysis
 */
export const analyzeBlogSEOApi = (
  data: Pick<BlogCreateRequest, 'title' | 'content' | 'excerpt' | 'seoTitle' | 'seoDescription'>
) => {
  return request.post<
    ApiResponse<{
      score: number
      suggestions: string[]
      keywords: string[]
    }>
  >({
    url: '/api/blogs/seo-analysis',
    data
  })
}

/**
 * Export blogs to different formats
 */
export const exportBlogsApi = (format: 'csv' | 'xlsx' | 'json', filters?: BlogFilters) => {
  return request.get<Blob>({
    url: '/api/blogs/export',
    params: { format, ...filters },
    responseType: 'blob'
  })
}

/**
 * Get blog archive (by year/month)
 */
export const getBlogArchiveApi = () => {
  return request.get<
    ApiResponse<
      {
        year: number
        month: number
        count: number
      }[]
    >
  >({
    url: '/api/blogs/archive'
  })
}
