import { useUserStoreWithOut } from '@/store/modules/user'

/**
 * Simple authentication manager for axios requests
 */
class AuthManager {
  /**
   * Check if an endpoint is public (doesn't require authentication)
   */
  isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/refresh',
      '/api/v1/auth/forget-password',
      '/api/v1/auth/reset-password',
      '/api/v1/health'
    ]

    return publicEndpoints.some((endpoint) => url.includes(endpoint))
  }

  /**
   * Get the authentication header for requests
   */
  getAuthHeader(): string | null {
    const userStore = useUserStoreWithOut()
    const token = userStore.getToken

    if (!token) {
      return null
    }

    return `Bearer ${token}`
  }
}

export const authManager = new AuthManager()
