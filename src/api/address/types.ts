/**
 * Address API Types
 * Based on swagger specification for address management
 */

export interface Address {
  id: string
  addressable_type: 'user' | 'organization'
  addressable_id: string
  address_type: 'home' | 'work' | 'billing' | 'shipping' | 'other'
  is_primary: boolean
  street_address: string
  street_address_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface CreateAddressRequest {
  addressable_type: 'user' | 'organization'
  addressable_id: string
  address_type: 'home' | 'work' | 'billing' | 'shipping' | 'other'
  is_primary?: boolean
  street_address: string
  street_address_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number
  longitude?: number
}

export interface UpdateAddressRequest {
  address_type?: 'home' | 'work' | 'billing' | 'shipping' | 'other'
  is_primary?: boolean
  street_address?: string
  street_address_2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  latitude?: number
  longitude?: number
}

export interface SetPrimaryAddressRequest {
  addressable_type: 'user' | 'organization'
  addressable_id: string
}

export interface SetAddressTypeRequest {
  address_type: 'home' | 'work' | 'billing' | 'shipping' | 'other'
}

export interface AddressCollectionResponse {
  data: Address[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface AddressResourceResponse {
  data: Address
}
