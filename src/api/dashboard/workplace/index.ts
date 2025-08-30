import request from '@/axios'
import type { WorkplaceTotal, Project, Dynamic, Team, RadarData } from './types'

export const getWorkplaceCountApi = (): Promise<IResponse<WorkplaceTotal>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/workplace/total` })
}

export const getProjectApi = (): Promise<IResponse<Project>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/workplace/project` })
}

export const getDynamicApi = (): Promise<IResponse<Dynamic[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/workplace/dynamic` })
}

export const getTeamApi = (): Promise<IResponse<Team[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/workplace/team` })
}

export const getRadarApi = (): Promise<IResponse<RadarData[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/workplace/radar` })
}
