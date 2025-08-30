/**
 * Health Check API Types
 * Based on swagger specification for health monitoring
 */

export interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  version: string
  services: {
    database: 'ok' | 'error'
    cache: 'ok' | 'error'
    storage: 'ok' | 'error'
  }
}
