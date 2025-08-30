import request from '@/axios'
import type {
  Media,
  CreateMediaRequest,
  UpdateMediaRequest,
  MediaCollectionResponse,
  MediaResourceResponse
} from './types'

/**
 * Media API endpoints
 * Based on swagger specification for media management
 */

/**
 * Get all media files with pagination and search
 * @param limit Number of media items to return (default: 10, max: 100)
 * @param offset Number of media items to skip (default: 0)
 * @param query Search query to filter media by name or filename
 * @returns Promise with media collection
 */
export const getMediaApi = (
  limit: number = 10,
  offset: number = 0,
  query?: string
): Promise<MediaCollectionResponse> => {
  return request.get({
    url: '/media',
    params: { limit, offset, query }
  })
}

/**
 * Upload a new media file
 * @param file Media file to upload
 * @param name Custom name for the media file
 * @param description Description of the media file
 * @returns Promise with created media
 */
export const uploadMediaApi = (
  file: File,
  name?: string,
  description?: string
): Promise<MediaResourceResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (name) formData.append('name', name)
  if (description) formData.append('description', description)

  return request.post({
    url: '/media',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * Get media by ID
 * @param id Media ID
 * @returns Promise with media details
 */
export const getMediaByIdApi = (id: string): Promise<MediaResourceResponse> => {
  return request.get({
    url: `/media/${id}`
  })
}

/**
 * Update media file metadata
 * @param id Media ID
 * @param data Media update data
 * @returns Promise with updated media
 */
export const updateMediaApi = (
  id: string,
  data: UpdateMediaRequest
): Promise<MediaResourceResponse> => {
  return request.put({
    url: `/media/${id}`,
    data
  })
}

/**
 * Delete a media file
 * @param id Media ID
 * @returns Promise with success response
 */
export const deleteMediaApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/media/${id}`
  })
}
