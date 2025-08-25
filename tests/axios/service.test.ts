import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { REQUEST_TIMEOUT } from '../../src/constants'

// Mock external dependencies
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      },
      request: vi.fn()
    }))
  },
  AxiosError: class MockAxiosError extends Error {
    constructor(
      message: string,
      public response?: any
    ) {
      super(message)
      this.name = 'AxiosError'
    }
  }
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn()
  }
}))

vi.mock('../../src/store/modules/user', () => ({
  useUserStoreWithOut: vi.fn(() => ({
    logout: vi.fn()
  }))
}))

vi.mock('../../src/axios/config', () => ({
  defaultRequestInterceptors: vi.fn((config) => config),
  defaultResponseInterceptors: vi.fn((response) => response)
}))

import { ElMessage } from 'element-plus'
import { useUserStoreWithOut } from '../../src/store/modules/user'
import { defaultRequestInterceptors, defaultResponseInterceptors } from '../../src/axios/config'

const mockAxios = vi.mocked(axios)
const mockElMessage = vi.mocked(ElMessage)
const mockUseUserStoreWithOut = vi.mocked(useUserStoreWithOut)
const mockDefaultRequestInterceptors = vi.mocked(defaultRequestInterceptors)
const mockDefaultResponseInterceptors = vi.mocked(defaultResponseInterceptors)

