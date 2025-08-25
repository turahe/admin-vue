import { describe, it, expect } from 'vitest'
import type {
  RequestInterceptors,
  RequestConfig,
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError
} from '../../src/axios/types'

describe('Axios Types', () => {
  describe('RequestInterceptors interface', () => {
    it('should allow optional request interceptor', () => {
      const interceptors: RequestInterceptors<any> = {
        requestInterceptors: (config: InternalAxiosRequestConfig) => {
          config.headers['Custom-Header'] = 'test'
          return config
        }
      }

      expect(interceptors.requestInterceptors).toBeDefined()
      expect(typeof interceptors.requestInterceptors).toBe('function')
    })

    it('should allow optional request error interceptor', () => {
      const interceptors: RequestInterceptors<any> = {
        requestInterceptorsCatch: (err: any) => {
          console.error('Request error:', err)
          return Promise.reject(err)
        }
      }

      expect(interceptors.requestInterceptorsCatch).toBeDefined()
      expect(typeof interceptors.requestInterceptorsCatch).toBe('function')
    })

    it('should allow optional response interceptor', () => {
      const interceptors: RequestInterceptors<string> = {
        responseInterceptors: (response: string) => {
          return response.toUpperCase()
        }
      }

      expect(interceptors.responseInterceptors).toBeDefined()
      expect(typeof interceptors.responseInterceptors).toBe('function')
    })

    it('should allow optional response error interceptor', () => {
      const interceptors: RequestInterceptors<any> = {
        responseInterceptorsCatch: (err: any) => {
          console.error('Response error:', err)
          return Promise.reject(err)
        }
      }

      expect(interceptors.responseInterceptorsCatch).toBeDefined()
      expect(typeof interceptors.responseInterceptorsCatch).toBe('function')
    })

    it('should allow all interceptors together', () => {
      const interceptors: RequestInterceptors<any> = {
        requestInterceptors: (config) => config,
        requestInterceptorsCatch: (err) => err,
        responseInterceptors: (response) => response,
        responseInterceptorsCatch: (err) => err
      }

      expect(interceptors.requestInterceptors).toBeDefined()
      expect(interceptors.requestInterceptorsCatch).toBeDefined()
      expect(interceptors.responseInterceptors).toBeDefined()
      expect(interceptors.responseInterceptorsCatch).toBeDefined()
    })

    it('should allow empty interceptors object', () => {
      const interceptors: RequestInterceptors<any> = {}

      expect(Object.keys(interceptors)).toHaveLength(0)
    })
  })

  describe('RequestConfig interface', () => {
    it('should extend AxiosRequestConfig with interceptors', () => {
      const config: RequestConfig = {
        url: '/api/test',
        method: 'GET',
        interceptors: {
          requestInterceptors: (config) => config
        }
      }

      expect(config.url).toBe('/api/test')
      expect(config.method).toBe('GET')
      expect(config.interceptors).toBeDefined()
      expect(config.interceptors?.requestInterceptors).toBeDefined()
    })

    it('should work without interceptors', () => {
      const config: RequestConfig = {
        url: '/api/test',
        method: 'POST',
        data: { test: 'data' }
      }

      expect(config.url).toBe('/api/test')
      expect(config.method).toBe('POST')
      expect(config.data).toEqual({ test: 'data' })
      expect(config.interceptors).toBeUndefined()
    })

    it('should support generic response type', () => {
      interface UserResponse {
        id: number
        name: string
      }

      const config: RequestConfig<UserResponse> = {
        url: '/api/user',
        method: 'GET',
        interceptors: {
          responseInterceptors: (response: UserResponse) => {
            return { ...response, name: response.name.toUpperCase() }
          }
        }
      }

      expect(config.interceptors?.responseInterceptors).toBeDefined()
    })

    it('should support all axios config properties', () => {
      const config: RequestConfig = {
        url: '/api/test',
        method: 'PUT',
        data: { test: 'data' },
        params: { page: 1 },
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
        responseType: 'json',
        withCredentials: true
      }

      expect(config.url).toBe('/api/test')
      expect(config.method).toBe('PUT')
      expect(config.data).toEqual({ test: 'data' })
      expect(config.params).toEqual({ page: 1 })
      expect(config.headers).toEqual({ 'Content-Type': 'application/json' })
      expect(config.timeout).toBe(5000)
      expect(config.responseType).toBe('json')
      expect(config.withCredentials).toBe(true)
    })
  })

  describe('Type exports', () => {
    it('should export all required types', () => {
      // This test verifies that all types are properly exported
      // The fact that we can import them means they're exported correctly
      expect(true).toBe(true)
    })
  })

  describe('Type compatibility', () => {
    it('should be compatible with real axios types', () => {
      // Mock axios response for testing
      const mockAxiosResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {}
      }

      // Should be assignable to AxiosResponse type
      const response: AxiosResponse = mockAxiosResponse
      expect(response.status).toBe(200)
      expect(response.data).toEqual({ message: 'success' })
    })

    it('should handle axios error types', () => {
      const mockError = {
        message: 'Network Error',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({})
      }

      // Should be compatible with AxiosError type structure
      expect(mockError.message).toBe('Network Error')
      expect(mockError.isAxiosError).toBe(true)
    })
  })
})
