/**
 * Common API Types and Interfaces
 * Shared across all CRUD operations
 */

// ===== Base Types =====
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

// ===== Menu Types =====
export interface Menu extends BaseEntity {
  name: string
  path: string
  component?: string
  icon?: string
  parentId?: number
  sort: number
  visible: boolean
  permission?: string
  meta?: MenuMeta
  children?: Menu[]
}

export interface MenuMeta {
  title: string
  icon?: string
  noCache?: boolean
  breadcrumb?: boolean
  activeMenu?: string
}

export interface MenuCreateRequest {
  name: string
  path: string
  component?: string
  icon?: string
  parentId?: number
  sort?: number
  visible?: boolean
  permission?: string
  meta?: MenuMeta
}

export interface MenuUpdateRequest extends BaseUpdateRequest {
  name?: string
  path?: string
  component?: string
  icon?: string
  parentId?: number
  sort?: number
  visible?: boolean
  permission?: string
  meta?: MenuMeta
}

export interface MenuFilters extends BaseFilters {
  parentId?: number
  visible?: boolean
  permission?: string
  status?: 'active' | 'inactive'
}

// ===== Role Types =====
export interface Role extends BaseEntity {
  name: string
  key: string
  description?: string
  status: 'active' | 'inactive'
  permissions: Permission[]
  sort: number
}

export interface Permission extends BaseEntity {
  name: string
  key: string
  resource: string
  action: string
  description?: string
}

export interface RoleCreateRequest {
  name: string
  key: string
  description?: string
  status?: 'active' | 'inactive'
  permissionIds: number[]
  sort?: number
}

export interface RoleUpdateRequest extends BaseUpdateRequest {
  name?: string
  key?: string
  description?: string
  status?: 'active' | 'inactive'
  permissionIds?: number[]
  sort?: number
}

export interface RoleFilters extends BaseFilters {
  status?: 'active' | 'inactive'
  hasPermission?: string
}

// ===== Category Types =====
export interface Category extends BaseEntity {
  name: string
  slug: string
  description?: string
  parentId?: number
  image?: string
  sort: number
  status: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
  children?: Category[]
  postsCount?: number
}

export interface CategoryCreateRequest {
  name: string
  slug: string
  description?: string
  parentId?: number
  image?: string
  sort?: number
  status?: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
}

export interface CategoryUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  parentId?: number
  image?: string
  sort?: number
  status?: 'active' | 'inactive'
  seoTitle?: string
  seoDescription?: string
}

export interface CategoryFilters extends BaseFilters {
  parentId?: number
  hasChildren?: boolean
  status?: 'active' | 'inactive'
}

// ===== Tag Types =====
export interface Tag extends BaseEntity {
  name: string
  slug: string
  description?: string
  color?: string
  status: 'active' | 'inactive'
  postsCount?: number
}

export interface TagCreateRequest {
  name: string
  slug: string
  description?: string
  color?: string
  status?: 'active' | 'inactive'
}

export interface TagUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  color?: string
  status?: 'active' | 'inactive'
}

export interface TagFilters extends BaseFilters {
  color?: string
  status?: 'active' | 'inactive'
}

// ===== Blog Types =====
export interface Blog extends BaseEntity {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  authorId: number
  author?: Author
  categoryId?: number
  category?: Category
  tags: Tag[]
  seoTitle?: string
  seoDescription?: string
  viewsCount: number
  likesCount: number
  commentsCount: number
  readingTime?: number
}

