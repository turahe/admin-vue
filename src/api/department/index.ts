import request from '@/axios'
import { DepartmentListResponse, DepartmentUserParams, DepartmentUserResponse } from './types'

export const getDepartmentApi = () => {
  return request.get<DepartmentListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/departments`
  })
}

export const getDepartmentUsersApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/departments/${params.id}/users`,
    params
  })
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.delete({
    url: `${import.meta.env.VITE_API_BASE_PATH}/departments/users`,
    data: { ids }
  })
}

export const saveUserApi = (data: any) => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/departments/users`, data })
}

export const saveDepartmentApi = (data: any) => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/departments`, data })
}

export const deleteDepartmentApi = (ids: string[] | number[]) => {
  return request.delete({ url: `${import.meta.env.VITE_API_BASE_PATH}/departments`, data: { ids } })
}

export const getDepartmentTableApi = (params: any) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/departments`, params })
}
