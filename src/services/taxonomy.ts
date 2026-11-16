import { api, read } from '@/api/client'
import type { Category, CategoryInput, Tag, TagInput } from '@/types/cms'

export interface CategoryRow extends Category {
  postCount: number
}

export interface TagRow extends Tag {
  postCount: number
}

interface RawCategory {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string | null
  createdAt?: string
}

interface RawTag {
  id: string
  name: string
  slug: string
  createdAt?: string
}

function mapCategory(raw: RawCategory): CategoryRow {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? '',
    parentId: raw.parentId ?? '',
    imageUrl: '',
    createdAt: raw.createdAt ?? '',
    postCount: 0,
  }
}

function mapTag(raw: RawTag): TagRow {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: '',
    createdAt: raw.createdAt ?? '',
    postCount: 0,
  }
}

export async function listCategories(): Promise<CategoryRow[]> {
  const { data } = await read<RawCategory[]>(api.get('/api/v1/admin/categories'))
  return data.map(mapCategory)
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data } = await read<RawCategory>(
    api.post('/api/v1/admin/categories', {
      name: input.name,
      slug: input.slug || undefined,
      description: input.description,
      parentId: input.parentId || undefined,
    }),
  )
  return mapCategory(data)
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const { data } = await read<RawCategory>(
    api.patch(`/api/v1/admin/categories/${id}`, {
      name: input.name,
      slug: input.slug || undefined,
      description: input.description,
      parentId: input.parentId || null,
    }),
  )
  return mapCategory(data)
}

export async function deleteCategory(id: string): Promise<void> {
  await read(api.delete(`/api/v1/admin/categories/${id}`))
}

export async function listTags(): Promise<TagRow[]> {
  const { data } = await read<RawTag[]>(api.get('/api/v1/tags'))
  return data.map(mapTag)
}

export async function createTag(input: TagInput): Promise<Tag> {
  const { data } = await read<RawTag>(
    api.post('/api/v1/admin/tags', { name: input.name, slug: input.slug || undefined }),
  )
  return mapTag(data)
}

export async function updateTag(id: string, input: TagInput): Promise<Tag> {
  const { data } = await read<RawTag>(api.patch(`/api/v1/admin/tags/${id}`, { name: input.name, slug: input.slug }))
  return mapTag(data)
}

export async function deleteTag(id: string): Promise<void> {
  await read(api.delete(`/api/v1/admin/tags/${id}`))
}
