import request from '@/axios'
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostCollectionResponse,
  PostResourceResponse
} from './types'

/**
 * Posts API endpoints
 * Based on swagger specification for post management
 */

/**
 * Get all posts with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with posts collection
 */
export const getPostsApi = (
  limit: number = 10,
  offset: number = 0
): Promise<PostCollectionResponse> => {
  return request.get({
    url: '/posts',
    params: { limit, offset }
  })
}

/**
 * Create a new post
 * @param data Post creation data
 * @returns Promise with created post
 */
export const createPostApi = (data: CreatePostRequest): Promise<PostResourceResponse> => {
  return request.post({
    url: '/posts',
    data
  })
}

/**
 * Get posts by author
 * @param authorID Author ID
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with posts collection
 */
export const getPostsByAuthorApi = (
  authorID: string,
  limit: number = 10,
  offset: number = 0
): Promise<PostCollectionResponse> => {
  return request.get({
    url: `/posts/author/${authorID}`,
    params: { limit, offset }
  })
}

/**
 * Get post by slug
 * @param slug Post slug
 * @returns Promise with post details
 */
export const getPostBySlugApi = (slug: string): Promise<PostResourceResponse> => {
  return request.get({
    url: `/posts/slug/${slug}`
  })
}

/**
 * Get post by ID
 * @param id Post ID
 * @returns Promise with post details
 */
export const getPostByIdApi = (id: string): Promise<PostResourceResponse> => {
  return request.get({
    url: `/posts/${id}`
  })
}

/**
 * Update a post
 * @param id Post ID
 * @param data Post update data
 * @returns Promise with updated post
 */
export const updatePostApi = (
  id: string,
  data: UpdatePostRequest
): Promise<PostResourceResponse> => {
  return request.put({
    url: `/posts/${id}`,
    data
  })
}

/**
 * Delete a post
 * @param id Post ID
 * @returns Promise with success response
 */
export const deletePostApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/posts/${id}`
  })
}

/**
 * Publish a post
 * @param id Post ID
 * @returns Promise with success response
 */
export const publishPostApi = (id: string): Promise<any> => {
  return request.put({
    url: `/posts/${id}/publish`
  })
}

/**
 * Unpublish a post
 * @param id Post ID
 * @returns Promise with success response
 */
export const unpublishPostApi = (id: string): Promise<any> => {
  return request.put({
    url: `/posts/${id}/unpublish`
  })
}
