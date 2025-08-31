import request from '@/axios'
import type {
  IntegrationConfigs,
  SaveIntegrationRequest,
  SaveIntegrationResponse,
  TestIntegrationRequest,
  TestIntegrationResponse
} from './types'

const baseUrl = '/api/integrations'

/**
 * Get all integration configurations
 */
export const getIntegrationConfigsApi = () => {
  return request.get<IntegrationConfigs>(`${baseUrl}/configs`)
}

/**
 * Save all integration configurations
 */
export const saveIntegrationConfigsApi = (data: SaveIntegrationRequest) => {
  return request.post<SaveIntegrationResponse>(`${baseUrl}/configs`, data)
}

/**
 * Test a specific integration configuration
 */
export const testIntegrationApi = (data: TestIntegrationRequest) => {
  return request.post<TestIntegrationResponse>(`${baseUrl}/test`, data)
}

/**
 * Get integration status for all services
 */
export const getIntegrationStatusApi = () => {
  return request.get<Record<string, boolean>>(`${baseUrl}/status`)
}

/**
 * Enable/disable a specific integration service
 */
export const toggleIntegrationApi = (service: string, enabled: boolean) => {
  return request.patch(`${baseUrl}/${service}/toggle`, { enabled })
}

/**
 * Reset all integration configurations to defaults
 */
export const resetIntegrationConfigsApi = () => {
  return request.post(`${baseUrl}/reset`)
}
