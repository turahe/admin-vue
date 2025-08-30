import request from '@/axios'
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  SetPrimaryAddressRequest,
  SetAddressTypeRequest,
  AddressCollectionResponse,
  AddressResourceResponse
} from './types'

/**
 * Addresses API endpoints
 * Based on swagger specification for address management
 */

/**
 * Get all addresses for a specific addressable entity (user or organization)
 * @param addressableType Type of addressable entity (user or organization)
 * @param addressableId ID of the addressable entity
 * @returns Promise with addresses collection
 */
export const getAddressesByEntityApi = (
  addressableType: 'user' | 'organization',
  addressableId: string
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: `/api/v1/addressables/${addressableType}/${addressableId}/addresses`
  })
}

/**
 * Get primary address for a specific addressable entity
 * @param addressableType Type of addressable entity (user or organization)
 * @param addressableId ID of the addressable entity
 * @returns Promise with primary address
 */
export const getPrimaryAddressApi = (
  addressableType: 'user' | 'organization',
  addressableId: string
): Promise<AddressResourceResponse> => {
  return request.get({
    url: `/api/v1/addressables/${addressableType}/${addressableId}/addresses/primary`
  })
}

/**
 * Get addresses by type for a specific addressable entity
 * @param addressableType Type of addressable entity (user or organization)
 * @param addressableId ID of the addressable entity
 * @param addressType Type of address (home, work, billing, shipping, other)
 * @returns Promise with addresses collection
 */
export const getAddressesByTypeApi = (
  addressableType: 'user' | 'organization',
  addressableId: string,
  addressType: 'home' | 'work' | 'billing' | 'shipping' | 'other'
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: `/api/v1/addressables/${addressableType}/${addressableId}/addresses/type/${addressType}`
  })
}

/**
 * Create a new address
 * @param data Address creation data
 * @returns Promise with created address
 */
export const createAddressApi = (data: CreateAddressRequest): Promise<AddressResourceResponse> => {
  return request.post({
    url: '/api/v1/addresses',
    data
  })
}

/**
 * Search addresses by city
 * @param city City name to search for
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with addresses collection
 */
export const searchAddressesByCityApi = (
  city: string,
  limit: number = 10,
  offset: number = 0
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: '/api/v1/addresses/search/city',
    params: { city, limit, offset }
  })
}

/**
 * Search addresses by country
 * @param country Country name to search for
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with addresses collection
 */
export const searchAddressesByCountryApi = (
  country: string,
  limit: number = 10,
  offset: number = 0
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: '/api/v1/addresses/search/country',
    params: { country, limit, offset }
  })
}

/**
 * Search addresses by postal code
 * @param postalCode Postal code to search for
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with addresses collection
 */
export const searchAddressesByPostalCodeApi = (
  postalCode: string,
  limit: number = 10,
  offset: number = 0
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: '/api/v1/addresses/search/postal-code',
    params: { postal_code: postalCode, limit, offset }
  })
}

/**
 * Search addresses by state
 * @param state State name to search for
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with addresses collection
 */
export const searchAddressesByStateApi = (
  state: string,
  limit: number = 10,
  offset: number = 0
): Promise<AddressCollectionResponse> => {
  return request.get({
    url: '/api/v1/addresses/search/state',
    params: { state, limit, offset }
  })
}

/**
 * Get address by ID
 * @param id Address ID
 * @returns Promise with address details
 */
export const getAddressByIdApi = (id: string): Promise<AddressResourceResponse> => {
  return request.get({
    url: `/api/v1/addresses/${id}`
  })
}

/**
 * Update an address
 * @param id Address ID
 * @param data Address update data
 * @returns Promise with updated address
 */
export const updateAddressApi = (
  id: string,
  data: UpdateAddressRequest
): Promise<AddressResourceResponse> => {
  return request.put({
    url: `/api/v1/addresses/${id}`,
    data
  })
}

/**
 * Delete an address
 * @param id Address ID
 * @returns Promise with success response
 */
export const deleteAddressApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/api/v1/addresses/${id}`
  })
}

/**
 * Set address as primary
 * @param id Address ID
 * @param data Set primary address data
 * @returns Promise with success response
 */
export const setAddressAsPrimaryApi = (
  id: string,
  data: SetPrimaryAddressRequest
): Promise<any> => {
  return request.put({
    url: `/api/v1/addresses/${id}/primary`,
    data
  })
}

/**
 * Set address type
 * @param id Address ID
 * @param data Set address type data
 * @returns Promise with success response
 */
export const setAddressTypeApi = (id: string, data: SetAddressTypeRequest): Promise<any> => {
  return request.put({
    url: `/api/v1/addresses/${id}/type`,
    data
  })
}
