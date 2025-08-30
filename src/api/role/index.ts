import request from '@/axios'
import { RoleListResponse, RoleParams, RoleCreateData, RoleUpdateData } from './types'

export const getRoleListApi = () => {
  return request.get<RoleListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`
  })
}

export const getRoleTableApi = (params: RoleParams) => {
  return request.get<RoleListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`,
    params
  })
}

export const getRoleByIdApi = (id: string) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}` })
}

export const createRoleApi = (data: RoleCreateData) => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles`, data })
}

export const updateRoleApi = (id: string, data: RoleUpdateData) => {
  return request.put({ url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}`, data })
}

export const deleteRoleApi = (ids: string[] | number[]) => {
  return request.delete({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles`,
    data: { ids }
  })
}

export const updateRoleStatusApi = (id: string, status: string) => {
  return request.put({
    url: `${import.meta.env.VITE_API_BASE_PATH}/roles/${id}/status`,
    data: { status }
  })
}

// Export types for external use
export type { RoleListResponse, RoleParams, RoleCreateData, RoleUpdateData }
export type { Role } from './types'
