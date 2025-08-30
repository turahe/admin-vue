import request from '@/axios'
import type { TableData } from './types'

export const getTableListApi = (params: any) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/examples`, params })
}

export const getCardTableListApi = (params: any) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/cards`, params })
}

export const getTreeTableListApi = (params: any) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/examples/tree`, params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/examples`, data })
}

export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({
    url: `${import.meta.env.VITE_API_BASE_PATH}/examples/${id}`,
    params: { id }
  })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: `${import.meta.env.VITE_API_BASE_PATH}/examples`, data: { ids } })
}
