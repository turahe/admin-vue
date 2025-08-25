import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defaultRequestInterceptors, defaultResponseInterceptors } from '../../src/axios/config'
import type { InternalAxiosRequestConfig, AxiosResponse } from '../../src/axios/types'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '../../src/constants'

// Mock external dependencies
vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn()
  }
}))

vi.mock('qs', () => ({
  default: {
    stringify: vi.fn((data) => 'stringified=' + JSON.stringify(data))
  }
}))

vi.mock('../../src/store/modules/user', () => ({
  useUserStoreWithOut: vi.fn(() => ({
    getToken: vi.fn(),
    logout: vi.fn()
  }))
}))

vi.mock('../../src/utils', () => ({
  objToFormData: vi.fn((data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
    return formData
  })
}))

import { ElMessage } from 'element-plus'
import qs from 'qs'
import { useUserStoreWithOut } from '../../src/store/modules/user'
import { objToFormData } from '../../src/utils'

const mockElMessage = vi.mocked(ElMessage)
const mockQs = vi.mocked(qs)
const mockUseUserStoreWithOut = vi.mocked(useUserStoreWithOut)
const mockObjToFormData = vi.mocked(objToFormData)

describe('Axios Config', () => {
  let mockUserStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockUserStore = {
      getToken: vi.fn(),
      logout: vi.fn()
    }
    mockUseUserStoreWithOut.mockReturnValue(mockUserStore)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('defaultRequestInterceptors', () => {
    let baseConfig: InternalAxiosRequestConfig

    beforeEach(() => {
      baseConfig = {
        headers: {},
        url: '/api/test',
        method: 'get'
      } as InternalAxiosRequestConfig
    })

    describe('Authentication', () => {
      it('should add Bearer token when token exists and not login request', () => {
        mockUserStore.getToken.mockReturnValue('test-token')
        baseConfig.url = '/api/users'

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Authorization']).toBe('Bearer test-token')
      })

      it('should not add token for login requests', () => {
        mockUserStore.getToken.mockReturnValue('test-token')
        baseConfig.url = '/login'

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Authorization']).toBeUndefined()
      })

      it('should not add token when no token exists', () => {
        mockUserStore.getToken.mockReturnValue(null)

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Authorization']).toBeUndefined()
      })

      it('should not add token when token is empty string', () => {
        mockUserStore.getToken.mockReturnValue('')

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Authorization']).toBeUndefined()
      })
    })

    describe('Content-Type Header', () => {
      it('should set default Content-Type when not provided', () => {
        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Content-Type']).toBe('application/json')
      })

      it('should not override existing Content-Type', () => {
        baseConfig.headers['Content-Type'] = 'text/plain'

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Content-Type']).toBe('text/plain')
      })

      it('should not override multipart/form-data Content-Type', () => {
        baseConfig.headers['Content-Type'] = 'multipart/form-data'

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Content-Type']).toBe('multipart/form-data')
      })
    })

    describe('Data Transformation', () => {
      it('should stringify data for application/x-www-form-urlencoded POST requests', () => {
        baseConfig.method = 'post'
        baseConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        baseConfig.data = { name: 'test', value: 123 }
        mockQs.stringify.mockReturnValue('name=test&value=123')

        const result = defaultRequestInterceptors(baseConfig)

        expect(mockQs.stringify).toHaveBeenCalledWith({ name: 'test', value: 123 })
        expect(result.data).toBe('name=test&value=123')
      })

      it('should not stringify data for non-POST requests', () => {
        baseConfig.method = 'get'
        baseConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        baseConfig.data = { name: 'test' }

        const result = defaultRequestInterceptors(baseConfig)

        expect(mockQs.stringify).not.toHaveBeenCalled()
        expect(result.data).toEqual({ name: 'test' })
      })

      it('should convert object to FormData for multipart/form-data when TRANSFORM_REQUEST_DATA is true', () => {
        // Mock TRANSFORM_REQUEST_DATA to be true
        vi.doMock('../../src/constants', () => ({
          TRANSFORM_REQUEST_DATA: true,
          SUCCESS_CODE: 0
        }))

        baseConfig.method = 'post'
        baseConfig.headers['Content-Type'] = 'multipart/form-data'
        baseConfig.data = { name: 'test', file: 'data' }

        const mockFormData = new FormData()
        mockObjToFormData.mockReturnValue(mockFormData)

        const result = defaultRequestInterceptors(baseConfig)

        expect(mockObjToFormData).toHaveBeenCalledWith({ name: 'test', file: 'data' })
        expect(result.data).toBe(mockFormData)
      })

      it('should not convert FormData to FormData', () => {
        baseConfig.method = 'post'
        baseConfig.headers['Content-Type'] = 'multipart/form-data'
        const formData = new FormData()
        baseConfig.data = formData

        const result = defaultRequestInterceptors(baseConfig)

        expect(mockObjToFormData).not.toHaveBeenCalled()
        expect(result.data).toBe(formData)
      })
    })

    describe('GET Request Parameter Handling', () => {
      it('should convert params to URL query string for GET requests', () => {
        baseConfig.method = 'get'
        baseConfig.url = '/api/users'
        baseConfig.params = {
          page: 1,
          limit: 10,
          search: 'test user'
        }

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toBe('/api/users?page=1&limit=10&search=test%20user')
        expect(result.params).toEqual({})
      })

      it('should handle empty params for GET requests', () => {
        baseConfig.method = 'get'
        baseConfig.url = '/api/users'
        baseConfig.params = {}

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toBe('/api/users')
        expect(result.params).toEqual({})
      })

      it('should skip null and undefined params', () => {
        baseConfig.method = 'get'
        baseConfig.url = '/api/users'
        baseConfig.params = {
          page: 1,
          search: null,
          filter: undefined,
          status: 'active'
        }

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toBe('/api/users?page=1&status=active')
        expect(result.params).toEqual({})
      })

      it('should handle special characters in params', () => {
        baseConfig.method = 'get'
        baseConfig.url = '/api/search'
        baseConfig.params = {
          q: 'hello world & more',
          symbols: '!@#$%^&*()'
        }

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toContain('q=hello%20world%20%26%20more')
        expect(result.url).toContain('symbols=!%40%23%24%25%5E%26*()')
      })

      it('should not modify params for non-GET requests', () => {
        baseConfig.method = 'post'
        baseConfig.url = '/api/users'
        baseConfig.params = { page: 1, limit: 10 }

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toBe('/api/users')
        expect(result.params).toEqual({ page: 1, limit: 10 })
      })

      it('should handle GET requests without params', () => {
        baseConfig.method = 'get'
        baseConfig.url = '/api/users'
        delete baseConfig.params

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.url).toBe('/api/users')
        expect(result.params).toBeUndefined()
      })
    })

    describe('Header Preservation', () => {
      it('should preserve existing headers', () => {
        baseConfig.headers = {
          'Custom-Header': 'custom-value',
          'X-Request-ID': '12345'
        }

        const result = defaultRequestInterceptors(baseConfig)

        expect(result.headers['Custom-Header']).toBe('custom-value')
        expect(result.headers['X-Request-ID']).toBe('12345')
        expect(result.headers['Content-Type']).toBe('application/json')
      })

      it('should handle case-sensitive headers', () => {
        baseConfig.headers = {
          'content-type': 'text/plain',
          'Content-Type': 'application/json'
        }

        const result = defaultRequestInterceptors(baseConfig)

        // Should keep the explicitly set Content-Type
        expect(result.headers['Content-Type']).toBe('application/json')
        expect(result.headers['content-type']).toBe('text/plain')
      })
    })
  })

  describe('defaultResponseInterceptors', () => {
    let baseResponse: AxiosResponse

    beforeEach(() => {
      baseResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {}
      }
    })

    describe('Blob Response Handling', () => {
      it('should pass through blob responses directly', () => {
        baseResponse.config = { responseType: 'blob' } as InternalAxiosRequestConfig

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse)
      })

      it('should not pass through non-blob responses', () => {
        baseResponse.config = { responseType: 'json' } as InternalAxiosRequestConfig
        baseResponse.data = { code: SUCCESS_CODE, data: 'test' }

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })
    })

    describe('Successful Response Handling', () => {
      it('should return data for 200 responses with SUCCESS_CODE', () => {
        baseResponse.status = 200
        baseResponse.data = { code: SUCCESS_CODE, data: { id: 1, name: 'test' } }

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })

      it('should return data for 201 responses with SUCCESS_CODE', () => {
        baseResponse.status = 201
        baseResponse.data = { code: SUCCESS_CODE, data: { id: 1, name: 'created' } }

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })

      it('should return data for Laravel responses without code field', () => {
        baseResponse.status = 200
        baseResponse.data = { id: 1, name: 'user', email: 'test@example.com' }

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })

      it('should return data for responses with null code', () => {
        baseResponse.status = 200
        baseResponse.data = { code: null, data: 'test' }

        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })
    })

    describe('Error Response Handling', () => {
      it('should show error message and reject for responses with error code', async () => {
        baseResponse.status = 200
        baseResponse.data = { code: 1001, message: 'Custom error message' }

        try {
          await expect(defaultResponseInterceptors(baseResponse)).rejects.toBe(baseResponse.data)
        } catch (error) {
          // Handle any unhandled promise rejections
        }

        expect(mockElMessage.error).toHaveBeenCalledWith('Custom error message')
      })

      it('should use error field as fallback message', async () => {
        baseResponse.status = 200
        baseResponse.data = { code: 1001, error: 'Error field message' }

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toBe(baseResponse.data)
        expect(mockElMessage.error).toHaveBeenCalledWith('Error field message')
      })

      it('should use default message when no specific error message', async () => {
        baseResponse.status = 500
        baseResponse.data = { code: 1001 }

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toBe(baseResponse.data)
        expect(mockElMessage.error).toHaveBeenCalledWith('An error occurred')
      })
    })

    describe('Authentication Error Handling', () => {
      it('should logout user for 401 status', async () => {
        baseResponse.status = 401
        baseResponse.data = { message: 'Unauthorized' }

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toBe(baseResponse.data)
        expect(mockUserStore.logout).toHaveBeenCalled()
        expect(mockElMessage.error).toHaveBeenCalledWith('Unauthorized')
      })

      it('should logout user for response with 401 code', async () => {
        baseResponse.status = 200
        baseResponse.data = { code: 401, message: 'Token expired' }

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toBe(baseResponse.data)
        expect(mockUserStore.logout).toHaveBeenCalled()
        expect(mockElMessage.error).toHaveBeenCalledWith('Token expired')
      })
    })

    describe('Edge Cases', () => {
      it('should handle response without data', async () => {
        baseResponse.data = null
        baseResponse.status = 500

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toBeNull()
        expect(mockElMessage.error).toHaveBeenCalledWith('An error occurred')
      })

      it('should handle response with empty data object', async () => {
        baseResponse.data = {}
        baseResponse.status = 400

        await expect(defaultResponseInterceptors(baseResponse)).rejects.toEqual({})
        expect(mockElMessage.error).toHaveBeenCalledWith('An error occurred')
      })

      it('should handle response with undefined config', () => {
        baseResponse.config = undefined as any

        // Should not throw error for blob check
        const result = defaultResponseInterceptors(baseResponse)

        expect(result).toBe(baseResponse.data)
      })
    })
  })

  describe('Integration Tests', () => {
    it('should work together in a typical request/response cycle', () => {
      // Setup request
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/api/users',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: { name: 'John', email: 'john@example.com' }
      } as InternalAxiosRequestConfig

      mockUserStore.getToken.mockReturnValue('auth-token')
      mockQs.stringify.mockReturnValue('name=John&email=john@example.com')

      // Process request
      const processedRequest = defaultRequestInterceptors(requestConfig)

      // Verify request processing
      expect(processedRequest.headers['Authorization']).toBe('Bearer auth-token')
      expect(processedRequest.data).toBe('name=John&email=john@example.com')

      // Setup response
      const response: AxiosResponse = {
        data: { code: SUCCESS_CODE, data: { id: 1, name: 'John' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: processedRequest,
        request: {}
      }

      // Process response
      const processedResponse = defaultResponseInterceptors(response)

      // Verify response processing
      expect(processedResponse).toEqual({ code: SUCCESS_CODE, data: { id: 1, name: 'John' } })
    })
  })
})
