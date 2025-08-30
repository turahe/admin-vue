import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()

  console.log('Permission guard - Route:', to.path)
  console.log('Permission guard - User info:', userStore.getUserInfo)
  console.log('Permission guard - Token:', userStore.getToken)
  console.log('Permission guard - Refresh token:', userStore.getRefreshToken)

  // Wait for store hydration if needed
  if (!userStore.getUserInfo && userStore.getToken) {
    console.log('Permission guard - Waiting for store hydration...')
    // Try to decode user info from token if available
    try {
      const { decodeJWT } = await import('@/utils/jwt')
      const tokenPayload = decodeJWT(userStore.getToken)
      if (tokenPayload) {
        const userInfo = {
          id: tokenPayload.user_id,
          username: tokenPayload.username,
          email: tokenPayload.email,
          phone: null,
          avatar: `https://ui-avatars.com/api/?name=${tokenPayload.username.charAt(0)}&color=7F9CF5&background=EBF4FF`,
          email_verified_at: null,
          phone_verified_at: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        userStore.setUserInfo(userInfo)
        console.log('Permission guard - Restored user info from token')
      }
    } catch (error) {
      console.error('Permission guard - Error restoring user info:', error)
    }
  }

  // Check if we're on the login page first to avoid redirect loops
  if (to.path === '/login') {
    console.log('Permission guard - Login route, allowing access')
    next()
    return
  }

  if (userStore.getUserInfo) {
    // User is logged in, redirect from login to dashboard
    if (to.path === '/login') {
      console.log('Permission guard - User logged in, redirecting from login to dashboard')
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      // 开发者可根据实际情况进行修改
      const roleRouters = userStore.getRoleRouters || []

      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        appStore.serverDynamicRouter
          ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
          : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
      } else {
        await permissionStore.generateRoutes('static')
      }

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    console.log('Permission guard - No user info, checking route access')
    console.log('Permission guard - Current route:', to.path)
    console.log('Permission guard - NO_REDIRECT_WHITE_LIST:', NO_REDIRECT_WHITE_LIST)

    // Check if route is in whitelist
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      console.log('Permission guard - Allowing access to whitelisted route:', to.path)
      next() // Allow access to whitelisted routes
    } else {
      console.log('Permission guard - Redirecting to login from:', to.path)
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
