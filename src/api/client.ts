import axios, { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/api/errors'
import { clearSession, getAccessToken, getRefreshToken, setTokens } from '@/api/session'

export interface PageMeta {
  total?: number | null
  currentPage?: number
  perPage?: number
}

interface Envelope<T> {
  ok: boolean
  data?: T
  meta?: PageMeta
  message?: string
  error?: { message?: string }
  errors?: Record<string, string[]>
}

interface TokenPair {
  accessToken?: string
  refreshToken?: string
  twoFactorRequired?: boolean
}

function messageFrom(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const body = data as Envelope<unknown>
  const field = body.errors ? Object.values(body.errors).flat()[0] : undefined
  return body.error?.message || field || body.message
}

export function unpack<T>(payload: unknown): { data: T; meta: PageMeta } {
  if (payload && typeof payload === 'object' && 'ok' in payload) {
    const envelope = payload as Envelope<T>
    if (!envelope.ok) {
      throw new ApiError(messageFrom(payload) ?? 'Request failed.', 400)
    }
    return { data: envelope.data as T, meta: envelope.meta ?? {} }
  }
  return { data: payload as T, meta: {} }
}

export async function read<T>(response: Promise<AxiosResponse>): Promise<{ data: T; meta: PageMeta }> {
  const result = await response
  return unpack<T>(result.data)
}

async function refreshAccessToken(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new ApiError('Session expired.', 401)
  const { data } = await axios.post<Envelope<TokenPair>>('/api/v1/auth/refresh', { refreshToken })
  const pair = unpack<TokenPair>(data).data
  if (!pair.accessToken || !pair.refreshToken) throw new ApiError('Session expired.', 401)
  setTokens(pair.accessToken, pair.refreshToken)
}

let refreshing: Promise<void> | null = null

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)
    const config = error.config as (InternalAxiosRequestConfig & { retried?: boolean }) | undefined
    const url = config?.url ?? ''
    const status = error.response?.status ?? 0
    const canRefresh = status === 401 && config && !config.retried && !url.includes('/auth/')
    if (canRefresh) {
      config.retried = true
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null
        })
        await refreshing
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${getAccessToken()}`)
        config.headers = headers
        return api.request(config)
      } catch {
        clearSession()
      }
    }
    const message = messageFrom(error.response?.data) ?? 'Request failed.'
    return Promise.reject(new ApiError(message, status))
  },
)
