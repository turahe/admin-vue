import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'

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
  
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    config.data = objToFormData(config.data)
  }
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

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
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
