import router from '@/router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getRawRoute } from '@/utils/routerHelper'
import { defineStore } from 'pinia'
import { store } from '../index'
import { findIndex } from '@/utils'
import { useUserStoreWithOut } from './user'

/**
 * Tags View state interface defining the structure of navigation tab data
 * @interface TagsViewState
 * @property {RouteLocationNormalizedLoaded[]} visitedViews - Array of visited page tabs
 * @property {Set<string>} cachedViews - Set of cached view names for keep-alive functionality
 * @property {RouteLocationNormalizedLoaded | undefined} selectedTag - Currently selected navigation tab
 */
export interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[]
  cachedViews: Set<string>
  selectedTag?: RouteLocationNormalizedLoaded
}

/**
 * Tags View Store - Manages navigation tabs and view caching
 *
 * This store handles:
 * - Navigation tab management (visited pages)
 * - View caching for keep-alive functionality
 * - Tab selection and navigation
 * - Tab operations (add, delete, clear)
 *
 * @example
 * ```typescript
 * // Basic usage
 * const tagsViewStore = useTagsViewStore()
 *
 * // Add a new visited view
 * tagsViewStore.addView(route)
 *
 * // Get all visited views
 * const views = tagsViewStore.getVisitedViews
 *
 * // Clear all views
 * tagsViewStore.delAllViews()
 * ```
 */
