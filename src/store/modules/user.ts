import { defineStore } from 'pinia'
import { store } from '../index'
import { UserLoginType, UserType } from '@/api/login/types'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

/**
 * User state interface defining the structure of user-related data
 * @interface UserState
 * @property {UserType | undefined} userInfo - Current user information object
 * @property {string} tokenKey - HTTP header key for authentication token (default: 'Authorization')
 * @property {string} token - JWT or authentication token string
 * @property {string[] | AppCustomRouteRecordRaw[] | undefined} roleRouters - User's accessible routes based on role permissions
 * @property {boolean} rememberMe - Whether to remember user login credentials
 * @property {UserLoginType | undefined} loginInfo - User's login credentials and preferences
 */
interface UserState {
  userInfo?: UserType
  tokenKey: string
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType
}

/**
 * User Store - Manages user authentication, authorization, and session state
 * 
 * This store handles:
 * - User authentication tokens and credentials
 * - User profile information
 * - Role-based route permissions
 * - Login/logout functionality
 * - Session persistence across page reloads
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const userStore = useUserStore()
 * 
 * // Set user token
 * userStore.setToken('jwt-token-here')
 * 
 * // Get user info
 * const userInfo = userStore.getUserInfo
 * 
 * // Logout user
 * userStore.logout()
 * ```
 */
export const useUserStore = defineStore('user', {
  /**
   * Initial state configuration for the user store
   * @returns {UserState} Initial user state with default values
   */
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined
    }
  },
  
  /**
   * Computed properties (getters) for accessing user state
   */
  getters: {
    /**
     * Get the HTTP header key used for authentication
     * @returns {string} Token header key (default: 'Authorization')
     */
    getTokenKey(): string {
      return this.tokenKey
    },
    
    /**
     * Get the current authentication token
     * @returns {string} JWT or authentication token
     */
    getToken(): string {
      return this.token
    },
    
    /**
     * Get the current user information
     * @returns {UserType | undefined} User profile data or undefined if not logged in
     */
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    
    /**
     * Get the user's accessible routes based on role permissions
     * @returns {string[] | AppCustomRouteRecordRaw[] | undefined} Array of route identifiers or route objects
     */
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    
    /**
     * Get the remember me preference setting
     * @returns {boolean} Whether to remember login credentials
     */
    getRememberMe(): boolean {
      return this.rememberMe
    },
    
    /**
     * Get the user's login credentials and preferences
     * @returns {UserLoginType | undefined} Login form data or undefined
     */
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    }
  },
  
  /**
   * Actions for modifying user state and performing user-related operations
   */
  actions: {
    /**
     * Set the HTTP header key for authentication token
     * @param {string} tokenKey - Header key name (e.g., 'Authorization', 'X-Auth-Token')
     */
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    
    /**
     * Set the authentication token
     * @param {string} token - JWT or authentication token string
     */
    setToken(token: string) {
      this.token = token
    },
    
    /**
     * Set the current user information
     * @param {UserType | undefined} userInfo - User profile data or undefined to clear
     */
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    
    /**
     * Set the user's accessible routes based on role permissions
     * @param {string[] | AppCustomRouteRecordRaw[]} roleRouters - Array of route identifiers or route objects
     */
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    
    /**
     * Show logout confirmation dialog and handle logout process
     * 
     * This action:
     * 1. Displays a confirmation dialog using Element Plus
     * 2. Calls the logout API if confirmed
     * 3. Resets the store state on successful logout
     * 4. Handles errors gracefully
     * 
     * @example
     * ```typescript
     * // Show logout confirmation
     * userStore.logoutConfirm()
     * ```
     */
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {})
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    
    /**
     * Reset the user store to initial state and redirect to login
     * 
     * This action:
     * 1. Clears all tags view history
     * 2. Resets authentication token
     * 3. Clears user information
     * 4. Clears role-based routes
     * 5. Redirects to login page
     * 
     * @example
     * ```typescript
     * // Force logout and redirect to login
     * userStore.reset()
     * ```
     */
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    
    /**
     * Logout user without confirmation dialog
     * 
     * This is a convenience method that directly calls reset()
     * without showing a confirmation dialog.
     * 
     * @example
     * ```typescript
     * // Immediate logout
     * userStore.logout()
     * ```
     */
    logout() {
      this.reset()
    },
    
    /**
     * Set the remember me preference
     * @param {boolean} rememberMe - Whether to remember login credentials
     */
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    
    /**
     * Set the user's login credentials and preferences
     * @param {UserLoginType | undefined} loginInfo - Login form data or undefined to clear
     */
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    }
  },
  
  /**
   * Enable persistence for this store
   * User state will be automatically saved to localStorage and restored on page reload
   */
  persist: true
})

/**
 * Convenience function to use the user store outside of Vue components
 * 
 * This function provides access to the user store in non-reactive contexts
 * such as utility functions, API interceptors, or other stores.
 * 
 * @returns {ReturnType<typeof useUserStore>} User store instance
 * 
 * @example
 * ```typescript
 * // In a utility function
 * function checkAuth() {
 *   const userStore = useUserStoreWithOut()
 *   return !!userStore.getToken
 * }
 * 
 * // In an API interceptor
 * const userStore = useUserStoreWithOut()
 * if (userStore.getToken) {
 *   config.headers[userStore.getTokenKey] = userStore.getToken
 * }
 * ```
 */
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
