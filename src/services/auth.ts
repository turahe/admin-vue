import { read } from '@/api/client'
import { api } from '@/api/client'
import { ApiError } from '@/api/errors'
import { mapUser, uiPermissionsFor } from '@/api/map'
import { clearSession, setTokens } from '@/api/session'
import type { AuthSession } from '@/types/cms'

interface TokenPair {
  accessToken?: string
  refreshToken?: string
  twoFactorRequired?: boolean
}

interface RawUser {
  id: string
  email?: string
  username?: string
  fullName?: string
  status?: string
  createdAt?: string
}

interface RoleRow {
  name: string
  permissions?: string[]
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const { data } = await read<TokenPair>(api.post('/api/v1/admin/auth/login', { email, password }))
  if (data.twoFactorRequired) {
    throw new ApiError('This account needs a two-factor code. Complete that challenge before signing in here.', 401)
  }
  if (!data.accessToken || !data.refreshToken) throw new ApiError('Sign in did not return a token.', 401)
  setTokens(data.accessToken, data.refreshToken)
  return currentSession()
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/v1/auth/logout', {})
  } finally {
    clearSession()
  }
}

export async function currentSession(): Promise<AuthSession> {
  const { data: user } = await read<RawUser>(api.get('/api/v1/me'))
  const { data: membership } = await read<{ roles?: string[] }>(api.get(`/api/v1/admin/users/${user.id}/roles`))
  const { data: roles } = await read<RoleRow[]>(api.get('/api/v1/admin/roles'))
  const names = new Set(membership.roles ?? [])
  const keys = roles.filter((role) => names.has(role.name)).flatMap((role) => role.permissions ?? [])
  const roleName = membership.roles?.[0] ?? 'author'
  return { user: mapUser(user, roleName), permissions: uiPermissionsFor(keys) }
}

export async function forgotPassword(email: string): Promise<string> {
  await read(api.post('/api/v1/auth/password/forgot', { emailOrUsername: email }))
  return 'If an account matches, a reset message is on the way.'
}

export async function resetPassword(_email: string, token: string, password: string): Promise<void> {
  await read(
    api.post('/api/v1/auth/password/reset', {
      token,
      newPassword: password,
      confirmPassword: password,
    }),
  )
}
