import axios, { AxiosError } from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { AxiosInstance, InternalAxiosRequestConfig, RequestConfig, AxiosResponse } from './types'
import { ElMessage } from 'element-plus'
import { REQUEST_TIMEOUT } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

/**
 * Base URL for API requests, loaded from environment variables
 * @constant {string} PATH_URL
 */
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

/**
 * Map to store AbortController instances for request cancellation
 * Key: Request URL, Value: AbortController instance
 * @type {Map<string, AbortController>}
 */
const abortControllerMap: Map<string, AbortController> = new Map()

/**
 * Main Axios instance with pre-configured settings
 * 
 * Configuration:
 * - Timeout: Configured via REQUEST_TIMEOUT constant
 * - Base URL: Loaded from VITE_API_BASE_PATH environment variable
 * - Request/Response interceptors: Automatically applied
 * - Request cancellation: Built-in support via AbortController
 * 
 * @type {AxiosInstance}
 */
const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL
})

// Request interceptor for setting up AbortController for request cancellation
axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(
    import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url,
    controller
  )
  return res
})

// Response interceptor for cleaning up AbortController and handling errors
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    // Don't process anything here, let subsequent interceptors handle the complete context
    return res
  },
  (error: AxiosError) => {
    console.log('err： ' + error) // for debug
    
    // Handle Laravel API error responses
    if (error.response) {
      const { status, data } = error.response
      const errorData = data as any // Type assertion for error response data
      
      if (status === 401) {
        // Handle unauthorized access
        ElMessage.error('Authentication failed. Please login again.')
        const userStore = useUserStoreWithOut()
        userStore.logout()
      } else if (status === 422) {
        // Handle validation errors (Laravel format)
        const validationErrors = errorData.errors || {}
        const firstError = Object.values(validationErrors)[0] as string[]
        ElMessage.error(firstError?.[0] || errorData.message || 'Validation error')
      } else {
        // Handle other HTTP errors
        const errorMessage = errorData.message || errorData.error || error.message || 'An error occurred'
        ElMessage.error(errorMessage)
      }
    } else {
      // Handle network errors
      ElMessage.error(error.message || 'Network error')
    }
    
    return Promise.reject(error)
  }
)

// Apply default request and response interceptors
axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

/**
 * HTTP service with request cancellation support and custom interceptors
 * 
 * Features:
 * - Custom request interceptors per request
 * - Request cancellation by URL or cancel all
 * - Automatic error handling and user feedback
 * - Laravel API integration with proper error handling
 * 
 * @example
 * ```typescript
 * // Basic request
 * const response = await service.request({
 *   url: '/api/users',
 *   method: 'GET'
 * })
 * 
 * // Request with custom interceptors
 * const response = await service.request({
 *   url: '/api/users',
 *   method: 'POST',
 *   data: userData,
 *   interceptors: {
 *     requestInterceptors: (config) => {
 *       config.headers['Custom-Header'] = 'value'
 *       return config
 *     }
 *   }
 * })
 * 
 * // Cancel specific requests
 * service.cancelRequest(['/api/users', '/api/posts'])
 * 
 * // Cancel all pending requests
 * service.cancelAllRequest()
 * ```
 */
const service = {
  /**
   * Make an HTTP request with optional custom interceptors
   * @param {RequestConfig} config - Request configuration including URL, method, data, and optional interceptors
   * @returns {Promise<any>} Promise that resolves with response data or rejects with error
   */
  request: (config: RequestConfig) => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }

      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  },
  
  /**
   * Cancel one or more pending requests by URL
   * @param {string | string[]} url - Single URL string or array of URLs to cancel
   * 
   * @example
   * ```typescript
   * // Cancel single request
   * service.cancelRequest('/api/users')
   * 
   * // Cancel multiple requests
   * service.cancelRequest(['/api/users', '/api/posts'])
   * ```
   */
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  
  /**
   * Cancel all pending requests
   * 
   * This method aborts all active HTTP requests and clears the internal
   * AbortController map. Useful for cleanup when navigating away from a page
   * or logging out.
   * 
   * @example
   * ```typescript
   * // Cancel all requests (e.g., on logout or page navigation)
   * service.cancelAllRequest()
   * ```
   */
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

export default service
