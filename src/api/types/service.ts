/**
 * Service Types and Interfaces
 * Service business management types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'
import type { Category } from './category'
import type { Tag } from './tag'
import type { Image } from './image'
import type { ProductSEO } from './product'

// ===== Service Types =====
export interface Service extends BaseEntity {
  name: string
  slug: string
  description?: string
  shortDescription?: string
  serviceCode: string
  price: number
  priceType: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'custom'
  duration?: number
  durationType?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
  status: 'active' | 'inactive' | 'discontinued'
  categoryId?: number
  category?: Category
  tags: Tag[]
  images: Image[]
  featuredImage?: string
  gallery?: string[]
  features?: ServiceFeature[]
  packages?: ServicePackage[]
  availability?: ServiceAvailability
  booking?: ServiceBooking
  seo?: ProductSEO
  rating?: number
  reviewsCount: number
  bookingsCount: number
  viewsCount: number
  isFeatured: boolean
  isOnline: boolean
  location?: ServiceLocation
  staff?: ServiceStaff[]
  requirements?: string[]
  deliverables?: string[]
}

export interface ServiceFeature {
  id: number
  name: string
  description?: string
  included: boolean
  icon?: string
}

export interface ServicePackage {
  id: number
  name: string
  description?: string
  price: number
  duration?: number
  features: string[]
  isPopular: boolean
  maxClients?: number
}

export interface ServiceAvailability {
  isAvailable: boolean
  timeSlots?: TimeSlot[]
  holidays?: string[]
  advanceBooking?: number
  maxBookingsPerDay?: number
}

export interface TimeSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface ServiceBooking {
  requiresApproval: boolean
  cancellationPolicy?: string
  reschedulePolicy?: string
  depositRequired?: boolean
  depositAmount?: number
  cancellationFee?: number
}

export interface ServiceLocation {
  type: 'on_site' | 'client_location' | 'online' | 'hybrid'
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  serviceRadius?: number
}

export interface ServiceStaff {
  id: number
  name: string
  role: string
  bio?: string
  avatar?: string
  skills: string[]
  isLead: boolean
}

export interface ServiceCreateRequest extends BaseCreateRequest {
  name: string
  slug?: string
  description?: string
  shortDescription?: string
  serviceCode: string
  price: number
  priceType?: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'custom'
  duration?: number
  durationType?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
  status?: 'active' | 'inactive'
  categoryId?: number
  tagIds?: number[]
  imageIds?: number[]
  featuredImageId?: number
  features?: Omit<ServiceFeature, 'id'>[]
  packages?: Omit<ServicePackage, 'id'>[]
  availability?: ServiceAvailability
  booking?: ServiceBooking
  seo?: ProductSEO
  isFeatured?: boolean
  isOnline?: boolean
  location?: ServiceLocation
  staffIds?: number[]
  requirements?: string[]
  deliverables?: string[]
}

export interface ServiceUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  shortDescription?: string
  serviceCode?: string
  price?: number
  priceType?: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'custom'
  duration?: number
  durationType?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
  status?: 'active' | 'inactive' | 'discontinued'
  categoryId?: number
  tagIds?: number[]
  imageIds?: number[]
  featuredImageId?: number
  features?: ServiceFeature[]
  packages?: ServicePackage[]
  availability?: ServiceAvailability
  booking?: ServiceBooking
  seo?: ProductSEO
  isFeatured?: boolean
  isOnline?: boolean
  location?: ServiceLocation
  staffIds?: number[]
  requirements?: string[]
  deliverables?: string[]
}

export interface ServiceFilters extends BaseFilters {
  status?: 'active' | 'inactive' | 'discontinued'
  categoryId?: number
  tagId?: number
  priceMin?: number
  priceMax?: number
  priceType?: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'custom'
  isAvailable?: boolean
  isFeatured?: boolean
  isOnline?: boolean
  location?: string
  rating?: number
  durationType?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
}

export interface ServiceStats {
  total: number
  active: number
  inactive: number
  discontinued: number
  available: number
  unavailable: number
  byType: { [key: string]: number }
  byCategory: { [key: string]: number }
  featured: number
  online: number
  totalBookings: number
  totalRevenue: number
  avgPrice: number
  avgRating: number
  avgDuration: number
  topBooked: Service[]
  recentlyAdded: Service[]
}
