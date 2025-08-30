/**
 * Comment API Types
 * Based on swagger specification for comment management
 */

export interface Comment {
  id: string
  content: string
  author_id: string
  author_name: string
  author_email: string
  post_id?: string
  parent_id?: string
  status: 'pending' | 'approved' | 'rejected'
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

export interface CreateCommentRequest {
  content: string
  author_name: string
  author_email: string
  post_id?: string
  parent_id?: string
  ip_address?: string
  user_agent?: string
}

export interface UpdateCommentRequest {
  content?: string
  author_name?: string
  author_email?: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface CommentCollectionResponse {
  data: Comment[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface CommentResourceResponse {
  data: Comment
}
