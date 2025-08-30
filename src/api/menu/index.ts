import request from '@/axios'
import { MenuListResponse, MenuParams, MenuCreateData, MenuUpdateData } from './types'

export const getMenuApi = () => {
  return request.get<MenuListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/menus`
  })
}

export const getMenuTableApi = (params: MenuParams) => {
  return request.get<MenuListResponse>({
    url: `${import.meta.env.VITE_API_BASE_PATH}/menus`,
    params
  })
}

export const getMenuByIdApi = (id: string) => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/menus/${id}` })
}

export const createMenuApi = (data: MenuCreateData) => {
  return request.post({ url: `${import.meta.env.VITE_API_BASE_PATH}/menus`, data })
}

export const updateMenuApi = (id: string, data: MenuUpdateData) => {
  return request.put({ url: `${import.meta.env.VITE_API_BASE_PATH}/menus/${id}`, data })
}

export const deleteMenuApi = (ids: string[] | number[]) => {
  return request.delete({
    url: `${import.meta.env.VITE_API_BASE_PATH}/menus`,
    data: { ids }
  })
}

export const updateMenuStatusApi = (id: string, status: string) => {
  return request.put({
    url: `${import.meta.env.VITE_API_BASE_PATH}/menus/${id}/status`,
    data: { status }
  })
}

export const getMenuTreeApi = () => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/menus/tree` })
}

// Export types for external use
export type { MenuListResponse, MenuParams, MenuCreateData, MenuUpdateData }
export type { Menu } from './types'