export const useTagsViewStore = defineStore('tagsView', {
  /**
   * Initial state configuration for the tags view store
   * @returns {TagsViewState} Initial tags view state with empty arrays and sets
   */
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: new Set(),
    selectedTag: undefined
  }),

  /**
   * Computed properties (getters) for accessing tags view state
   */
  getters: {
    /**
     * Get all visited page tabs
     * @returns {RouteLocationNormalizedLoaded[]} Array of visited page information
     */
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews
    },

    /**
     * Get cached view names for keep-alive functionality
     * @returns {string[]} Array of cached view names
     */
    getCachedViews(): string[] {
      return Array.from(this.cachedViews)
    },

    /**
     * Get currently selected navigation tab
     * @returns {RouteLocationNormalizedLoaded | undefined} Selected tab or undefined
     */
    getSelectedTag(): RouteLocationNormalizedLoaded | undefined {
      return this.selectedTag
    }
  },
  /**
   * Actions for modifying tags view state and performing tab operations
   */
  actions: {
    /**
     * Add a new view to both visited views and cached views
     * @param {RouteLocationNormalizedLoaded} view - Route information to add
     *
     * This action:
     * 1. Adds the view to visited views (navigation tabs)
     * 2. Updates the cached views for keep-alive functionality
     */
    addView(view: RouteLocationNormalizedLoaded): void {
      this.addVisitedView(view)
      this.addCachedView()
    },

    /**
     * Add a new visited view (navigation tab)
     * @param {RouteLocationNormalizedLoaded} view - Route information to add
     *
     * This action:
     * 1. Checks if view already exists (prevents duplicates)
     * 2. Respects noTagsView meta setting
     * 3. Adds view with proper title formatting
     */
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      if (view.meta?.noTagsView) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name'
        })
      )
    },

    /**
     * Update cached views based on current visited views
     *
     * This action:
     * 1. Iterates through all visited views
     * 2. Checks noCache meta setting for each view
     * 3. Builds a new cache set
     * 4. Only updates if cache has actually changed
     */
    addCachedView() {
      const cacheMap: Set<string> = new Set()
      for (const v of this.visitedViews) {
        const item = getRawRoute(v)
        const needCache = !item?.meta?.noCache
        if (!needCache) {
          continue
        }
        const name = item.name as string
        cacheMap.add(name)
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return
      this.cachedViews = cacheMap
    },
    /**
     * Delete a specific view from both visited and cached views
     * @param {RouteLocationNormalizedLoaded} view - Route to delete
     *
     * This action:
     * 1. Removes the view from visited views
     * 2. Updates cached views accordingly
     */
    delView(view: RouteLocationNormalizedLoaded) {
      this.delVisitedView(view)
      this.addCachedView()
    },

    /**
     * Delete a specific visited view (navigation tab)
     * @param {RouteLocationNormalizedLoaded} view - Route to delete
     *
     * This action finds and removes the view by path matching
     */
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },

    /**
     * Delete the current route from cached views
     *
     * This action:
     * 1. Gets the current route
     * 2. Finds and removes it from cached views
     * 3. Useful for manual cache invalidation
     */
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex<string>(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },

    /**
     * Delete all views and update cache accordingly
     *
     * This action:
     * 1. Clears all visited views (except affix tags)
     * 2. Updates cached views to match
     */
    delAllViews() {
      this.delAllVisitedViews()
      this.addCachedView()
    },

    /**
     * Delete all visited views except affix tags
     *
     * This action:
     * 1. Preserves affix tags (permanently visible tabs)
     * 2. Clears all other visited views
     * 3. Respects user authentication state
     */
    delAllVisitedViews() {
      const userStore = useUserStoreWithOut()

      // const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
      this.visitedViews = userStore.getUserInfo
        ? this.visitedViews.filter((tag) => tag?.meta?.affix)
        : []
    },
    /**
     * Delete all other views except the specified one and affix tags
     * @param {RouteLocationNormalizedLoaded} view - Route to preserve
     *
     * This action:
     * 1. Keeps the specified view and affix tags
     * 2. Removes all other visited views
     * 3. Updates cached views accordingly
     */
    delOthersViews(view: RouteLocationNormalizedLoaded) {
      this.delOthersVisitedViews(view)
      this.addCachedView()
    },

    /**
     * Delete all other visited views except the specified one and affix tags
     * @param {RouteLocationNormalizedLoaded} view - Route to preserve
     *
     * This action filters visited views to keep only:
     * - The specified view
     * - Affix tags (permanently visible)
     */
    delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v?.meta?.affix || v.path === view.path
      })
    },

    /**
     * Delete all views to the left of the specified view
     * @param {RouteLocationNormalizedLoaded} view - Reference view
     *
     * This action:
     * 1. Finds the index of the specified view
     * 2. Removes all views to the left (lower indices)
     * 3. Preserves affix tags and the specified view
     * 4. Updates cached views
     */
    delLeftViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i > index
        })
        this.addCachedView()
      }
    },

    /**
     * Delete all views to the right of the specified view
     * @param {RouteLocationNormalizedLoaded} view - Reference view
     *
     * This action:
     * 1. Finds the index of the specified view
     * 2. Removes all views to the right (higher indices)
     * 3. Preserves affix tags and the specified view
     * 4. Updates cached views
     */
    delRightViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i < index
        })
        this.addCachedView()
      }
    },

    /**
     * Update a visited view with new information
     * @param {RouteLocationNormalizedLoaded} view - Updated route information
     *
     * This action finds and updates the matching view by path
     */
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },

    /**
     * Set the currently selected navigation tag
     * @param {RouteLocationNormalizedLoaded} tag - Tag to select
     */
    setSelectedTag(tag: RouteLocationNormalizedLoaded) {
      this.selectedTag = tag
    },

    /**
     * Update the title of a specific visited view
     * @param {string} title - New title to set
     * @param {string} path - Path of the view to update (defaults to selected tag)
     *
     * This action:
     * 1. Finds the view by path (or uses selected tag path)
     * 2. Updates the meta title property
     */
    setTitle(title: string, path?: string) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title
          break
        }
      }
    }
  },
  persist: false
})

/**
 * Convenience function to use the tags view store outside of Vue components
 *
 * This function provides access to the tags view store in non-reactive contexts
 * such as utility functions, API interceptors, or other stores.
 *
 * @returns {ReturnType<typeof useTagsViewStore>} Tags view store instance
 *
 * @example
 * ```typescript
 * // In a utility function
 * function clearAllTabs() {
 *   const tagsViewStore = useTagsViewStoreWithOut()
 *   tagsViewStore.delAllViews()
 * }
 *
 * // In another store
 * const tagsViewStore = useTagsViewStoreWithOut()
 * tagsViewStore.addView(currentRoute)
 * ```
 */
export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store)
}
