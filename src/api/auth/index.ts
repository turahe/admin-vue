import request from '@/axios'
import type {
  LoginRequest,
  RegisterRequest,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LoginResponse,
  RegisterResponse,
  TokenResponse
} from './types'

/**
 * Authentication API endpoints
 * Based on swagger specification for user authentication
 */

/**
 * User login with identity (email, username, or phone) and password
 * @param data Login credentials
 * @returns Promise with login response containing tokens
 */
export const loginApi = (data: LoginRequest): Promise<LoginResponse> => {
  return request.post({ url: '/auth/login', data })
}

/**
 * Register a new user account
 * @param data User registration data
 * @returns Promise with registration response
 */
export const registerApi = (data: RegisterRequest): Promise<RegisterResponse> => {
  return request.post({ url: '/auth/register', data })
}

/**
 * Request password reset via email
 * @param data Password reset request
 * @returns Promise with success response
 */
export const forgetPasswordApi = (data: ForgetPasswordRequest): Promise<any> => {
  return request.post({ url: '/auth/forget-password', data })
}

/**
 * Reset password using email and OTP
 * @param data Password reset with OTP data
 * @returns Promise with success response
 */
export const resetPasswordApi = (data: ResetPasswordRequest): Promise<any> => {
  return request.post({ url: '/auth/reset-password', data })
}

/**
 * Refresh access token using refresh token
 * @param data Refresh token request
 * @returns Promise with new token response
 */
export const refreshTokenApi = (data: RefreshTokenRequest): Promise<TokenResponse> => {
  return request.post({ url: '/auth/refresh', data })
}

/**
 * Logout user (client should discard tokens)
 * @returns Promise with success response
 */
export const logoutApi = (): Promise<any> => {
  return request.post({ url: '/auth/logout' })
}

/**
 * Get user profile information
 * @returns Promise with user profile data
 */
export const getUserProfileApi = (): Promise<any> => {
  return request.get({ url: '/profile' })
}

/**
 * Update user profile information
 * @param data Profile update data
 * @returns Promise with updated profile
 */
export const updateProfileApi = (data: any): Promise<any> => {
  return request.put({ url: '/profile', data })
}