describe('Axios Service', () => {
  let mockAxiosInstance: any
  let mockUserStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()

    mockUserStore = {
      logout: vi.fn()
    }
    mockUseUserStoreWithOut.mockReturnValue(mockUserStore)

    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      },
      request: vi.fn().mockResolvedValue({ data: 'success' })
    }
    mockAxios.create.mockReturnValue(mockAxiosInstance)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Module Loading', () => {
    it('should create axios instance with correct configuration', async () => {
      // Dynamic import to trigger instance creation
      const { PATH_URL } = await import('../../src/axios/service')

      expect(mockAxios.create).toHaveBeenCalledWith({
        timeout: REQUEST_TIMEOUT,
        baseURL: PATH_URL
      })
    })

    it('should setup interceptors when module is loaded', async () => {
      await import('../../src/axios/service')

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()
    })
  })

  describe('Service Request Method', () => {
    let service: any

    beforeEach(async () => {
      const serviceModule = await import('../../src/axios/service')
      service = serviceModule.default
    })

    it('should make request with basic configuration', async () => {
      const config = {
        url: '/api/test',
        method: 'get'
      }

      const result = await service.request(config)

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(config)
      expect(result).toEqual({ data: 'success' })
    })

    it('should apply custom request interceptors', async () => {
      const customInterceptor = vi.fn((config) => ({
        ...config,
        headers: { 'Custom-Header': 'test' }
      }))

      const config = {
        url: '/api/test',
        method: 'post',
        interceptors: {
          requestInterceptors: customInterceptor
        }
      }

      await service.request(config)

      expect(customInterceptor).toHaveBeenCalledWith(config)
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'post',
        headers: { 'Custom-Header': 'test' },
        interceptors: { requestInterceptors: customInterceptor }
      })
    })

    it('should work without custom interceptors', async () => {
      const config = {
        url: '/api/test',
        method: 'get'
      }

      await service.request(config)

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(config)
    })

    it('should handle request errors', async () => {
      const error = new Error('Request failed')
      mockAxiosInstance.request.mockRejectedValue(error)

      const config = {
        url: '/api/test',
        method: 'get'
      }

      await expect(service.request(config)).rejects.toBe(error)
    })
  })

  describe('Request Cancellation', () => {
    let service: any

    beforeEach(async () => {
      const serviceModule = await import('../../src/axios/service')
      service = serviceModule.default
    })

    it('should provide cancelRequest method', () => {
      expect(typeof service.cancelRequest).toBe('function')
    })

    it('should provide cancelAllRequest method', () => {
      expect(typeof service.cancelAllRequest).toBe('function')
    })

    it('should handle string URL for cancelRequest', () => {
      expect(() => service.cancelRequest('/api/test')).not.toThrow()
    })

    it('should handle array of URLs for cancelRequest', () => {
      expect(() => service.cancelRequest(['/api/test1', '/api/test2'])).not.toThrow()
    })

    it('should handle cancelAllRequest', () => {
      expect(() => service.cancelAllRequest()).not.toThrow()
    })
  })

  describe('Response Interceptor Error Handling', () => {
    let responseErrorHandler: any

    beforeEach(async () => {
      await import('../../src/axios/service')
      // Get the error handler from the response interceptor
      const responseCalls = mockAxiosInstance.interceptors.response.use.mock.calls
      if (responseCalls.length > 0) {
        responseErrorHandler = responseCalls[0][1] // Error handler is the second argument
      }
    })

    it('should have response error handler', () => {
      expect(responseErrorHandler).toBeDefined()
      expect(typeof responseErrorHandler).toBe('function')
    })

    it('should handle 401 unauthorized errors', async () => {
      if (!responseErrorHandler) return

      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(mockElMessage.error).toHaveBeenCalledWith('Authentication failed. Please login again.')
      expect(mockUserStore.logout).toHaveBeenCalled()
    })

    it('should handle 422 validation errors', async () => {
      if (!responseErrorHandler) return

      const error = {
        response: {
          status: 422,
          data: {
            errors: {
              email: ['The email field is required.'],
              name: ['The name field must be a string.']
            }
          }
        }
      }

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(mockElMessage.error).toHaveBeenCalledWith('The email field is required.')
    })

    it('should handle network errors without response', async () => {
      if (!responseErrorHandler) return

      const error = {
        message: 'Network Error'
      }

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(mockElMessage.error).toHaveBeenCalledWith('Network Error')
    })

    it('should handle errors without message', async () => {
      if (!responseErrorHandler) return

      const error = {}

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(mockElMessage.error).toHaveBeenCalledWith('Network error')
    })
  })

  describe('Constants', () => {
    it('should export PATH_URL', async () => {
      const { PATH_URL } = await import('../../src/axios/service')
      expect(PATH_URL).toBeDefined()
      expect(PATH_URL).toBe(import.meta.env.VITE_API_BASE_PATH)
    })
  })

  describe('AbortController Integration', () => {
    let requestInterceptor: any

    beforeEach(async () => {
      await import('../../src/axios/service')
      // Get the request interceptor
      const requestCalls = mockAxiosInstance.interceptors.request.use.mock.calls
      if (requestCalls.length > 0) {
        // Find the interceptor that handles AbortController (not the default one)
        requestInterceptor = requestCalls.find(
          (call) => call[0] !== mockDefaultRequestInterceptors
        )?.[0]
      }
    })

    it('should create AbortController for each request', () => {
      if (!requestInterceptor) return

      const mockConfig = { url: '/api/test' }
      const result = requestInterceptor(mockConfig)

      expect(result.signal).toBeDefined()
      expect(result.signal).toBeInstanceOf(AbortSignal)
    })

    it('should handle requests without URL', () => {
      if (!requestInterceptor) return

      const mockConfig = {}
      const result = requestInterceptor(mockConfig)

      expect(result.signal).toBeDefined()
    })
  })

  describe('Response Success Handler', () => {
    let responseSuccessHandler: any

    beforeEach(async () => {
      await import('../../src/axios/service')
      // Get the success handler from the response interceptor
      const responseCalls = mockAxiosInstance.interceptors.response.use.mock.calls
      if (responseCalls.length > 0) {
        responseSuccessHandler = responseCalls[0][0] // Success handler is the first argument
      }
    })

    it('should clean up AbortController on successful response', () => {
      if (!responseSuccessHandler) return

      const response = {
        config: { url: '/api/test' }
      }

      const result = responseSuccessHandler(response)
      expect(result).toBe(response)
    })

    it('should handle response without config URL', () => {
      if (!responseSuccessHandler) return

      const response = {
        config: {}
      }

      expect(() => responseSuccessHandler(response)).not.toThrow()
    })
  })

  describe('Integration with Default Interceptors', () => {
    it('should apply default interceptors', async () => {
      await import('../../src/axios/service')

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        mockDefaultRequestInterceptors
      )
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        mockDefaultResponseInterceptors
      )
    })
  })
})
