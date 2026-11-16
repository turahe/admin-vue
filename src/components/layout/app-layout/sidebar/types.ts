import type { Component } from 'vue'
import type { Permission } from '@/rbac/permissions'

export type MenuType = 'main' | 'others'

export interface SubItem {
  name: string
  path: string
  pro?: boolean
  new?: boolean
  target?: string
  permission?: Permission
}

export interface NavItem {
  name: string
  icon: Component
  path?: string
  new?: boolean
  target?: string
  permission?: Permission
  subItems?: SubItem[]
}
