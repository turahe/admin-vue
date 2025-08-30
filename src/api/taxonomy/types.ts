/**
 * Taxonomy API Types
 * Based on swagger specification for taxonomy management
 */

export interface Taxonomy {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  level: number
  path: string
  record_left: number
  record_right: number
  created_at: string
  updated_at: string
  parent?: Taxonomy
  children?: Taxonomy[]
}

export interface CreateTaxonomyRequest {
  name: string
  slug?: string
  description?: string
  parent_id?: string
}

export interface UpdateTaxonomyRequest {
  name?: string
  slug?: string
  description?: string
  parent_id?: string
}

export interface TaxonomyCollectionResponse {
  data: Taxonomy[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface TaxonomyResourceResponse {
  data: Taxonomy
}

export interface TaxonomySearchResponse {
  data: Taxonomy[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    sort_by: string
    sort_desc: boolean
  }
}
