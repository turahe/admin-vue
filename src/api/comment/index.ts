import request from '@/axios'
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentCollectionResponse,
  CommentResourceResponse
} from './types'

/**
 * Comments API endpoints
 * Based on swagger specification for comment management
 */

/**
 * Get all comments with pagination
 * @param limit Number of results to return (default: 10)
 * @param offset Number of results to skip (default: 0)
 * @returns Promise with comments collection
 */
export const getCommentsApi = (
  limit: number = 10,
  offset: number = 0
): Promise<CommentCollectionResponse> => {
  return request.get({
    url: '/v1/comments',
    params: { limit, offset }
  })
}

/**
 * Create a new comment
 * @param data Comment creation data
 * @returns Promise with created comment
 */
export const createCommentApi = (data: CreateCommentRequest): Promise<CommentResourceResponse> => {
  return request.post({
    url: '/v1/comments',
    data
  })
}

/**
 * Get comment by ID
 * @param id Comment ID
 * @returns Promise with comment details
 */
export const getCommentByIdApi = (id: string): Promise<CommentResourceResponse> => {
  return request.get({
    url: `/v1/comments/${id}`
  })
}

/**
 * Update a comment
 * @param id Comment ID
 * @param data Comment update data
 * @returns Promise with updated comment
 */
export const updateCommentApi = (
  id: string,
  data: UpdateCommentRequest
): Promise<CommentResourceResponse> => {
  return request.put({
    url: `/v1/comments/${id}`,
    data
  })
}

/**
 * Delete a comment
 * @param id Comment ID
 * @returns Promise with success response
 */
export const deleteCommentApi = (id: string): Promise<any> => {
  return request.delete({
    url: `/v1/comments/${id}`
  })
}

/**
 * Approve a comment
 * @param id Comment ID
 * @returns Promise with success response
 */
export const approveCommentApi = (id: string): Promise<any> => {
  return request.put({
    url: `/v1/comments/${id}/approve`
  })
}

/**
 * Reject a comment
 * @param id Comment ID
 * @returns Promise with success response
 */
export const rejectCommentApi = (id: string): Promise<any> => {
  return request.put({
    url: `/v1/comments/${id}/reject`
  })
}
