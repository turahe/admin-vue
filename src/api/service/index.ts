import request from '@/axios'
import type {
  Service,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ServiceFilters,
  ServiceFeature,
  ServicePackage,
  ServiceAvailability,
  ServiceLocation,
  ServiceStaff,
  TimeSlot,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  ServiceStats
} from '@/api/common/types'

// ===== Service CRUD Operations =====

/**
 * Get paginated list of services with optional filters
 */
export const getServiceListApi = (params?: PaginationParams & ServiceFilters) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services',
    params
  })
}

/**
 * Get active services only
 */
export const getActiveServicesApi = (
  params?: PaginationParams & Omit<ServiceFilters, 'status'>
) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services/active',
    params
  })
}

/**
 * Get available services (with availability check)
 */
export const getAvailableServicesApi = (date?: string, params?: PaginationParams) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services/available',
    params: { date, ...params }
  })
}

/**
 * Get featured services
 */
export const getFeaturedServicesApi = (limit = 10) => {
  return request.get<ApiResponse<Service[]>>({
    url: '/api/services/featured',
    params: { limit }
  })
}

/**
 * Get single service by ID
 */
export const getServiceByIdApi = (id: number) => {
  return request.get<ApiResponse<Service>>({
    url: `/api/services/${id}`
  })
}

/**
 * Get service by slug
 */
export const getServiceBySlugApi = (slug: string) => {
  return request.get<ApiResponse<Service>>({
    url: `/api/services/slug/${slug}`
  })
}

/**
 * Get service by service code
 */
export const getServiceByCodeApi = (serviceCode: string) => {
  return request.get<ApiResponse<Service>>({
    url: `/api/services/code/${serviceCode}`
  })
}

/**
 * Create new service
 */
export const createServiceApi = (data: ServiceCreateRequest) => {
  return request.post<ApiResponse<Service>>({
    url: '/api/services',
    data
  })
}

/**
 * Update existing service
 */
export const updateServiceApi = (id: number, data: ServiceUpdateRequest) => {
  return request.put<ApiResponse<Service>>({
    url: `/api/services/${id}`,
    data
  })
}

/**
 * Delete service by ID
 */
export const deleteServiceApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/services/${id}`
  })
}

/**
 * Bulk delete services
 */
export const bulkDeleteServicesApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/services/bulk',
    data
  })
}

/**
 * Bulk update services
 */
export const bulkUpdateServicesApi = (data: BulkUpdateRequest<ServiceUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/services/bulk',
    data
  })
}

/**
 * Toggle service status
 */
export const toggleServiceStatusApi = (id: number) => {
  return request.patch<ApiResponse<Service>>({
    url: `/api/services/${id}/toggle-status`
  })
}

/**
 * Toggle service featured status
 */
export const toggleServiceFeaturedApi = (id: number) => {
  return request.patch<ApiResponse<Service>>({
    url: `/api/services/${id}/toggle-featured`
  })
}

/**
 * Toggle service availability
 */
export const toggleServiceAvailabilityApi = (id: number) => {
  return request.patch<ApiResponse<Service>>({
    url: `/api/services/${id}/toggle-availability`
  })
}

/**
 * Duplicate service
 */
export const duplicateServiceApi = (id: number) => {
  return request.post<ApiResponse<Service>>({
    url: `/api/services/${id}/duplicate`
  })
}

// ===== Service Availability Management =====

/**
 * Update service availability
 */
export const updateServiceAvailabilityApi = (id: number, availability: ServiceAvailability) => {
  return request.put<ApiResponse<ServiceAvailability>>({
    url: `/api/services/${id}/availability`,
    data: availability
  })
}

/**
 * Get service availability for date range
 */
export const getServiceAvailabilityApi = (id: number, startDate: string, endDate: string) => {
  return request.get<
    ApiResponse<{
      available: boolean
      timeSlots: Array<TimeSlot & { available: boolean; bookings: number }>
      holidays: string[]
    }>
  >({
    url: `/api/services/${id}/availability/range`,
    params: { startDate, endDate }
  })
}

/**
 * Check service availability for specific date/time
 */
export const checkServiceAvailabilityApi = (id: number, date: string, time?: string) => {
  return request.get<
    ApiResponse<{
      available: boolean
      reason?: string
      alternativeSlots?: TimeSlot[]
    }>
  >({
    url: `/api/services/${id}/availability/check`,
    params: { date, time }
  })
}

/**
 * Get service time slots for date
 */
export const getServiceTimeSlotsApi = (id: number, date: string) => {
  return request.get<ApiResponse<Array<TimeSlot & { available: boolean; bookings: number }>>>({
    url: `/api/services/${id}/time-slots`,
    params: { date }
  })
}

// ===== Service Features Management =====

/**
 * Get service features
 */
export const getServiceFeaturesApi = (serviceId: number) => {
  return request.get<ApiResponse<ServiceFeature[]>>({
    url: `/api/services/${serviceId}/features`
  })
}

/**
 * Update service features
 */
export const updateServiceFeaturesApi = (serviceId: number, features: ServiceFeature[]) => {
  return request.put<ApiResponse<ServiceFeature[]>>({
    url: `/api/services/${serviceId}/features`,
    data: { features }
  })
}

// ===== Service Packages Management =====

/**
 * Get service packages
 */
export const getServicePackagesApi = (serviceId: number) => {
  return request.get<ApiResponse<ServicePackage[]>>({
    url: `/api/services/${serviceId}/packages`
  })
}

/**
 * Create service package
 */
export const createServicePackageApi = (
  serviceId: number,
  packageData: Omit<ServicePackage, 'id'>
) => {
  return request.post<ApiResponse<ServicePackage>>({
    url: `/api/services/${serviceId}/packages`,
    data: packageData
  })
}

/**
 * Update service package
 */
export const updateServicePackageApi = (
  serviceId: number,
  packageId: number,
  packageData: Partial<ServicePackage>
) => {
  return request.put<ApiResponse<ServicePackage>>({
    url: `/api/services/${serviceId}/packages/${packageId}`,
    data: packageData
  })
}

/**
 * Delete service package
 */
export const deleteServicePackageApi = (serviceId: number, packageId: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/services/${serviceId}/packages/${packageId}`
  })
}

