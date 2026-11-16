import {
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Palette,
  ScrollText,
  Settings,
  Users,
} from '@lucide/vue'
import {
  BoxIcon,
  CalendarIcon,
  LayoutGridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PluginIcon,
  TableIcon,
  UserCircleIcon,
} from '@/icons/layout'
import type { Permission } from '@/rbac/permissions'
import type { NavItem } from './types'

type Translate = (key: string) => string

export function cmsNavItems(t: Translate): NavItem[] {
  return [
    { icon: LayoutDashboard, name: t('nav.dashboard'), path: '/', permission: 'dashboard.view' },
    {
      icon: FileText,
      name: t('nav.content'),
      subItems: [
        { name: t('nav.posts'), path: '/posts', permission: 'posts.view' },
        { name: t('nav.create'), path: '/posts/new', permission: 'posts.write' },
        { name: t('nav.categories'), path: '/categories', permission: 'categories.manage' },
        { name: t('nav.tags'), path: '/tags', permission: 'tags.manage' },
        { name: t('nav.media'), path: '/media', permission: 'media.manage' },
      ],
    },
    { icon: MessageSquare, name: t('nav.comments'), path: '/comments', permission: 'comments.moderate' },
    {
      icon: Users,
      name: t('nav.users'),
      subItems: [
        { name: t('nav.allUsers'), path: '/users', permission: 'users.manage' },
        { name: t('nav.roles'), path: '/roles', permission: 'roles.manage' },
      ],
    },
    {
      icon: Palette,
      name: t('nav.appearance'),
      subItems: [
        { name: t('nav.menus'), path: '/appearance/menus', permission: 'appearance.manage' },
        { name: t('nav.widgets'), path: '/appearance/widgets', permission: 'appearance.manage' },
      ],
    },
    { icon: BarChart3, name: t('nav.analytics'), path: '/analytics', permission: 'analytics.view' },
    {
      icon: Settings,
      name: t('nav.settings'),
      subItems: [
        { name: t('nav.general'), path: '/settings/general', permission: 'settings.manage' },
        { name: t('nav.seo'), path: '/settings/seo', permission: 'settings.manage' },
        { name: t('nav.social'), path: '/settings/social', permission: 'settings.manage' },
        { name: t('nav.reading'), path: '/settings/reading', permission: 'settings.manage' },
      ],
    },
    { icon: ScrollText, name: t('nav.activity'), path: '/activity', permission: 'activity.view' },
  ]
}

export const othersItems: NavItem[] = [
  {
    icon: LayoutGridIcon,
    name: 'Ecommerce',
    path: '/examples/ecommerce',
  },
  {
    icon: CalendarIcon,
    name: 'Calendar',
    path: '/calendar',
  },
  {
    icon: UserCircleIcon,
    name: 'User Profile',
    path: '/profile',
  },
  {
    icon: ListIcon,
    name: 'Forms',
    subItems: [{ name: 'Form Elements', path: '/form-elements' }],
  },
  {
    icon: TableIcon,
    name: 'Tables',
    subItems: [{ name: 'Basic Tables', path: '/basic-tables' }],
  },
  {
    icon: PageIcon,
    name: 'Pages',
    subItems: [
      { name: 'Blank Page', path: '/blank' },
      { name: '404 Error', path: '/error-404' },
    ],
  },
  {
    icon: PieChartIcon,
    name: 'Charts',
    subItems: [
      { name: 'Line Chart', path: '/line-chart' },
      { name: 'Bar Chart', path: '/bar-chart' },
    ],
  },
  {
    icon: BoxIcon,
    name: 'UI Elements',
    subItems: [
      { name: 'Alerts', path: '/alerts' },
      { name: 'Avatar', path: '/avatars' },
      { name: 'Badge', path: '/badge' },
      { name: 'Buttons', path: '/buttons' },
      { name: 'Images', path: '/images' },
      { name: 'Videos', path: '/videos' },
    ],
  },
  {
    icon: PluginIcon,
    name: 'Authentication',
    subItems: [
      { name: 'Sign In', path: '/signin' },
      { name: 'Sign Up', path: '/signup' },
    ],
  },
]

export function visibleNav(items: NavItem[], can: (permission: Permission) => boolean, signedIn: boolean): NavItem[] {
  return items.flatMap((item) => {
    if (item.subItems) {
      const subItems = item.subItems.filter((subItem) => !subItem.permission || (signedIn && can(subItem.permission)))
      if (!subItems.length) return []
      return [{ ...item, subItems }]
    }
    if (item.permission && (!signedIn || !can(item.permission))) return []
    return [item]
  })
}
