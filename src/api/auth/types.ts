/**
 * Authentication API Types
 * Based on swagger specification for user authentication
 */

export interface LoginRequest {
  identity: string // email, username, or phone
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  password_confirmation: string
  first_name?: string
  last_name?: string
  phone?: string
}

export interface ForgetPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  password: string
  password_confirmation: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface RegisterResponse {
  user: UserProfile
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface UserProfile {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string
  created_at: string
  updated_at: string
}
