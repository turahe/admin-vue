import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type { Permission } from '@/rbac/permissions'
import * as authService from '@/services/auth'
import { clearSession } from '@/api/session'
import type { User } from '@/types/cms'

export const useAuthStore = defineStore('auth', () => {
  const user = shallowRef<User | null>(null)
  const permissions = shallowRef<Permission[]>([])

  const signedIn = computed(() => user.value !== null)

  function can(permission: Permission): boolean {
    return permissions.value.includes(permission)
  }

  async function login(email: string, password: string): Promise<void> {
    const session = await authService.login(email, password)
    user.value = session.user
    permissions.value = session.permissions as Permission[]
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      user.value = null
      permissions.value = []
      clearSession()
    }
  }

  async function refresh(): Promise<void> {
    const session = await authService.currentSession()
    user.value = session.user
    permissions.value = session.permissions as Permission[]
  }

  return { user, permissions, signedIn, can, login, logout, refresh }
})
