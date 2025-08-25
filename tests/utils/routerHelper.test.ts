import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  Layout,
  getParentLayout,
  getRawRoute,
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  pathResolve,
  flatMultiLevelRoutes
} from '../../src/utils/routerHelper'

// Mock modules import
vi.mock('../../src/views/**/*.{vue,tsx}', () => ({
  default: () => import('../../src/layout/Layout.vue')
}))

// Mock lodash-es
vi.mock('lodash-es', () => ({
  omit: vi.fn((obj, keys) => {
    const result = { ...obj }
    keys.forEach((key) => delete result[key])
    return result
  }),
  cloneDeep: vi.fn((obj) => JSON.parse(JSON.stringify(obj)))
}))

describe('Router Helper Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout', () => {
    it('should return a function that imports Layout component', () => {
      const layoutFunction = Layout
      expect(typeof layoutFunction).toBe('function')
    })
  })

  describe('getParentLayout', () => {
    it('should return a function that resolves to ParentLayout object', async () => {
      const parentLayoutFunction = getParentLayout()
      expect(typeof parentLayoutFunction).toBe('function')

      const result = await parentLayoutFunction()
      expect(result).toEqual({ name: 'ParentLayout' })
    })
  })

  describe('getRawRoute', () => {
    it('should return route without matched property modifications', () => {
      const mockRoute = {
        path: '/test',
        name: 'Test',
        params: {},
        query: {},
        matched: [
          {
            meta: { title: 'Test' },
            name: 'TestRoute',
            path: '/test',
            components: {},
            redirect: undefined
          }
        ],
        meta: {},
        fullPath: '/test'
      } as any

      const result = getRawRoute(mockRoute)

      expect(result.path).toBe('/test')
      expect(result.name).toBe('Test')
      expect(result.matched).toHaveLength(1)
      expect(result.matched[0]).toEqual({
        meta: { title: 'Test' },
        name: 'TestRoute',
        path: '/test'
      })
    })

    it('should handle route without matched property', () => {
      const mockRoute = {
        path: '/test',
        name: 'Test',
        params: {},
        query: {},
        meta: {},
        fullPath: '/test'
      } as any

      const result = getRawRoute(mockRoute)

      expect(result.matched).toBeUndefined()
    })

    it('should return route as-is if null or undefined', () => {
      expect(getRawRoute(null as any)).toBeNull()
      expect(getRawRoute(undefined as any)).toBeUndefined()
    })
  })

  describe('generateRoutesByFrontEnd', () => {
    const mockRoutes = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { title: 'Dashboard' },
        children: [
          {
            path: 'analytics',
            name: 'Analytics',
            meta: { title: 'Analytics' }
          }
        ]
      },
      {
        path: '/settings',
        name: 'Settings',
        meta: { title: 'Settings', hidden: true }
      },
      {
        path: '/profile',
        name: 'Profile',
        meta: { title: 'Profile', hidden: true, canTo: true }
      }
    ] as any[]

    it('should generate routes based on keys', () => {
      const keys = ['/dashboard', '/profile']
      const result = generateRoutesByFrontEnd(mockRoutes, keys)

      expect(result).toHaveLength(2)
      expect(result[0].path).toBe('/dashboard')
      expect(result[1].path).toBe('/profile')
    })

    it('should skip hidden routes without canTo flag', () => {
      const keys = ['/dashboard', '/settings', '/profile']
      const result = generateRoutesByFrontEnd(mockRoutes, keys)

      expect(result).toHaveLength(2)
      expect(result.find((r) => r.path === '/settings')).toBeUndefined()
      expect(result.find((r) => r.path === '/profile')).toBeDefined()
    })

    it('should handle single child routes', () => {
      const routeWithSingleChild = [
        {
          path: '/parent',
          name: 'Parent',
          meta: {},
          children: [
            {
              path: 'child',
              name: 'Child',
              meta: { title: 'Child' }
            }
          ]
        }
      ] as any[]

      const keys = ['/parent/child']
      const result = generateRoutesByFrontEnd(routeWithSingleChild, keys)

      expect(result).toHaveLength(1)
      expect(result[0].children).toHaveLength(1)
    })

    it('should handle external URLs', () => {
      const routeWithUrl = [
        {
          path: '/external',
          name: 'External',
          meta: {},
          children: [
            {
              path: 'https://example.com',
              name: 'ExternalLink',
              meta: { title: 'External Link' }
            }
          ]
        }
      ] as any[]

      const keys = ['https://example.com']
      const result = generateRoutesByFrontEnd(routeWithUrl, keys)

      expect(result).toHaveLength(1)
    })

    it('should handle followRoute meta property', () => {
      const routeWithFollowRoute = [
        {
          path: '/follow',
          name: 'Follow',
          meta: { followRoute: '/target' }
        }
      ] as any[]

      const keys = ['/target']
      const result = generateRoutesByFrontEnd(routeWithFollowRoute, keys)

      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/follow')
    })

    it('should handle alwaysShow meta property', () => {
      const routeWithAlwaysShow = [
        {
          path: '/parent',
          name: 'Parent',
          meta: { alwaysShow: true },
          children: [
            {
              path: 'child',
              name: 'Child',
              meta: { title: 'Child' }
            }
          ]
        }
      ] as any[]

      const keys = ['/parent']
      const result = generateRoutesByFrontEnd(routeWithAlwaysShow, keys)

      expect(result).toHaveLength(1)
    })
  })

  describe('generateRoutesByServer', () => {
    it('should generate routes from server data', () => {
      const serverRoutes = [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: 'views/Dashboard/index',
          meta: { title: 'Dashboard' }
        },
        {
          path: '/layout',
          name: 'Layout',
          component: '#',
          meta: { title: 'Layout' }
        },
        {
          path: '/parent',
          name: 'Parent',
          component: '##',
          meta: { title: 'Parent Layout' }
        }
      ] as any[]

      const result = generateRoutesByServer(serverRoutes)

      expect(result).toHaveLength(3)
      expect(result[0].path).toBe('/dashboard')
      expect(result[1].component).toBe(Layout)
      expect(typeof result[2].component).toBe('function')
    })

    it('should handle nested routes', () => {
      const serverRoutes = [
        {
          path: '/parent',
          name: 'Parent',
          component: '#',
          children: [
            {
              path: 'child',
              name: 'Child',
              component: 'views/Child/index'
            }
          ]
        }
      ] as any[]

      const result = generateRoutesByServer(serverRoutes)

      expect(result).toHaveLength(1)
      expect(result[0].children).toHaveLength(1)
      expect(result[0].children[0].path).toBe('child')
    })

    it('should handle missing component files', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const serverRoutes = [
        {
          path: '/missing',
          name: 'Missing',
          component: 'views/NonExistent/index',
          meta: { title: 'Missing' }
        }
      ] as any[]

      const result = generateRoutesByServer(serverRoutes)

      expect(result).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('未找到views/NonExistent/index.vue文件')
      )

      consoleSpy.mockRestore()
    })

    it('should handle routes without component', () => {
      const serverRoutes = [
        {
          path: '/no-component',
          name: 'NoComponent',
          meta: { title: 'No Component' }
        }
      ] as any[]

      const result = generateRoutesByServer(serverRoutes)

      expect(result).toHaveLength(1)
      expect(result[0].component).toBeUndefined()
    })
  })

  describe('pathResolve', () => {
    it('should resolve relative paths', () => {
      expect(pathResolve('/parent', 'child')).toBe('/parent/child')
      expect(pathResolve('/parent', '/child')).toBe('/parent/child')
      expect(pathResolve('/parent/', 'child')).toBe('/parent/child')
      expect(pathResolve('/parent', '')).toBe('/parent')
    })

    it('should handle absolute child paths', () => {
      expect(pathResolve('/parent', '/child')).toBe('/parent/child')
    })

    it('should return URL as-is for external URLs', () => {
      expect(pathResolve('/parent', 'https://example.com')).toBe('https://example.com')
      expect(pathResolve('/parent', 'http://test.com')).toBe('http://test.com')
    })

    it('should handle empty paths', () => {
      expect(pathResolve('', 'child')).toBe('/child')
      expect(pathResolve('/parent', '')).toBe('/parent')
    })

    it('should normalize double slashes', () => {
      expect(pathResolve('/parent/', '/child')).toBe('/parent/child')
      expect(pathResolve('/parent//', '//child')).toBe('/parent/child')
    })

    it('should handle root path', () => {
      expect(pathResolve('/', 'child')).toBe('/child')
      expect(pathResolve('/', '/child')).toBe('/child')
    })
  })

  describe('flatMultiLevelRoutes', () => {
    it('should flatten multi-level routes', () => {
      const multiLevelRoutes = [
        {
          path: '/level1',
          name: 'Level1',
          children: [
            {
              path: 'level2',
              name: 'Level2',
              children: [
                {
                  path: 'level3',
                  name: 'Level3',
                  children: []
                }
              ]
            }
          ]
        }
      ] as any[]

      const result = flatMultiLevelRoutes(multiLevelRoutes)

      expect(result).toHaveLength(1)
      // The flattening should promote nested routes to the same level
      expect(result[0].children).toBeDefined()
    })

    it('should handle routes without children', () => {
      const simpleRoutes = [
        {
          path: '/simple',
          name: 'Simple'
        }
      ] as any[]

      const result = flatMultiLevelRoutes(simpleRoutes)

      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/simple')
    })

    it('should handle two-level routes (no flattening needed)', () => {
      const twoLevelRoutes = [
        {
          path: '/parent',
          name: 'Parent',
          children: [
            {
              path: 'child1',
              name: 'Child1',
              children: []
            },
            {
              path: 'child2',
              name: 'Child2',
              children: []
            }
          ]
        }
      ] as any[]

      const result = flatMultiLevelRoutes(twoLevelRoutes)

      expect(result).toHaveLength(1)
      expect(result[0].children).toHaveLength(2)
    })

    it('should handle mixed route structures', () => {
      const mixedRoutes = [
        {
          path: '/simple',
          name: 'Simple'
        },
        {
          path: '/parent',
          name: 'Parent',
          children: [
            {
              path: 'child',
              name: 'Child',
              children: [
                {
                  path: 'grandchild',
                  name: 'Grandchild',
                  children: []
                }
              ]
            }
          ]
        }
      ] as any[]

      const result = flatMultiLevelRoutes(mixedRoutes)

      expect(result).toHaveLength(2)
      expect(result[0].path).toBe('/simple')
      expect(result[1].children).toBeDefined()
    })

    it('should not modify original routes', () => {
      const originalRoutes = [
        {
          path: '/test',
          name: 'Test',
          children: [
            {
              path: 'child',
              name: 'Child',
              children: [
                {
                  path: 'grandchild',
                  name: 'Grandchild',
                  children: []
                }
              ]
            }
          ]
        }
      ] as any[]

      const originalStructure = JSON.stringify(originalRoutes)
      flatMultiLevelRoutes(originalRoutes)

      // Original should remain unchanged due to cloneDeep
      expect(JSON.stringify(originalRoutes)).toBe(originalStructure)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined routes in generateRoutesByFrontEnd', () => {
      expect(generateRoutesByFrontEnd([], [])).toEqual([])
      expect(generateRoutesByFrontEnd([], ['key'])).toEqual([])
    })

    it('should handle null/undefined routes in generateRoutesByServer', () => {
      expect(generateRoutesByServer([])).toEqual([])
    })

    it('should handle complex path resolutions', () => {
      expect(pathResolve('/a/b/c', '../d')).toBe('/a/b/c/../d')
      expect(pathResolve('/a/b/c', './d')).toBe('/a/b/c/./d')
    })

    it('should handle routes with complex meta properties', () => {
      const complexRoutes = [
        {
          path: '/complex',
          name: 'Complex',
          meta: {
            title: 'Complex Route',
            requiresAuth: true,
            permissions: ['read', 'write'],
            nested: {
              deep: {
                value: 'test'
              }
            }
          }
        }
      ] as any[]

      const keys = ['/complex']
      const result = generateRoutesByFrontEnd(complexRoutes, keys)

      expect(result).toHaveLength(1)
      expect(result[0].meta.nested.deep.value).toBe('test')
    })
  })
})
