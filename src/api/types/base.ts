/**
 * Base Types and Interfaces
 * Core types used across all API modules
 */

// ===== Base Entity Types =====
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

export interface BaseCreateRequest {
  // Common fields for creation - extend in specific types
  metadata?: Record<string, any>
}

export interface BaseUpdateRequest {
  id: number
  // Common fields for updates - extend in specific types
  metadata?: Record<string, any>
}

// ===== Pagination Types =====
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ===== Filter Types =====
export interface BaseFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
}

// ===== Response Types =====
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export type ListResponse<T> = ApiResponse<PaginationResponse<T>>

// ===== Bulk Operations =====
export interface BulkDeleteRequest {
  ids: number[]
}

export interface BulkUpdateRequest<T> {
  ids: number[]
  data: Partial<T>
}

export interface BulkResponse {
  success: number
  failed: number
  errors?: { id: number; error: string }[]
}
