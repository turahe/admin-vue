export interface UserLoginType {
  email: string
  password: string
}

export interface LaravelAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: UserType
}

export interface UserType {
  id: number
  name: string
  email: string
  username?: string
  role?: string
  roleId?: string
  permissions?: string[]
  email_verified_at?: string
  created_at?: string
  updated_at?: string
}