// ===== Service Staff Management =====

/**
 * Get service staff
 */
export const getServiceStaffApi = (serviceId: number) => {
  return request.get<ApiResponse<ServiceStaff[]>>({
    url: `/api/services/${serviceId}/staff`
  })
}

/**
 * Assign staff to service
 */
export const assignServiceStaffApi = (serviceId: number, staffIds: number[]) => {
  return request.post<ApiResponse<void>>({
    url: `/api/services/${serviceId}/staff`,
    data: { staffIds }
  })
}

/**
 * Remove staff from service
 */
export const removeServiceStaffApi = (serviceId: number, staffIds: number[]) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/services/${serviceId}/staff`,
    data: { staffIds }
  })
}

/**
 * Get staff availability for service
 */
export const getStaffAvailabilityApi = (serviceId: number, staffId: number, date: string) => {
  return request.get<
    ApiResponse<{
      available: boolean
      timeSlots: Array<TimeSlot & { available: boolean; bookings: number }>
    }>
  >({
    url: `/api/services/${serviceId}/staff/${staffId}/availability`,
    params: { date }
  })
}

// ===== Service Search & Discovery =====

/**
 * Search services
 */
export const searchServicesApi = (query: string, params?: PaginationParams & ServiceFilters) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services/search',
    params: { query, ...params }
  })
}

/**
 * Get related services
 */
export const getRelatedServicesApi = (serviceId: number, limit = 6) => {
  return request.get<ApiResponse<Service[]>>({
    url: `/api/services/${serviceId}/related`,
    params: { limit }
  })
}

/**
 * Get services by category
 */
export const getServicesByCategoryApi = (categoryId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Service>>({
    url: `/api/services/by-category/${categoryId}`,
    params
  })
}

/**
 * Get services by tag
 */
export const getServicesByTagApi = (tagId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Service>>({
    url: `/api/services/by-tag/${tagId}`,
    params
  })
}

/**
 * Get services by location
 */
export const getServicesByLocationApi = (
  location: string,
  radius?: number,
  params?: PaginationParams
) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services/by-location',
    params: { location, radius, ...params }
  })
}

/**
 * Get online services
 */
export const getOnlineServicesApi = (params?: PaginationParams) => {
  return request.get<ListResponse<Service>>({
    url: '/api/services/online',
    params
  })
}

/**
 * Get most popular services
 */
export const getPopularServicesApi = (days = 30, limit = 10) => {
  return request.get<ApiResponse<Service[]>>({
    url: '/api/services/popular',
    params: { days, limit }
  })
}

/**
 * Get newest services
 */
export const getNewestServicesApi = (limit = 10) => {
  return request.get<ApiResponse<Service[]>>({
    url: '/api/services/newest',
    params: { limit }
  })
}

// ===== Service Pricing & Booking =====

/**
 * Update service pricing
 */
export const updateServicePricingApi = (
  id: number,
  pricing: {
    price: number
    priceType: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'custom'
  }
) => {
  return request.patch<ApiResponse<Service>>({
    url: `/api/services/${id}/pricing`,
    data: pricing
  })
}

/**
 * Calculate service price
 */
export const calculateServicePriceApi = (
  id: number,
  options: {
    packageId?: number
    duration?: number
    startDate?: string
    endDate?: string
    extras?: string[]
  }
) => {
  return request.post<
    ApiResponse<{
      basePrice: number
      totalPrice: number
      discount?: number
      tax?: number
      breakdown: Array<{ item: string; price: number }>
    }>
  >({
    url: `/api/services/${id}/calculate-price`,
    data: options
  })
}

/**
 * Get service bookings
 */
export const getServiceBookingsApi = (serviceId: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/services/${serviceId}/bookings`,
    params
  })
}

