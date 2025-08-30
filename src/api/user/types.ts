/**
 * User API Types
 * Based on swagger specification for user management
 */

export interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string
  last_login_at?: string
  created_at: string
  updated_at: string
  roles?: Role[]
}

export interface Role {
  id: string
  name: string
  slug: string
  description?: string
  permissions?: string[]
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  password_confirmation: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface UserCollectionResponse {
  data: User[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface UserResourceResponse {
  data: User
}

export interface UserRoleCollectionResponse {
  data: Role[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface UserMenuCollectionResponse {
  data: Menu[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface Menu {
  id: string
  name: string
  slug: string
  url?: string
  icon?: string
  parent_id?: string
  order: number
  active: boolean
  visible: boolean
  created_at: string
  updated_at: string
  children?: Menu[]
}
