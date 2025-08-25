import request from '@/axios'
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductFilters,
  ProductAttribute,
  ProductVariant,
  ProductInventory,
  PaginationParams,
  ListResponse,
  ApiResponse,
  BulkDeleteRequest,
  BulkUpdateRequest,
  BulkResponse,
  ProductStats
} from '@/api/common/types'

// ===== Product CRUD Operations =====

/**
 * Get paginated list of products with optional filters
 */
export const getProductListApi = (params?: PaginationParams & ProductFilters) => {
  return request.get<ListResponse<Product>>({
    url: '/api/products',
    params
  })
}

/**
 * Get active products only
 */
export const getActiveProductsApi = (
  params?: PaginationParams & Omit<ProductFilters, 'status'>
) => {
  return request.get<ListResponse<Product>>({
    url: '/api/products/active',
    params
  })
}

/**
 * Get featured products
 */
export const getFeaturedProductsApi = (limit = 10) => {
  return request.get<ApiResponse<Product[]>>({
    url: '/api/products/featured',
    params: { limit }
  })
}

/**
 * Get single product by ID
 */
export const getProductByIdApi = (id: number) => {
  return request.get<ApiResponse<Product>>({
    url: `/api/products/${id}`
  })
}

/**
 * Get product by slug
 */
export const getProductBySlugApi = (slug: string) => {
  return request.get<ApiResponse<Product>>({
    url: `/api/products/slug/${slug}`
  })
}

/**
 * Get product by SKU
 */
export const getProductBySkuApi = (sku: string) => {
  return request.get<ApiResponse<Product>>({
    url: `/api/products/sku/${sku}`
  })
}

/**
 * Create new product
 */
export const createProductApi = (data: ProductCreateRequest) => {
  return request.post<ApiResponse<Product>>({
    url: '/api/products',
    data
  })
}

/**
 * Update existing product
 */
export const updateProductApi = (id: number, data: ProductUpdateRequest) => {
  return request.put<ApiResponse<Product>>({
    url: `/api/products/${id}`,
    data
  })
}

/**
 * Delete product by ID
 */
