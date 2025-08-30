/**
 * Media API Types
 * Based on swagger specification for media management
 */

export interface Media {
  id: string
  name: string
  filename: string
  original_filename: string
  mime_type: string
  size: number
  path: string
  url: string
  description?: string
  alt_text?: string
  width?: number
  height?: number
  duration?: number
  created_at: string
  updated_at: string
}

export interface CreateMediaRequest {
  file: File
  name?: string
  description?: string
}

export interface UpdateMediaRequest {
  name?: string
  description?: string
  alt_text?: string
}

export interface MediaCollectionResponse {
  data: Media[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface MediaResourceResponse {
  data: Media
}
