import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosError
} from 'axios'

/**
 * Request interceptors interface for customizing HTTP request/response handling
 * @interface RequestInterceptors
 * @template T - Response data type
 *
 * @property {function} requestInterceptors - Function to modify request configuration before sending
 * @property {function} requestInterceptorsCatch - Function to handle request errors
 * @property {function} responseInterceptors - Function to modify response data after receiving
 * @property {function} responseInterceptorsCatch - Function to handle response errors
 *
 * @example
 * ```typescript
 * const interceptors: RequestInterceptors<ApiResponse> = {
 *   requestInterceptors: (config) => {
 *     config.headers['Custom-Header'] = 'value'
 *     return config
 *   },
 *   responseInterceptors: (response) => {
 *     return response.data
 *   }
 * }
 * ```
 */
interface RequestInterceptors<T> {
  // Request interceptor - modify config before request is sent
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  // Request error interceptor - handle request errors
  requestInterceptorsCatch?: (err: any) => any
  // Response interceptor - modify response data after receiving
  responseInterceptors?: (config: T) => T
  // Response error interceptor - handle response errors
  responseInterceptorsCatch?: (err: any) => any
}

/**
 * Extended request configuration interface that includes custom interceptors
 * @interface RequestConfig
 * @template T - Response data type (defaults to AxiosResponse)
 * @extends AxiosRequestConfig
 *
 * @property {RequestInterceptors<T>} interceptors - Optional custom interceptors for this request
 *
 * @example
 * ```typescript
 * const config: RequestConfig<UserData> = {
 *   url: '/api/users',
 *   method: 'GET',
 *   interceptors: {
 *     responseInterceptors: (response) => response.data
 *   }
 * }
 * ```
 */
interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>
}

export {
  AxiosResponse,
  RequestInterceptors,
  RequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError
}
