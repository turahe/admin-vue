import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

/**
 * Internal request function that handles authentication and headers
 *
 * This function:
 * 1. Extracts configuration from AxiosConfig
 * 2. Automatically adds authentication headers
 * 3. Sets default Content-Type header
 * 4. Merges custom headers with defaults
 *
 * @param {AxiosConfig} option - Request configuration object
 * @returns {Promise<any>} Promise that resolves with response data
 *
 * @private
 */
const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option

  const userStore = useUserStoreWithOut()
  return service.request({
    url: url,
    method,
    params,
    data: data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      [userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '',
      ...headers
    }
  })
}

/**
 * HTTP Request Client - Simplified API for making HTTP requests
 *
 * This client provides:
 * - Automatic authentication header injection
 * - TypeScript support with generic response types
 * - Request cancellation capabilities
 * - Consistent error handling
 * - Laravel API integration
 *
 * @example
 * ```typescript
 * import request from '@/axios'
 *
 * // GET request
 * const users = await request.get<User[]>({ url: '/api/users' })
 *
 * // POST request with data
 * const newUser = await request.post<User>({
 *   url: '/api/users',
 *   data: { name: 'John', email: 'john@example.com' }
 * })
 *
 * // DELETE request
 * await request.delete({ url: '/api/users/1' })
 *
 * // Cancel specific request
 * request.cancelRequest('/api/users')
 *
 * // Cancel all requests
 * request.cancelAllRequest()
 * ```
 */
export default {
  /**
   * Make a GET request
   * @template T - Expected response data type
   * @param {AxiosConfig} option - Request configuration (url, params, headers, etc.)
   * @returns {Promise<IResponse<T>>} Promise that resolves with typed response data
   *
   * @example
   * ```typescript
   * // Get all users
   * const users = await request.get<User[]>({ url: '/api/users' })
   *
   * // Get users with query parameters
   * const filteredUsers = await request.get<User[]>({
   *   url: '/api/users',
   *   params: { page: 1, limit: 10 }
   * })
   * ```
   */
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },

  /**
   * Make a POST request
   * @template T - Expected response data type
   * @param {AxiosConfig} option - Request configuration (url, data, headers, etc.)
   * @returns {Promise<IResponse<T>>} Promise that resolves with typed response data
   *
   * @example
   * ```typescript
   * // Create a new user
   * const newUser = await request.post<User>({
   *   url: '/api/users',
   *   data: { name: 'John', email: 'john@example.com' }
   * })
   *
   * // Upload file with FormData
   * const formData = new FormData()
   * formData.append('file', file)
   * await request.post({
   *   url: '/api/upload',
   *   data: formData,
   *   headers: { 'Content-Type': 'multipart/form-data' }
   * })
   * ```
   */
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },

  /**
   * Make a DELETE request
   * @template T - Expected response data type
   * @param {AxiosConfig} option - Request configuration (url, headers, etc.)
   * @returns {Promise<IResponse<T>>} Promise that resolves with typed response data
   *
   * @example
   * ```typescript
   * // Delete a user
   * await request.delete({ url: '/api/users/1' })
   *
   * // Delete with confirmation
   * const result = await request.delete<{ message: string }>({
   *   url: '/api/users/1'
   * })
   * console.log(result.message) // "User deleted successfully"
   * ```
   */
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },

  /**
   * Make a PUT request
   * @template T - Expected response data type
   * @param {AxiosConfig} option - Request configuration (url, data, headers, etc.)
   * @returns {Promise<IResponse<T>>} Promise that resolves with typed response data
   *
   * @example
   * ```typescript
   * // Update a user
   * const updatedUser = await request.put<User>({
   *   url: '/api/users/1',
   *   data: { name: 'Jane', email: 'jane@example.com' }
   * })
   *
   * // Partial update
   * await request.put({
   *   url: '/api/users/1',
   *   data: { status: 'active' }
   * })
   * ```
   */
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },

  /**
   * Cancel one or more pending requests by URL
   * @param {string | string[]} url - Single URL or array of URLs to cancel
   *
   * @example
   * ```typescript
   * // Cancel single request
   * request.cancelRequest('/api/users')
   *
   * // Cancel multiple requests
   * request.cancelRequest(['/api/users', '/api/posts'])
   * ```
   */
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },

  /**
   * Cancel all pending requests
   *
   * Useful for cleanup when navigating away from a page or logging out.
   * This will abort all active HTTP requests and clean up internal state.
   *
   * @example
   * ```typescript
   * // Cancel all requests on logout
   * const handleLogout = () => {
   *   request.cancelAllRequest()
   *   // ... rest of logout logic
   * }
   * ```
   */
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
