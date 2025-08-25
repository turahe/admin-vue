import request from '@/axios'
import type {
  Image,
  ImageUploadRequest,
  ImageUpdateRequest,
  ImageFilters,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  ImageStats
} from '@/api/common/types'

// ===== Image CRUD Operations =====

/**
 * Get paginated list of images with optional filters
 */
export const getImageListApi = (params?: PaginationParams & ImageFilters) => {
  return request.get<ListResponse<Image>>({
    url: '/api/images',
    params
  })
}

/**
 * Get single image by ID
 */
export const getImageByIdApi = (id: number) => {
  return request.get<ApiResponse<Image>>({
    url: `/api/images/${id}`
  })
}

/**
 * Upload single image
 */
export const uploadImageApi = (data: ImageUploadRequest) => {
  const formData = new FormData()
  formData.append('file', data.file)

  if (data.alt) formData.append('alt', data.alt)
  if (data.description) formData.append('description', data.description)
  if (data.folder) formData.append('folder', data.folder)
  if (data.tags) formData.append('tags', JSON.stringify(data.tags))
  if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic))

  return request.post<ApiResponse<Image>>({
    url: '/api/images/upload',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * Upload multiple images
 */
export const uploadMultipleImagesApi = (
  files: File[],
  metadata?: Partial<Omit<ImageUploadRequest, 'file'>>
) => {
  const formData = new FormData()

  files.forEach((file, index) => {
    formData.append(`files`, file)
  })

  if (metadata?.folder) formData.append('folder', metadata.folder)
  if (metadata?.tags) formData.append('tags', JSON.stringify(metadata.tags))
  if (metadata?.isPublic !== undefined) formData.append('isPublic', String(metadata.isPublic))

  return request.post<ApiResponse<Image[]>>({
    url: '/api/images/upload-multiple',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * Update image metadata
 */
export const updateImageApi = (id: number, data: ImageUpdateRequest) => {
  return request.put<ApiResponse<Image>>({
    url: `/api/images/${id}`,
    data
  })
}

/**
 * Delete image by ID
 */
export const deleteImageApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/images/${id}`
  })
}

/**
 * Bulk delete images
 */
export const bulkDeleteImagesApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/images/bulk',
    data
  })
}

/**
 * Bulk update images
 */
export const bulkUpdateImagesApi = (data: BulkUpdateRequest<ImageUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/images/bulk',
    data
  })
}

/**
 * Move images to folder
 */
export const moveImagesToFolderApi = (imageIds: number[], folder: string) => {
  return request.patch<ApiResponse<BulkResponse>>({
    url: '/api/images/move',
    data: { imageIds, folder }
  })
}

/**
 * Toggle image visibility
 */
export const toggleImageVisibilityApi = (id: number) => {
  return request.patch<ApiResponse<Image>>({
    url: `/api/images/${id}/toggle-visibility`
  })
}

/**
 * Get image statistics
 */
export const getImageStatsApi = () => {
  return request.get<ApiResponse<ImageStats>>({
    url: '/api/images/stats'
  })
}

/**
 * Search images
 */
export const searchImagesApi = (query: string, params?: PaginationParams) => {
  return request.get<ListResponse<Image>>({
    url: '/api/images/search',
    params: { query, ...params }
  })
}

/**
 * Get images by folder
 */
export const getImagesByFolderApi = (folder: string, params?: PaginationParams) => {
  return request.get<ListResponse<Image>>({
    url: '/api/images/by-folder',
    params: { folder, ...params }
  })
}

/**
 * Get images by tag
 */
export const getImagesByTagApi = (tag: string, params?: PaginationParams) => {
  return request.get<ListResponse<Image>>({
    url: '/api/images/by-tag',
    params: { tag, ...params }
  })
}

/**
 * Get image folders
 */
export const getImageFoldersApi = () => {
  return request.get<ApiResponse<{ folder: string; count: number }[]>>({
    url: '/api/images/folders'
  })
}

/**
 * Get image tags
 */
export const getImageTagsApi = () => {
  return request.get<ApiResponse<{ tag: string; count: number }[]>>({
    url: '/api/images/tags'
  })
}

/**
 * Generate image variations (thumbnails, sizes)
 */
export const generateImageVariationsApi = (id: number, sizes: string[]) => {
  return request.post<ApiResponse<{ [size: string]: string }>>({
    url: `/api/images/${id}/variations`,
    data: { sizes }
  })
}

/**
 * Optimize image (compress, resize)
 */
export const optimizeImageApi = (
  id: number,
  options?: {
    quality?: number
    width?: number
    height?: number
    format?: 'jpeg' | 'png' | 'webp'
  }
) => {
  return request.post<ApiResponse<Image>>({
    url: `/api/images/${id}/optimize`,
    data: options
  })
}

/**
 * Get image URL with transformations
 */
export const getImageUrlApi = (
  id: number,
  transformations?: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpeg' | 'png' | 'webp'
    crop?: 'fill' | 'fit' | 'crop'
  }
) => {
  return request.get<ApiResponse<{ url: string }>>({
    url: `/api/images/${id}/url`,
    params: transformations
  })
}

/**
 * Duplicate image
 */
export const duplicateImageApi = (id: number) => {
  return request.post<ApiResponse<Image>>({
    url: `/api/images/${id}/duplicate`
  })
}

/**
 * Get image metadata (EXIF data)
 */
export const getImageMetadataApi = (id: number) => {
  return request.get<ApiResponse<{ [key: string]: any }>>({
    url: `/api/images/${id}/metadata`
  })
}

/**
 * Get image usage (where it's being used)
 */
export const getImageUsageApi = (id: number) => {
  return request.get<
    ApiResponse<{
      blogs: Array<{ id: number; title: string; url: string }>
      pages: Array<{ id: number; title: string; url: string }>
      total: number
    }>
  >({
    url: `/api/images/${id}/usage`
  })
}

/**
 * Convert image format
 */
export const convertImageFormatApi = (id: number, format: 'jpeg' | 'png' | 'webp') => {
  return request.post<ApiResponse<Image>>({
    url: `/api/images/${id}/convert`,
    data: { format }
  })
}

/**
 * Upload from URL
 */
export const uploadFromUrlApi = (
  url: string,
  metadata?: Partial<Omit<ImageUploadRequest, 'file'>>
) => {
  return request.post<ApiResponse<Image>>({
    url: '/api/images/upload-from-url',
    data: { url, ...metadata }
  })
}

/**
 * Get recent images
 */
export const getRecentImagesApi = (limit = 20) => {
  return request.get<ApiResponse<Image[]>>({
    url: '/api/images/recent',
    params: { limit }
  })
}

/**
 * Get popular images (most used)
 */
export const getPopularImagesApi = (limit = 20) => {
  return request.get<ApiResponse<Image[]>>({
    url: '/api/images/popular',
    params: { limit }
  })
}

/**
 * Export images metadata
 */
export const exportImagesApi = (format: 'csv' | 'xlsx' | 'json', filters?: ImageFilters) => {
  return request.get<Blob>({
    url: '/api/images/export',
    params: { format, ...filters },
    responseType: 'blob'
  })
}

/**
 * Clean up unused images
 */
export const cleanupUnusedImagesApi = (dryRun = true) => {
  return request.post<
    ApiResponse<{
      found: number
      deleted?: number
      freed?: number
      images: Image[]
    }>
  >({
    url: '/api/images/cleanup',
    data: { dryRun }
  })
}
