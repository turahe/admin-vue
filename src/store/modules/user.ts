import { defineStore } from 'pinia'
import { store } from '../index'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useTagsViewStore } from './tagsView'
import { logoutApi, loginApi, registerApi, getUserProfileApi, refreshTokenApi } from '@/api/auth'
import type { LoginRequest, RegisterRequest, UserProfile } from '@/api/auth'
import router from '@/router'
import { decodeJWT } from '@/utils/jwt'

interface UserState {
  userInfo?: UserProfile
  tokenKey: string
  token: string
  refreshToken: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: LoginRequest
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    console.log('Initializing user store state')
    const initialState = {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      refreshToken: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined
    }
    console.log('User store initial state:', initialState)
    return initialState
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getUserInfo(): UserProfile | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): LoginRequest | undefined {
      return this.loginInfo
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      console.log('Setting token:', token)
      this.token = token
      console.log('Token after setting:', this.token)
    },
    setRefreshToken(refreshToken: string) {
      console.log('Setting refresh token:', refreshToken)
      this.refreshToken = refreshToken
      console.log('Refresh token after setting:', this.refreshToken)
    },
    setUserInfo(userInfo?: UserProfile) {
      console.log('Setting user info:', userInfo)
      this.userInfo = userInfo
      console.log('User info after setting:', this.userInfo)
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await logoutApi().catch(() => {})
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setRefreshToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: LoginRequest | undefined) {
      this.loginInfo = loginInfo
    },

    // Login action
    async login(loginData: LoginRequest) {
      try {
        console.log('Login attempt with data:', loginData)
        const res = await loginApi(loginData)
        console.log('Login API response:', res)
        console.log('Response type:', typeof res)
        console.log('Response keys:', Object.keys(res || {}))
        console.log('Response data:', res?.data)
        // Handle both direct response and nested data response
        const responseData = res?.data || res
        console.log('Processed response data:', responseData)
        if (responseData && responseData.access_token) {
          const { access_token, refresh_token } = responseData
          this.setToken(access_token)
          this.setRefreshToken(refresh_token)

          // Extract user info from JWT token
          const tokenPayload = decodeJWT(access_token)
          console.log('JWT token payload:', tokenPayload)

          if (tokenPayload) {
            const userInfo = {
              id: tokenPayload.user_id,
              username: tokenPayload.username,
              email: tokenPayload.email,
              phone: null, // Phone not included in token
              avatar: `https://ui-avatars.com/api/?name=${tokenPayload.username.charAt(0)}&color=7F9CF5&background=EBF4FF`,
              email_verified_at: null,
              phone_verified_at: null,
              deleted_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            console.log('Setting user info:', userInfo)
            this.setUserInfo(userInfo)
            console.log('User info after setting:', this.userInfo)
          } else {
            // Fallback if token decoding fails
            const tempUserInfo = {
              id: 'temp-id',
              username: 'Loading...',
              email: 'Loading...',
              phone: null,
              avatar: `https://ui-avatars.com/api/?name=U&color=7F9CF5&background=EBF4FF`,
              email_verified_at: null,
              phone_verified_at: null,
              deleted_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            this.setUserInfo(tempUserInfo)
          }

          return { success: true, data: responseData }
        }
        return { success: false, message: 'Login failed' }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          message: error?.response?.data?.message || 'Login failed'
        }
      }
    },

    // Register action
    async register(registerData: RegisterRequest) {
      try {
        const res = await registerApi(registerData)
        if (res?.data) {
          return { success: true, data: res.data }
        }
        return { success: false, message: 'Registration failed' }
      } catch (error: any) {
        console.error('Registration error:', error)
        return {
          success: false,
          message: error?.response?.data?.message || 'Registration failed'
        }
      }
    },

    // Get user profile
    async fetchUserProfile() {
      try {
        console.log('Fetching user profile...')
        const res = await getUserProfileApi()
        console.log('Profile API response:', res)

        if (res?.data) {
          console.log('Setting user info from profile:', res.data.data)
          this.setUserInfo(res.data.data)
          console.log('User info after profile update:', this.userInfo)
          return { success: true, data: res.data.data }
        }
        return { success: false, message: 'Failed to fetch profile' }
      } catch (error: any) {
        console.error('Fetch profile error:', error)
        return {
          success: false,
          message: error?.response?.data?.message || 'Failed to fetch profile'
        }
      }
    },

    // Refresh access token
    async refreshAccessToken() {
      try {
        if (this.refreshToken) {
          const res = await refreshTokenApi({ refresh_token: this.refreshToken })
          if (res?.data) {
            const { access_token, refresh_token } = res.data
            this.setToken(access_token)
            this.setRefreshToken(refresh_token)
            return { success: true, data: res.data }
          }
          return { success: false, message: 'Failed to refresh token' }
        }
        return { success: false, message: 'No refresh token available' }
      } catch (error: any) {
        console.error('Refresh token error:', error)
        return {
          success: false,
          message: error?.response?.data?.message || 'Failed to refresh token'
        }
      }
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  const userStore = useUserStore(store)

  // Debug: Log store state when accessed
  console.log('UserStore accessed - Current state:', {
    token: userStore.getToken,
    refreshToken: userStore.getRefreshToken,
    userInfo: userStore.getUserInfo,
    hasToken: !!userStore.getToken
  })

  return userStore
}
