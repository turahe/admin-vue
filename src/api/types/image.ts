/**
 * Image Types and Interfaces
 * Media and image management types
 */

import type { BaseEntity, BaseUpdateRequest, BaseFilters } from './base'

// ===== Image Types =====
export interface Image extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  url: string
  thumbnailUrl?: string
  alt?: string
  description?: string
  folder?: string
  tags: string[]
  userId: number
  isPublic: boolean
}

export interface ImageUploadRequest {
  file: File
  alt?: string
  description?: string
  folder?: string
  tags?: string[]
  isPublic?: boolean
}

export interface ImageUpdateRequest extends BaseUpdateRequest {
  alt?: string
  description?: string
  folder?: string
  tags?: string[]
  isPublic?: boolean
}

export interface ImageFilters extends BaseFilters {
  mimeType?: string
  folder?: string
  tag?: string
  isPublic?: boolean
  userId?: number
  sizeMin?: number
  sizeMax?: number
}

export interface ImageStats {
  total: number
  totalSize: number
  byMimeType: { [key: string]: number }
  byFolder: { [key: string]: number }
  publicImages: number
  privateImages: number
}
