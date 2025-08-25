/**
 * Product Types and Interfaces
 * E-commerce product management types
 */

import type { BaseEntity, BaseCreateRequest, BaseUpdateRequest, BaseFilters } from './base'
import type { Category } from './category'
import type { Tag } from './tag'
import type { Image } from './image'

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

export interface ProductCreateRequest extends BaseCreateRequest {
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
