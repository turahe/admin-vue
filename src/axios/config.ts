import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'

/**
 * Default request interceptor for handling authentication and data transformation
 * 
 * This interceptor:
 * 1. Adds Bearer token for Laravel Passport authentication
 * 2. Sets default Content-Type headers
 * 3. Transforms request data based on Content-Type
 * 4. Converts GET request params to URL query string
 * 
 * @param {InternalAxiosRequestConfig} config - Axios request configuration
 * @returns {InternalAxiosRequestConfig} Modified request configuration
 * 
 * @example
 * ```typescript
 * // This interceptor automatically:
 * // - Adds "Authorization: Bearer <token>" header
 * // - Converts POST data to appropriate format
 * // - Handles URL-encoded and FormData transformations
 * ```
 */
const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  // Add Bearer token for Laravel Passport authentication
  const userStore = useUserStoreWithOut()
  const token = userStore.getToken()
  if (token && !config.url?.includes('/login')) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  // Set default Content-Type for API requests
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  
  // Transform POST data based on Content-Type
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    // Convert data to URL-encoded format
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    // Convert object to FormData for file uploads
    config.data = objToFormData(config.data)
  }
  
  // Convert GET request params to URL query string
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

/**
 * Default response interceptor for handling API responses and errors
 * 
 * This interceptor:
 * 1. Handles file blob responses (direct pass-through)
 * 2. Processes Laravel API responses
 * 3. Shows error messages via Element Plus
 * 4. Handles authentication errors (401 Unauthorized)
 * 5. Automatically logs out users on authentication failure
 * 
 * @param {AxiosResponse} response - Axios response object
 * @returns {any | Promise<never>} Processed response data or rejected promise
 * 
 * @example
 * ```typescript
 * // This interceptor automatically:
 * // - Returns response.data for successful requests
 * // - Shows error messages for failed requests
 * // - Logs out users on 401 errors
 * // - Handles Laravel API response format
 * ```
 */
const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // If it's a file stream, pass through directly
    return response
  }
  
  // Handle Laravel API responses - they might not have a 'code' field
  if (response.status === 200 || response.status === 201) {
    // For Laravel Passport, successful responses might not have a 'code' field
    if (response.data.code === SUCCESS_CODE || !response.data.hasOwnProperty('code')) {
      return response.data
    }
  }
  
  // Handle error responses
  const errorMessage = response?.data?.message || response?.data?.error || 'An error occurred'
  ElMessage.error(errorMessage)
  
  // Handle 401 Unauthorized responses
  if (response.status === 401 || response?.data?.code === 401) {
    const userStore = useUserStoreWithOut()
    userStore.logout()
  }
  
  return Promise.reject(response.data)
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
