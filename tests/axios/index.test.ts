import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from '../../src/axios/index'
import { CONTENT_TYPE } from '../../src/constants'

// Mock external dependencies
vi.mock('../../src/axios/service', () => ({
  default: {
    request: vi.fn(),
    cancelRequest: vi.fn(),
    cancelAllRequest: vi.fn()
  }
}))

vi.mock('../../src/store/modules/user', () => ({
  useUserStoreWithOut: vi.fn(() => ({
    getToken: vi.fn(),
    getTokenKey: 'Authorization'
  }))
}))

import service from '../../src/axios/service'
import { useUserStoreWithOut } from '../../src/store/modules/user'

const mockService = vi.mocked(service)
const mockUseUserStoreWithOut = vi.mocked(useUserStoreWithOut)

describe('Axios Index (Request Client)', () => {
  let mockUserStore: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockUserStore = {
      getToken: vi.fn().mockReturnValue('test-token'),
      getTokenKey: 'Authorization'
    }
    mockUseUserStoreWithOut.mockReturnValue(mockUserStore)

    mockService.request.mockResolvedValue({ data: 'success', status: 200 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET Requests', () => {
    it('should make GET request with basic configuration', async () => {
      const config = {
        url: '/api/users'
      }

      await request.get(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users',
          method: 'get',
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token'
          })
        })
      )
    })

    it('should make GET request with parameters', async () => {
      const config = {
        url: '/api/users',
        params: { page: 1, limit: 10 }
      }

      await request.get(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users',
          method: 'get',
          params: { page: 1, limit: 10 },
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token'
          })
        })
      )
    })

    it('should make GET request with custom headers', async () => {
      const config = {
        url: '/api/users',
        headers: {
          'Custom-Header': 'custom-value',
          'X-Request-ID': '12345'
        }
      }

      await request.get(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users',
          method: 'get',
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token',
            'Custom-Header': 'custom-value',
            'X-Request-ID': '12345'
          })
        })
      )
    })

    it('should override default headers with custom headers', async () => {
      const config = {
        url: '/api/users',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: 'Bearer custom-token'
        }
      }

      await request.get(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'text/plain',
            Authorization: 'Bearer custom-token'
          })
        })
      )
    })

    it('should handle responseType configuration', async () => {
      const config = {
        url: '/api/download',
        responseType: 'blob' as const
      }

      await request.get(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/download',
          method: 'get',
          responseType: 'blob'
        })
      )
    })

    it('should return typed response', async () => {
      interface User {
        id: number
        name: string
      }

      mockService.request.mockResolvedValue({
        data: [{ id: 1, name: 'John' }],
        status: 200
      })

      const result = await request.get<User[]>({ url: '/api/users' })

      expect(result.data).toEqual([{ id: 1, name: 'John' }])
      expect(result.status).toBe(200)
    })
  })

  describe('POST Requests', () => {
    it('should make POST request with data', async () => {
      const config = {
        url: '/api/users',
        data: { name: 'John', email: 'john@example.com' }
      }

      await request.post(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users',
          method: 'post',
          data: { name: 'John', email: 'john@example.com' },
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token'
          })
        })
      )
    })

    it('should make POST request with FormData', async () => {
      const formData = new FormData()
      formData.append('name', 'John')
      formData.append('file', new Blob(['test']))

      const config = {
        url: '/api/upload',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      await request.post(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/upload',
          method: 'post',
          data: formData,
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
            Authorization: 'test-token'
          })
        })
      )
    })

    it('should handle URL-encoded data', async () => {
      const config = {
        url: '/api/form',
        data: { username: 'test', password: 'secret' },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      await request.post(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/form',
          method: 'post',
          data: { username: 'test', password: 'secret' },
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'test-token'
          })
        })
      )
    })
  })

  describe('PUT Requests', () => {
    it('should make PUT request with data', async () => {
      const config = {
        url: '/api/users/1',
        data: { name: 'Jane', email: 'jane@example.com' }
      }

      await request.put(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users/1',
          method: 'put',
          data: { name: 'Jane', email: 'jane@example.com' },
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token'
          })
        })
      )
    })
  })

  describe('DELETE Requests', () => {
    it('should make DELETE request', async () => {
      const config = {
        url: '/api/users/1'
      }

      await request.delete(config)

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users/1',
          method: 'delete',
          headers: expect.objectContaining({
            'Content-Type': CONTENT_TYPE,
            Authorization: 'test-token'
          })
        })
      )
    })
  })

  describe('Authentication Header Handling', () => {
    it('should use custom token key when provided', async () => {
      mockUserStore.getTokenKey = 'X-Auth-Token'

      await request.get({ url: '/api/test' })

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': 'test-token'
          })
        })
      )
    })

    it('should handle null token key', async () => {
      mockUserStore.getTokenKey = null

      await request.get({ url: '/api/test' })

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'test-token'
          })
        })
      )
    })

    it('should handle null token', async () => {
      mockUserStore.getToken.mockReturnValue(null)

      await request.get({ url: '/api/test' })

      expect(mockService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: ''
          })
        })
      )
    })
  })

  describe('Request Cancellation Methods', () => {
    it('should cancel single request', () => {
      request.cancelRequest('/api/users')
      expect(mockService.cancelRequest).toHaveBeenCalledWith('/api/users')
    })

    it('should cancel multiple requests', () => {
      const urls = ['/api/users', '/api/posts']
      request.cancelRequest(urls)
      expect(mockService.cancelRequest).toHaveBeenCalledWith(urls)
    })

    it('should cancel all requests', () => {
      request.cancelAllRequest()
      expect(mockService.cancelAllRequest).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should propagate service errors', async () => {
      const error = new Error('Network error')
      mockService.request.mockRejectedValue(error)

      await expect(request.get({ url: '/api/test' })).rejects.toBe(error)
    })
  })

  describe('Type Safety', () => {
    it('should maintain type safety for generic responses', async () => {
      interface ApiResponse<T> {
        data: T
        status: number
        message: string
      }

      interface User {
        id: number
        name: string
        email: string
      }

      mockService.request.mockResolvedValue({
        data: { id: 1, name: 'John', email: 'john@example.com' },
        status: 200,
        message: 'Success'
      })

      const result = await request.get<ApiResponse<User>>({ url: '/api/user/1' })

      // TypeScript should infer the correct types
      expect(typeof result.data.id).toBe('number')
      expect(typeof result.data.name).toBe('string')
      expect(typeof result.data.email).toBe('string')
    })
  })
})