export interface Author {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface BlogCreateRequest {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status?: 'draft' | 'published' | 'scheduled'
  publishedAt?: string
  categoryId?: number
  tagIds?: number[]
  seoTitle?: string
  seoDescription?: string
}

export interface BlogUpdateRequest extends BaseUpdateRequest {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  featuredImage?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  categoryId?: number
  tagIds?: number[]
  seoTitle?: string
  seoDescription?: string
}

export interface BlogFilters extends BaseFilters {
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  authorId?: number
  categoryId?: number
  tagId?: number
  featured?: boolean
}

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

// ===== Product Types =====
export interface Product extends BaseEntity {
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku: string
  barcode?: string
  price: number
  salePrice?: number
  costPrice?: number
  status: 'active' | 'inactive' | 'discontinued'
  type: 'physical' | 'digital' | 'service' | 'subscription'
  categoryId?: number
  category?: Category
  tags: Tag[]
  images: Image[]
  featuredImage?: string
  gallery?: string[]
  attributes?: ProductAttribute[]
  variants?: ProductVariant[]
  inventory?: ProductInventory
  seo?: ProductSEO
  shipping?: ProductShipping
  weight?: number
  dimensions?: ProductDimensions
  brand?: string
  manufacturer?: string
  warranty?: string
  rating?: number
  reviewsCount: number
  salesCount: number
  viewsCount: number
  isFeatured: boolean
  isDigital: boolean
  downloadable?: ProductDownload
}

export interface ProductAttribute {
  id: number
  name: string
  value: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean'
  options?: string[]
}

export interface ProductVariant {
  id: number
  name: string
  sku: string
  price: number
  salePrice?: number
  stock: number
  attributes: { [key: string]: string }
  image?: string
  isDefault: boolean
}

export interface ProductInventory {
  stock: number
  minStock: number
  maxStock?: number
  trackStock: boolean
  allowBackorder: boolean
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_backorder'
  reservedStock: number
  warehouseId?: number
}

export interface ProductSEO {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export interface ProductShipping {
  weight: number
  length?: number
  width?: number
  height?: number
  shippingClass?: string
  freeShipping: boolean
  separateShipping: boolean
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in' | 'm'
}

export interface ProductDownload {
  file: string
  downloadLimit?: number
  downloadExpiry?: number
  accessKey?: string
}

export interface ProductCreateRequest {
  name: string
  slug?: string
  description?: string
  shortDescription?: string
  sku: string
  barcode?: string
  price: number
  salePrice?: number
  costPrice?: number
  status?: 'active' | 'inactive'
  type?: 'physical' | 'digital' | 'service' | 'subscription'
  categoryId?: number
  tagIds?: number[]
  imageIds?: number[]
  featuredImageId?: number
  attributes?: Omit<ProductAttribute, 'id'>[]
  variants?: Omit<ProductVariant, 'id'>[]
  inventory?: ProductInventory
  seo?: ProductSEO
  shipping?: ProductShipping
  weight?: number
  dimensions?: ProductDimensions
  brand?: string
  manufacturer?: string
  warranty?: string
  isFeatured?: boolean
  isDigital?: boolean
  downloadable?: Omit<ProductDownload, 'accessKey'>
}

export interface ProductUpdateRequest extends BaseUpdateRequest {
  name?: string
  slug?: string
  description?: string
  shortDescription?: string
  sku?: string
  barcode?: string
  price?: number
  salePrice?: number
  costPrice?: number
  status?: 'active' | 'inactive' | 'discontinued'
  type?: 'physical' | 'digital' | 'service' | 'subscription'
  categoryId?: number
  tagIds?: number[]
  imageIds?: number[]
  featuredImageId?: number
  attributes?: ProductAttribute[]
  variants?: ProductVariant[]
  inventory?: ProductInventory
  seo?: ProductSEO
  shipping?: ProductShipping
  weight?: number
  dimensions?: ProductDimensions
  brand?: string
  manufacturer?: string
  warranty?: string
  isFeatured?: boolean
  isDigital?: boolean
  downloadable?: ProductDownload
}

export interface ProductFilters extends BaseFilters {
  status?: 'active' | 'inactive' | 'discontinued'
  type?: 'physical' | 'digital' | 'service' | 'subscription'
  categoryId?: number
  tagId?: number
  brand?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  isFeatured?: boolean
  isDigital?: boolean
  rating?: number
}

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

export interface ServiceCreateRequest {
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

// ===== Statistics Types =====
export interface MenuStats {
  total: number
  visible: number
  hidden: number
  withChildren: number
}

export interface RoleStats {
  total: number
  active: number
  inactive: number
  avgPermissions: number
}

export interface CategoryStats {
  total: number
  active: number
  withPosts: number
  avgPostsPerCategory: number
}

export interface TagStats {
  total: number
  active: number
  mostUsed: Tag[]
  avgUsage: number
}

export interface BlogStats {
  total: number
  published: number
  draft: number
  scheduled: number
  totalViews: number
  totalLikes: number
  avgReadingTime: number
}

export interface ImageStats {
  total: number
  totalSize: number
  byMimeType: { [key: string]: number }
  byFolder: { [key: string]: number }
  publicImages: number
  privateImages: number
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  discontinued: number
  inStock: number
  outOfStock: number
  lowStock: number
  byType: { [key: string]: number }
  byCategory: { [key: string]: number }
  featured: number
  digital: number
  totalSales: number
  totalRevenue: number
  avgPrice: number
  avgRating: number
  topSelling: Product[]
  recentlyAdded: Product[]
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
