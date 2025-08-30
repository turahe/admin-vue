export interface DepartmentItem {
  id: string
  name: string
  code: string
  slug: string
  parentId: string
  description: string
  type: string
  children?: DepartmentItem[]
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: string
  name?: string
  code?: string
  slug?: string
  parentId?: string
  description?: string
  type?: string
}

export interface DepartmentUserItem {
  id: string
  name: string
  code: string
  slug: string
  parentId: string
  description: string
  type: string
  department: DepartmentItem
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}