// ===== Service Analytics & Statistics =====

/**
 * Get service statistics
 */
export const getServiceStatsApi = () => {
  return request.get<ApiResponse<ServiceStats>>({
    url: '/api/services/stats'
  })
}

/**
 * Increment service views
 */
export const incrementServiceViewsApi = (id: number) => {
  return request.post<ApiResponse<{ viewsCount: number }>>({
    url: `/api/services/${id}/view`
  })
}

/**
 * Get service performance
 */
export const getServicePerformanceApi = (id: number, days = 30) => {
  return request.get<
    ApiResponse<{
      views: number
      bookings: number
      revenue: number
      conversionRate: number
      avgRating: number
      timeline: Array<{ date: string; views: number; bookings: number }>
    }>
  >({
    url: `/api/services/${id}/performance`,
    params: { days }
  })
}

// ===== Service Validation & Utilities =====

/**
 * Validate service code uniqueness
 */
export const validateServiceCodeApi = (serviceCode: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/services/validate-code',
    params: { serviceCode, excludeId }
  })
}

/**
 * Validate service slug uniqueness
 */
export const validateServiceSlugApi = (slug: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/services/validate-slug',
    params: { slug, excludeId }
  })
}

/**
 * Generate service slug from name
 */
export const generateServiceSlugApi = (name: string) => {
  return request.get<ApiResponse<{ slug: string }>>({
    url: '/api/services/generate-slug',
    params: { name }
  })
}

/**
 * Generate service code
 */
export const generateServiceCodeApi = (categoryId?: number, name?: string) => {
  return request.get<ApiResponse<{ serviceCode: string }>>({
    url: '/api/services/generate-code',
    params: { categoryId, name }
  })
}

// ===== Service Import & Export =====

/**
 * Export services to different formats
 */
export const exportServicesApi = (format: 'csv' | 'xlsx' | 'json', filters?: ServiceFilters) => {
  return request.get<Blob>({
    url: '/api/services/export',
    params: { format, ...filters },
    responseType: 'blob'
  })
}

/**
 * Import services from file
 */
export const importServicesApi = (
  file: File,
  options?: {
    skipDuplicates?: boolean
    updateExisting?: boolean
    validateOnly?: boolean
  }
) => {
  const formData = new FormData()
  formData.append('file', file)
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
  }

  return request.post<
    ApiResponse<{
      imported: number
      updated: number
      skipped: number
      errors: Array<{ row: number; message: string }>
    }>
  >({
    url: '/api/services/import',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ===== Service Reviews & Ratings =====

/**
 * Get service reviews
 */
export const getServiceReviewsApi = (serviceId: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/services/${serviceId}/reviews`,
    params
  })
}

/**
 * Update service rating
 */
export const updateServiceRatingApi = (id: number) => {
  return request.patch<ApiResponse<{ rating: number; reviewsCount: number }>>({
    url: `/api/services/${id}/rating`
  })
}

// ===== Service Locations & Coverage =====

/**
 * Get service locations
 */
export const getServiceLocationsApi = () => {
  return request.get<ApiResponse<Array<ServiceLocation & { servicesCount: number }>>>({
    url: '/api/services/locations'
  })
}

/**
 * Check service coverage for location
 */
export const checkServiceCoverageApi = (
  serviceId: number,
  location:
    | {
        latitude: number
        longitude: number
      }
    | string
) => {
  return request.get<
    ApiResponse<{
      covered: boolean
      distance?: number
      travelTime?: number
      additionalCost?: number
    }>
  >({
    url: `/api/services/${serviceId}/coverage`,
    params: typeof location === 'string' ? { address: location } : location
  })
}
