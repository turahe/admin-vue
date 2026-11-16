import { createRouter, createWebHistory } from 'vue-router'
import type { Permission } from '@/rbac/permissions'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    permission?: Permission
  }
}

const blog = () => import('../views/Blog/Shell.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      component: blog,
      children: [
        {
          path: '',
          name: 'BlogDashboard',
          component: () => import('../views/Blog/Dashboard.vue'),
          meta: { title: 'Dashboard', requiresAuth: true, permission: 'dashboard.view' },
        },
        {
          path: 'posts',
          name: 'PostList',
          component: () => import('../views/Blog/PostList.vue'),
          meta: { title: 'Posts', requiresAuth: true, permission: 'posts.view' },
        },
        {
          path: 'posts/new',
          name: 'PostCreate',
          component: () => import('../views/Blog/PostEditor.vue'),
          meta: { title: 'Create Post', requiresAuth: true, permission: 'posts.write' },
        },
        {
          path: 'posts/:id/edit',
          name: 'PostEdit',
          component: () => import('../views/Blog/PostEditor.vue'),
          meta: { title: 'Edit Post', requiresAuth: true, permission: 'posts.write' },
        },
        {
          path: 'posts/:id/preview',
          name: 'PostPreview',
          component: () => import('../views/Blog/PostPreview.vue'),
          meta: { title: 'Preview', requiresAuth: true, permission: 'posts.view' },
        },
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('../views/Blog/Categories.vue'),
          meta: { title: 'Categories', requiresAuth: true, permission: 'categories.manage' },
        },
        {
          path: 'tags',
          name: 'Tags',
          component: () => import('../views/Blog/Tags.vue'),
          meta: { title: 'Tags', requiresAuth: true, permission: 'tags.manage' },
        },
        {
          path: 'media',
          name: 'Media',
          component: () => import('../views/Blog/MediaLibrary.vue'),
          meta: { title: 'Media Library', requiresAuth: true, permission: 'media.manage' },
        },
        {
          path: 'comments',
          name: 'Comments',
          component: () => import('../views/Blog/Comments.vue'),
          meta: { title: 'Comments', requiresAuth: true, permission: 'comments.moderate' },
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/Blog/Users.vue'),
          meta: { title: 'Users', requiresAuth: true, permission: 'users.manage' },
        },
        {
          path: 'roles',
          name: 'Roles',
          component: () => import('../views/Blog/Roles.vue'),
          meta: { title: 'Roles', requiresAuth: true, permission: 'roles.manage' },
        },
        {
          path: 'appearance/menus',
          name: 'Menus',
          component: () => import('../views/Blog/Menus.vue'),
          meta: { title: 'Navigation Menus', requiresAuth: true, permission: 'appearance.manage' },
        },
        {
          path: 'appearance/widgets',
          name: 'Widgets',
          component: () => import('../views/Blog/Widgets.vue'),
          meta: { title: 'Widgets', requiresAuth: true, permission: 'appearance.manage' },
        },
        {
          path: 'analytics',
          name: 'Analytics',
          component: () => import('../views/Blog/Analytics.vue'),
          meta: { title: 'Analytics', requiresAuth: true, permission: 'analytics.view' },
        },
        {
          path: 'settings/:section',
          name: 'Settings',
          component: () => import('../views/Blog/Settings.vue'),
          meta: { title: 'Settings', requiresAuth: true, permission: 'settings.manage' },
        },
        {
          path: 'activity',
          name: 'Activity',
          component: () => import('../views/Blog/Activity.vue'),
          meta: { title: 'Activity Logs', requiresAuth: true, permission: 'activity.view' },
        },
        {
          path: 'forbidden',
          name: 'Forbidden',
          component: () => import('../views/Blog/Forbidden.vue'),
          meta: { title: 'Forbidden', requiresAuth: true },
        },
      ],
    },
    {
      path: '/examples/ecommerce',
      name: 'Ecommerce',
      component: () => import('../views/Dashboard/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Charts/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Charts/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badge.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/login',
      redirect: (to) => ({ path: '/signin', query: to.query }),
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/Blog/ForgotPassword.vue'),
      meta: { title: 'Forgot password' },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Blog/ResetPassword.vue'),
      meta: { title: 'Reset password' },
    },
  ],
})

export default router

router.beforeEach((to) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'Signin', query: { redirect: to.fullPath } }
  }
  if (to.meta.permission && !auth.can(to.meta.permission)) {
    return { name: 'Forbidden' }
  }
  return true
})
