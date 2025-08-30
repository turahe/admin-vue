/**
 * Organization API Types
 * Based on swagger specification for organization management
 */

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  level: number
  path: string
  record_left: number
  record_right: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  parent?: Organization
  children?: Organization[]
}

export interface CreateOrganizationRequest {
  name: string
  slug?: string
  description?: string
  parent_id?: string
}

export interface UpdateOrganizationRequest {
  name?: string
  slug?: string
  description?: string
  parent_id?: string
  status?: 'active' | 'inactive'
}

export interface MoveOrganizationRequest {
  parent_id?: string
  position?: 'first' | 'last' | 'before' | 'after'
  reference_id?: string
}

export interface OrganizationCollectionResponse {
  data: Organization[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface OrganizationResourceResponse {
  data: Organization
}

export interface OrganizationTreeResponse {
  data: Organization[]
}

export interface OrganizationStatsResponse {
  data: {
    total_employees: number
    total_departments: number
    total_projects: number
    active_projects: number
  }
}