export const deleteProductApi = (id: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/products/${id}`
  })
}

/**
 * Bulk delete products
 */
export const bulkDeleteProductsApi = (data: BulkDeleteRequest) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/products/bulk',
    data
  })
}

/**
 * Bulk update products
 */
export const bulkUpdateProductsApi = (data: BulkUpdateRequest<ProductUpdateRequest>) => {
  return request.put<ApiResponse<BulkResponse>>({
    url: '/api/products/bulk',
    data
  })
}

/**
 * Toggle product status
 */
export const toggleProductStatusApi = (id: number) => {
  return request.patch<ApiResponse<Product>>({
    url: `/api/products/${id}/toggle-status`
  })
}

/**
 * Toggle product featured status
 */
export const toggleProductFeaturedApi = (id: number) => {
  return request.patch<ApiResponse<Product>>({
    url: `/api/products/${id}/toggle-featured`
  })
}

/**
 * Duplicate product
 */
export const duplicateProductApi = (id: number) => {
  return request.post<ApiResponse<Product>>({
    url: `/api/products/${id}/duplicate`
  })
}

// ===== Product Inventory Management =====

/**
 * Update product inventory
 */
export const updateProductInventoryApi = (id: number, inventory: ProductInventory) => {
  return request.put<ApiResponse<ProductInventory>>({
    url: `/api/products/${id}/inventory`,
    data: inventory
  })
}

/**
 * Adjust product stock
 */
export const adjustProductStockApi = (id: number, adjustment: number, reason?: string) => {
  return request.patch<ApiResponse<ProductInventory>>({
    url: `/api/products/${id}/stock`,
    data: { adjustment, reason }
  })
}

/**
 * Get products with low stock
 */
export const getLowStockProductsApi = (threshold?: number) => {
  return request.get<ApiResponse<Product[]>>({
    url: '/api/products/low-stock',
    params: { threshold }
  })
}

/**
 * Get out of stock products
 */
export const getOutOfStockProductsApi = () => {
  return request.get<ApiResponse<Product[]>>({
    url: '/api/products/out-of-stock'
  })
}

// ===== Product Variants Management =====

/**
 * Get product variants
 */
export const getProductVariantsApi = (productId: number) => {
  return request.get<ApiResponse<ProductVariant[]>>({
    url: `/api/products/${productId}/variants`
  })
}

/**
 * Create product variant
 */
export const createProductVariantApi = (productId: number, variant: Omit<ProductVariant, 'id'>) => {
  return request.post<ApiResponse<ProductVariant>>({
    url: `/api/products/${productId}/variants`,
    data: variant
  })
}

/**
 * Update product variant
 */
export const updateProductVariantApi = (
  productId: number,
  variantId: number,
  variant: Partial<ProductVariant>
) => {
  return request.put<ApiResponse<ProductVariant>>({
    url: `/api/products/${productId}/variants/${variantId}`,
    data: variant
  })
}

/**
 * Delete product variant
 */
export const deleteProductVariantApi = (productId: number, variantId: number) => {
  return request.delete<ApiResponse<void>>({
    url: `/api/products/${productId}/variants/${variantId}`
  })
}

// ===== Product Attributes Management =====

/**
 * Get product attributes
 */
export const getProductAttributesApi = (productId: number) => {
  return request.get<ApiResponse<ProductAttribute[]>>({
    url: `/api/products/${productId}/attributes`
  })
}

/**
 * Update product attributes
 */
export const updateProductAttributesApi = (productId: number, attributes: ProductAttribute[]) => {
  return request.put<ApiResponse<ProductAttribute[]>>({
    url: `/api/products/${productId}/attributes`,
    data: { attributes }
  })
}

// ===== Product Search & Discovery =====

/**
 * Search products
 */
export const searchProductsApi = (query: string, params?: PaginationParams & ProductFilters) => {
  return request.get<ListResponse<Product>>({
    url: '/api/products/search',
    params: { query, ...params }
  })
}

/**
 * Get related products
 */
export const getRelatedProductsApi = (productId: number, limit = 8) => {
  return request.get<ApiResponse<Product[]>>({
    url: `/api/products/${productId}/related`,
    params: { limit }
  })
}

/**
 * Get products by category
 */
export const getProductsByCategoryApi = (categoryId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Product>>({
    url: `/api/products/by-category/${categoryId}`,
    params
  })
}

/**
 * Get products by tag
 */
export const getProductsByTagApi = (tagId: number, params?: PaginationParams) => {
  return request.get<ListResponse<Product>>({
    url: `/api/products/by-tag/${tagId}`,
    params
  })
}

/**
 * Get products by brand
 */
export const getProductsByBrandApi = (brand: string, params?: PaginationParams) => {
  return request.get<ListResponse<Product>>({
    url: '/api/products/by-brand',
    params: { brand, ...params }
  })
}

/**
 * Get best selling products
 */
export const getBestSellingProductsApi = (days = 30, limit = 10) => {
  return request.get<ApiResponse<Product[]>>({
    url: '/api/products/best-selling',
    params: { days, limit }
  })
}

/**
 * Get newest products
 */
export const getNewestProductsApi = (limit = 10) => {
  return request.get<ApiResponse<Product[]>>({
    url: '/api/products/newest',
    params: { limit }
  })
}

/**
 * Get products on sale
 */
export const getProductsOnSaleApi = (params?: PaginationParams) => {
  return request.get<ListResponse<Product>>({
    url: '/api/products/on-sale',
    params
  })
}

// ===== Product Pricing & Discounts =====

/**
 * Update product pricing
 */
export const updateProductPricingApi = (
  id: number,
  pricing: {
    price: number
    salePrice?: number
    costPrice?: number
  }
) => {
  return request.patch<ApiResponse<Product>>({
    url: `/api/products/${id}/pricing`,
    data: pricing
  })
}

/**
 * Apply bulk discount
 */
export const applyBulkDiscountApi = (
  productIds: number[],
  discount: {
    type: 'percentage' | 'fixed'
    value: number
    startDate?: string
    endDate?: string
  }
) => {
  return request.post<ApiResponse<BulkResponse>>({
    url: '/api/products/bulk-discount',
    data: { productIds, discount }
  })
}

/**
 * Remove bulk discount
 */
export const removeBulkDiscountApi = (productIds: number[]) => {
  return request.delete<ApiResponse<BulkResponse>>({
    url: '/api/products/bulk-discount',
    data: { productIds }
  })
}

// ===== Product Analytics & Statistics =====

/**
 * Get product statistics
 */
export const getProductStatsApi = () => {
  return request.get<ApiResponse<ProductStats>>({
    url: '/api/products/stats'
  })
}

/**
 * Increment product views
 */
export const incrementProductViewsApi = (id: number) => {
  return request.post<ApiResponse<{ viewsCount: number }>>({
    url: `/api/products/${id}/view`
  })
}

/**
 * Get product performance
 */
export const getProductPerformanceApi = (id: number, days = 30) => {
  return request.get<
    ApiResponse<{
      views: number
      sales: number
      revenue: number
      conversionRate: number
      timeline: Array<{ date: string; views: number; sales: number }>
    }>
  >({
    url: `/api/products/${id}/performance`,
    params: { days }
  })
}

// ===== Product Validation & Utilities =====

/**
 * Validate product SKU uniqueness
 */
export const validateProductSkuApi = (sku: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/products/validate-sku',
    params: { sku, excludeId }
  })
}

/**
 * Validate product slug uniqueness
 */
export const validateProductSlugApi = (slug: string, excludeId?: number) => {
  return request.get<ApiResponse<{ isUnique: boolean }>>({
    url: '/api/products/validate-slug',
    params: { slug, excludeId }
  })
}

/**
 * Generate product slug from name
 */
export const generateProductSlugApi = (name: string) => {
  return request.get<ApiResponse<{ slug: string }>>({
    url: '/api/products/generate-slug',
    params: { name }
  })
}

/**
 * Generate product SKU
 */
export const generateProductSkuApi = (categoryId?: number, name?: string) => {
  return request.get<ApiResponse<{ sku: string }>>({
    url: '/api/products/generate-sku',
    params: { categoryId, name }
  })
}

// ===== Product Import & Export =====

/**
 * Export products to different formats
 */
export const exportProductsApi = (format: 'csv' | 'xlsx' | 'json', filters?: ProductFilters) => {
  return request.get<Blob>({
    url: '/api/products/export',
    params: { format, ...filters },
    responseType: 'blob'
  })
}

/**
 * Import products from file
 */
export const importProductsApi = (
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
    url: '/api/products/import',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ===== Product Reviews & Ratings =====

/**
 * Get product reviews
 */
export const getProductReviewsApi = (productId: number, params?: PaginationParams) => {
  return request.get<ListResponse<any>>({
    url: `/api/products/${productId}/reviews`,
    params
  })
}

/**
 * Update product rating
 */
export const updateProductRatingApi = (id: number) => {
  return request.patch<ApiResponse<{ rating: number; reviewsCount: number }>>({
    url: `/api/products/${id}/rating`
  })
}

// ===== Product Categories & Tags =====

/**
 * Get product brands
 */
export const getProductBrandsApi = () => {
  return request.get<ApiResponse<Array<{ brand: string; count: number }>>>({
    url: '/api/products/brands'
  })
}

/**
 * Get product manufacturers
 */
export const getProductManufacturersApi = () => {
  return request.get<ApiResponse<Array<{ manufacturer: string; count: number }>>>({
    url: '/api/products/manufacturers'
  })
}
