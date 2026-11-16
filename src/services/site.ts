import { api, read } from '@/api/client'
import { ApiError } from '@/api/errors'
import { mapComment, mapPost } from '@/api/map'
import type {
  ActivityEntry,
  AnalyticsPayload,
  DashboardPayload,
  MenuLink,
  PageResult,
  SiteSettings,
  WidgetToggle,
} from '@/types/cms'

interface SettingRow {
  key: string
  value: unknown
  version?: number
}

interface Overview {
  totals?: { views?: number; bounceRate?: number | null; avgTimeSeconds?: number | null; visitors?: number; visitorDays?: number }
  series?: { period?: string; views?: number; visitors?: number }[]
  referrers?: { host?: string; sessions?: number }[]
  audience?: {
    country?: { value?: string; views?: number }[]
    device?: { value?: string; views?: number }[]
  }
}

const versions = new Map<string, number>()

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function settingsFrom(rows: SettingRow[]): SiteSettings {
  versions.clear()
  const values = new Map<string, unknown>()
  for (const row of rows) {
    values.set(row.key, row.value)
    if (typeof row.version === 'number') versions.set(row.key, row.version)
  }
  const locale = text(values.get('site.default_locale'), 'en')
  const keywords = values.get('seo.home_keywords')
  return {
    general: {
      name: text(values.get('site.name'), 'Blog'),
      description: text(values.get('site.tagline'), text(values.get('site.name'), 'Blog')),
      url: text(values.get('site.public_url'), 'http://localhost:8080'),
      logoUrl: '',
      faviconUrl: '',
      language: locale.startsWith('id') ? 'id' : 'en',
      timezone: text(values.get('site.timezone'), 'UTC'),
    },
    reading: { postsPerPage: 10, homepageDisplay: 'latest', defaultVisibility: 'public' },
    seo: {
      title: text(values.get('seo.home_title'), text(values.get('site.name'), 'Blog')),
      description: text(values.get('seo.home_description'), text(values.get('seo.default_description'), 'Blog')),
      focusKeyword: Array.isArray(keywords) ? String(keywords[0] ?? '') : '',
      canonicalUrl: text(values.get('site.canonical_base_url')),
      ogTitle: text(values.get('seo.home_title')),
      ogDescription: text(values.get('seo.home_description')),
      ogImage: text(values.get('seo.default_share_image_url')),
      robotsIndex: true,
      robotsFollow: true,
      sitemapEnabled: true,
    },
    social: { facebook: '', instagram: '', x: '', linkedin: '', youtube: '' },
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await read<SettingRow[]>(api.get('/api/v1/admin/settings'))
  return settingsFrom(data)
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  const keywords = settings.seo.focusKeyword ? [settings.seo.focusKeyword] : []
  const updates = [
    ['site.name', settings.general.name],
    ['site.tagline', settings.general.description],
    ['site.public_url', settings.general.url],
    ['site.default_locale', settings.general.language],
    ['site.timezone', settings.general.timezone],
    ['seo.home_title', settings.seo.title],
    ['seo.home_description', settings.seo.description],
    ['seo.default_description', settings.seo.description],
    ['seo.home_keywords', keywords],
    ['site.canonical_base_url', settings.seo.canonicalUrl],
    ['seo.default_share_image_url', settings.seo.ogImage],
  ].map(([key, value]) => ({ key, value, version: versions.get(String(key)) }))
  await read(api.put('/api/v1/admin/settings', { updates }))
  return getSettings()
}

async function countPosts(status?: string): Promise<number> {
  const { meta, data } = await read<unknown[]>(
    api.get('/api/v1/admin/posts', { params: { status, perPage: 1, page: 1 } }),
  )
  return meta.total ?? data.length
}

export async function getDashboard(): Promise<DashboardPayload> {
  const [totalPosts, published, drafts, scheduled, overview, recent, comments, authors] = await Promise.all([
    countPosts(),
    countPosts('published'),
    countPosts('draft'),
    countPosts('scheduled'),
    read<Overview>(api.get('/api/v1/admin/analytics/overview')),
    read<Parameters<typeof mapPost>[0][]>(api.get('/api/v1/admin/posts', { params: { perPage: 5 } })),
    read<Parameters<typeof mapComment>[0][]>(api.get('/api/v1/admin/comments', { params: { perPage: 5, sort: 'newest' } })),
    read<unknown[]>(api.get('/api/v1/admin/users', { params: { perPage: 1 } })),
  ])
  const series = overview.data.series ?? []
  const recentPosts = recent.data.map((post) => mapPost(post))
  return {
    stats: {
      totalPosts,
      published,
      drafts,
      scheduled,
      views: overview.data.totals?.views ?? 0,
      comments: comments.data.length,
      authors: authors.meta.total ?? authors.data.length,
    },
    months: series.map((point) => point.period ?? ''),
    pageViews: series.map((point) => point.views ?? 0),
    publishedOverTime: series.map((point) => point.views ?? 0),
    mostViewed: recentPosts.slice(0, 5).map((post) => ({ title: post.title, views: 0 })),
    sources: (overview.data.referrers ?? []).map((item) => ({ label: item.host ?? 'direct', value: item.sessions ?? 0 })),
    recentPosts,
    recentComments: comments.data.map(mapComment),
    topArticles: recentPosts.slice(0, 5).map((post) => ({ title: post.title, views: 0, comments: 0 })),
    widgets: [],
  }
}

function percent(value: number | null | undefined): number {
  if (value == null) return 0
  return value <= 1 ? Math.round(value * 1000) / 10 : value
}

export async function getAnalytics(): Promise<AnalyticsPayload> {
  const { data } = await read<Overview>(api.get('/api/v1/admin/analytics/overview'))
  const series = data.series ?? []
  return {
    pageViews: data.totals?.views ?? 0,
    uniqueVisitors: data.totals?.visitors ?? data.totals?.visitorDays ?? 0,
    averageReadingMinutes: Math.round(((data.totals?.avgTimeSeconds ?? 0) / 60) * 10) / 10,
    bounceRate: percent(data.totals?.bounceRate),
    months: series.map((point) => point.period ?? ''),
    views: series.map((point) => point.views ?? 0),
    visitors: series.map((point) => point.visitors ?? 0),
    sources: (data.referrers ?? []).map((item) => ({ label: item.host ?? 'direct', value: item.sessions ?? 0 })),
    topArticles: [],
    categories: [],
    devices: (data.audience?.device ?? []).map((item) => ({ label: item.value ?? 'unknown', value: item.views ?? 0 })),
    regions: (data.audience?.country ?? []).map((item) => ({ label: item.value ?? 'unknown', value: item.views ?? 0 })),
  }
}

interface RawActivity {
  id: string
  action?: string
  category?: string | null
  occurredAt?: string
  actorId?: string | null
}

export async function listActivity(page: number, search: string): Promise<PageResult<ActivityEntry>> {
  const { data, meta } = await read<RawActivity[]>(api.get('/api/v1/me/activity', { params: { page, perPage: 8 } }))
  const needle = search.trim().toLowerCase()
  const items = data
    .map((entry) => ({
      id: entry.id,
      actor: entry.actorId ?? 'You',
      action: entry.action ?? '',
      target: entry.category ?? '',
      createdAt: entry.occurredAt ?? '',
    }))
    .filter((entry) => !needle || `${entry.action} ${entry.target}`.toLowerCase().includes(needle))
  return { items, total: meta.total ?? items.length, page: meta.currentPage ?? page, pageSize: meta.perPage ?? 8 }
}

export async function getMenus(): Promise<MenuLink[]> {
  return []
}

export async function saveMenus(_menus: MenuLink[]): Promise<MenuLink[]> {
  throw new ApiError('Menus are not part of the Blog API.', 400)
}

export async function getWidgets(): Promise<WidgetToggle[]> {
  return []
}

export async function saveWidgets(_widgets: WidgetToggle[]): Promise<WidgetToggle[]> {
  throw new ApiError('Dashboard widgets are not part of the Blog API.', 400)
}
