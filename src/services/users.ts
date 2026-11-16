import { api, read } from '@/api/client'
import { ApiError } from '@/api/errors'
import { apiRoleName, mapUser } from '@/api/map'
import type { User, UserRole, UserStatus } from '@/types/cms'

export interface UserInput {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  password: string
}

export interface ApiRoleGrant {
  name: string
  description: string
  permissions: string[]
  protected: boolean
}

export interface RoleMatrix {
  permissions: string[]
  roles: ApiRoleGrant[]
}

interface RawUser {
  id: string
  email?: string
  username?: string
  fullName?: string
  status?: string
  createdAt?: string
}

interface RawRole {
  name: string
  description?: string
  permissions?: string[]
  protected?: boolean
}

function usernameFrom(email: string): string {
  const local = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') ?? ''
  if (local.length < 3) throw new ApiError('Use an email whose name is at least 3 letters or numbers.', 400)
  return local.slice(0, 32)
}

async function roleOf(id: string): Promise<string> {
  const { data } = await read<{ roles?: string[] }>(api.get(`/api/v1/admin/users/${id}/roles`))
  return data.roles?.[0] ?? 'author'
}

export async function listUsers(): Promise<User[]> {
  const { data } = await read<RawUser[]>(api.get('/api/v1/admin/users', { params: { perPage: 100 } }))
  const roles = await Promise.all(data.map((user) => roleOf(user.id)))
  return data.map((user, index) => mapUser(user, roles[index] ?? 'author'))
}

export async function createUser(input: UserInput): Promise<User> {
  if (input.password.length < 12) throw new ApiError('Password must be at least 12 characters.', 400)
  const { data } = await read<RawUser>(
    api.post('/api/v1/admin/users', {
      email: input.email,
      username: usernameFrom(input.email),
      fullName: input.name,
      password: input.password,
      roles: [apiRoleName(input.role)],
    }),
  )
  return mapUser(data, apiRoleName(input.role))
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  await read(api.patch(`/api/v1/admin/users/${id}/profile`, { fullName: input.name }))
  const current = await roleOf(id)
  const next = apiRoleName(input.role)
  if (current !== next) {
    if (current) await read(api.delete(`/api/v1/admin/users/${id}/roles/${current}`))
    await read(api.post(`/api/v1/admin/users/${id}/roles`, { roles: [next] }))
  }
  return mapUser({ id, email: input.email, fullName: input.name, status: input.status }, next)
}

export async function deleteUser(_id: string): Promise<void> {
  throw new ApiError('The Blog API does not delete user accounts from this screen.', 400)
}

export async function getRoles(): Promise<RoleMatrix> {
  const [roles, catalog] = await Promise.all([
    read<RawRole[]>(api.get('/api/v1/admin/roles')),
    read<{ key: string }[]>(api.get('/api/v1/admin/permissions')),
  ])
  return {
    permissions: catalog.data.map((item) => item.key),
    roles: roles.data.map((role) => ({
      name: role.name,
      description: role.description ?? '',
      permissions: role.permissions ?? [],
      protected: role.protected === true || (role.permissions ?? []).includes('*'),
    })),
  }
}

export async function saveRole(role: string, permissions: string[]): Promise<void> {
  await read(api.put(`/api/v1/admin/roles/${role}/permissions`, { permissions }))
}
