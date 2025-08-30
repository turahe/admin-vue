import axios, { AxiosError } from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { AxiosInstance, InternalAxiosRequestConfig, RequestConfig, AxiosResponse } from './types'
import { ElMessage } from 'element-plus'
import { REQUEST_TIMEOUT } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

export const PATH_URL = import.meta.env.VITE_API_BASE_PATH
console.log('API Base URL:', PATH_URL)

const abortControllerMap: Map<string, AbortController> = new Map()

const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(url, controller)
  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    console.log('err： ' + error) // for debug

    // Handle Laravel API error responses
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        // Handle unauthorized access
        ElMessage.error('Authentication failed. Please login again.')
        const userStore = useUserStoreWithOut()
        userStore.logout()
      } else if (status === 422) {
        // Handle validation errors
        const responseData = data as any
        const validationErrors = responseData.errors || {}
        const firstError = Object.values(validationErrors)[0] as string[]
        ElMessage.error(firstError?.[0] || responseData.message || 'Validation error')
      } else {
        // Handle other HTTP errors
        const responseData = data as any
        const errorMessage =
          responseData.message || responseData.error || error.message || 'An error occurred'
        ElMessage.error(errorMessage)
      }
    } else {
      // Handle network errors
      ElMessage.error(error.message || 'Network error')
    }

    return Promise.reject(error)
  }
)

axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

const service = {
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
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

export default service
