import request from '@/axios'
import { MenuListResponse, MenuParams, MenuCreateData, MenuUpdateData } from './types'

/**
 * Menu API endpoints
 * Based on swagger specification for menu management
 */

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

/**
 * Enhanced menu endpoints from swagger specification
 */

/**
 * Get menu hierarchy
 * @returns Promise with menu hierarchy
 */
export const getMenuHierarchyApi = (): Promise<any> => {
  return request.get({
    url: '/menus/hierarchy'
  })
}

/**
 * Get root menus (menus without parent)
 * @returns Promise with root menus
 */
export const getRootMenusApi = (): Promise<any> => {
  return request.get({
    url: '/menus/root'
  })
}

/**
 * Search menus by name or description
 * @param query Search query
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with menus collection
 */
export const searchMenusApi = (
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<any> => {
  return request.get({
    url: '/menus/search',
    params: { query, limit, offset }
  })
}

/**
 * Get menu by slug
 * @param slug Menu slug
 * @returns Promise with menu details
 */
export const getMenuBySlugApi = (slug: string): Promise<any> => {
  return request.get({
    url: `/menus/slug/${slug}`
  })
}

/**
 * Activate a menu
 * @param id Menu ID
 * @returns Promise with success response
 */
export const activateMenuApi = (id: string): Promise<any> => {
  return request.put({
    url: `/menus/${id}/activate`
  })
}

/**
 * Deactivate a menu
 * @param id Menu ID
 * @returns Promise with success response
 */
export const deactivateMenuApi = (id: string): Promise<any> => {
  return request.put({
    url: `/menus/${id}/deactivate`
  })
}

/**
 * Hide a menu
 * @param id Menu ID
 * @returns Promise with success response
 */
export const hideMenuApi = (id: string): Promise<any> => {
  return request.put({
    url: `/menus/${id}/hide`
  })
}

/**
 * Show a menu
 * @param id Menu ID
 * @returns Promise with success response
 */
export const showMenuApi = (id: string): Promise<any> => {
  return request.put({
    url: `/menus/${id}/show`
  })
}

// Export types for external use
export type { MenuListResponse, MenuParams, MenuCreateData, MenuUpdateData }
export type { Menu } from './types'
