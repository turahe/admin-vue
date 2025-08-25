import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

/**
 * Permission state interface defining the structure of routing and access control data
 * @interface PermissionState
 * @property {AppRouteRecordRaw[]} routers - All available routes including constant and dynamic routes
 * @property {AppRouteRecordRaw[]} addRouters - Dynamically added routes based on user permissions
 * @property {boolean} isAddRouters - Whether dynamic routes have been added
 * @property {AppRouteRecordRaw[]} menuTabRouters - Routes used for menu tab navigation
 */
export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

/**
 * Permission Store - Manages routing permissions and dynamic route generation
 * 
 * This store handles:
 * - Dynamic route generation based on user permissions
 * - Route filtering and access control
 * - Menu tab navigation routes
 * - Route state management
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const permissionStore = usePermissionStore()
 * 
 * // Generate routes based on server permissions
 * await permissionStore.generateRoutes('server', userPermissions)
 * 
 * // Get available routes
 * const routes = permissionStore.getRouters
 * ```
 */
export const usePermissionStore = defineStore('permission', {
  /**
   * Initial state configuration for the permission store
   * @returns {PermissionState} Initial permission state with empty route arrays
   */
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  
  /**
   * Computed properties (getters) for accessing permission state
   */
  getters: {
    /**
     * Get all available routes including constant and dynamic routes
     * @returns {AppRouteRecordRaw[]} Complete route configuration
     */
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    
    /**
     * Get dynamically added routes with flattened multi-level structure
     * @returns {AppRouteRecordRaw[]} Processed dynamic routes
     */
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    
    /**
     * Get whether dynamic routes have been added
     * @returns {boolean} Dynamic routes addition status
     */
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    
    /**
     * Get routes used for menu tab navigation
     * @returns {AppRouteRecordRaw[]} Menu tab route configuration
     */
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  /**
   * Actions for modifying permission state and performing route operations
   */
  actions: {
    /**
     * Generate routes based on specified type and permissions
     * @param {'server' | 'frontEnd' | 'static'} type - Route generation strategy
     * @param {AppCustomRouteRecordRaw[] | string[]} routers - Permission data or route identifiers
     * @returns {Promise<unknown>} Promise that resolves when routes are generated
     * 
     * This action supports three generation strategies:
     * - 'server': Generate routes based on server-provided permission data
     * - 'frontEnd': Filter routes based on frontend permission logic
     * - 'static': Use static route configuration without filtering
     * 
     * The generated routes include:
     * 1. Permission-filtered routes based on user access rights
     * 2. 404 catch-all route at the end
     * 3. Combined constant and dynamic routes
     */
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // Simulate backend menu filtering
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // Simulate frontend menu filtering
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // Directly read static route table
          routerMap = cloneDeep(asyncRouterMap)
        }
        // Dynamic routes, 404 must be placed at the end
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // All routes for menu rendering
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    
    /**
     * Set the dynamic routes addition status
     * @param {boolean} state - Whether dynamic routes have been added
     */
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    
    /**
     * Set menu tab navigation routes
     * @param {AppRouteRecordRaw[]} routers - Routes to use for menu tab navigation
     */
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: [
    {
      pick: ['routers'],
      storage: localStorage
    },
    {
      pick: ['addRouters'],
      storage: localStorage
    },
    {
      pick: ['menuTabRouters'],
      storage: localStorage
    }
  ]
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
