import request from '@/axios'
import type { HealthResponse } from './types'

/**
 * Health Check API endpoints
 * Based on swagger specification for health monitoring
 */

/**
 * Check if the API and all services are running and healthy
 * @returns Promise with health status
 */
export const getHealthCheckApi = (): Promise<HealthResponse> => {
  return request.get({
    url: '/healthz'
  })
}
