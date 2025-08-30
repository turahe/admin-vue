import request from '@/axios'
import type {
  AnalysisTotalTypes,
  UserAccessSource,
  WeeklyUserActivity,
  MonthlySales
} from './types'

export const getAnalysisCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/analysis/total` })
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/analysis/user-access-source` })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/analysis/weekly-user-activity` })
}

export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/analysis/monthly-sales` })
}
