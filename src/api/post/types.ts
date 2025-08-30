/**
 * Post API Types
 * Based on swagger specification for post management
 */

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  author_id: string
  author_name: string
  status: 'draft' | 'published' | 'archived'
  featured_image?: string
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface CreatePostRequest {
  title: string
  slug?: string
  content: string
  excerpt?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface UpdatePostRequest {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface PostCollectionResponse {
  data: Post[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface PostResourceResponse {
  data: Post
}
