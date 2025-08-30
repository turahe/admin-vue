/**
 * RBAC API Types
 * Based on swagger specification for RBAC management
 */

export interface Policy {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreatePolicyRequest {
  name: string
  description?: string
  resource: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: Record<string, any>
}

export interface UpdatePolicyRequest {
  name?: string
  description?: string
  resource?: string
  action?: string
  effect?: 'allow' | 'deny'
  conditions?: Record<string, any>
}

export interface PolicyCollectionResponse {
  data: Policy[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface PolicyResourceResponse {
  data: Policy
}

export interface UserRoleResourceResponse {
  data: {
    user_id: string
    role_id: string
    assigned_at: string
  }
}
