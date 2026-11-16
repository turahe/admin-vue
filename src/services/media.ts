import { api, read } from '@/api/client'
import { mapMedia } from '@/api/map'
import type { MediaAsset } from '@/types/cms'

interface RawMedia {
  id: string
  originalFilename?: string
  contentType?: string
  sizeBytes?: number
  width?: number | null
  height?: number | null
  createdAt?: string
  variants?: Record<string, string>
}

interface Presign {
  mediaId: string
  uploadUrl: string
  requiredHeaders?: Record<string, string>
}

function uploadTarget(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.port === '8080' || parsed.hostname === 'localhost') return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
  return url
}

export async function listMedia(search = '', type = ''): Promise<MediaAsset[]> {
  const { data } = await read<RawMedia[]>(
    api.get('/api/v1/admin/media', { params: { q: search || undefined, perPage: 50, status: 'ready' } }),
  )
  return data.map(mapMedia).filter((item) => !type || item.mime.startsWith(type))
}

export async function uploadMedia(file: File): Promise<MediaAsset> {
  const { data: presign } = await read<Presign>(
    api.post('/api/v1/admin/media', {
      contentType: file.type || 'application/octet-stream',
      originalFilename: file.name,
      sizeBytes: file.size,
    }),
  )
  const headers = new Headers(presign.requiredHeaders)
  if (!headers.has('Content-Type')) headers.set('Content-Type', file.type || 'application/octet-stream')
  const uploaded = await fetch(uploadTarget(presign.uploadUrl), { method: 'PUT', headers, body: file })
  if (!uploaded.ok) throw new Error('The storage service rejected the upload.')
  const { data } = await read<RawMedia>(api.post(`/api/v1/admin/media/${presign.mediaId}/complete`))
  return mapMedia(data)
}

export async function deleteMedia(id: string): Promise<void> {
  await read(api.delete(`/api/v1/admin/media/${id}`))
}
