import type { UserRole } from '@/types/cms'

export const permissions = [
  'dashboard.view',
  'posts.view',
  'posts.write',
  'posts.publish',
  'posts.delete',
  'categories.manage',
  'tags.manage',
  'media.manage',
  'comments.moderate',
  'users.manage',
  'roles.manage',
  'appearance.manage',
  'analytics.view',
  'settings.manage',
  'activity.view',
] as const

export type Permission = (typeof permissions)[number]

const content: Permission[] = [
  'dashboard.view',
  'posts.view',
  'posts.write',
  'posts.publish',
  'posts.delete',
  'categories.manage',
  'tags.manage',
  'media.manage',
  'comments.moderate',
  'analytics.view',
]

const staff: Permission[] = [...content, 'users.manage', 'appearance.manage', 'settings.manage', 'activity.view']

export const defaultGrants: Record<UserRole, Permission[]> = {
  super_admin: [...permissions],
  administrator: [...staff, 'roles.manage'],
  editor: content,
  author: ['dashboard.view', 'posts.view', 'posts.write', 'posts.delete', 'media.manage'],
  contributor: ['dashboard.view', 'posts.view', 'posts.write', 'media.manage'],
  subscriber: ['dashboard.view'],
}

export function grantsFor(role: UserRole, grants: Record<UserRole, Permission[]>): Permission[] {
  return grants[role]
}
