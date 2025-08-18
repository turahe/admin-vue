export interface UserLoginType {
  email: string
  password: string
}

export interface UserType {
  id: number
  name: string
  email: string
  email_verified_at?: string
  role?: string
  roleId?: string
  token?: string
}

export interface LoginResponse {
  token: string
  user: UserType
}
