/**
 * JWT Token utility functions
 */

/**
 * Decode a JWT token and return the payload
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

/**
 * Check if a JWT token is expired
 * @param token JWT token string
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('Token expiration check error:', error)
    return true
  }
}

/**
 * Get the time remaining until token expiration
 * @param token JWT token string
 * @returns Time remaining in seconds, or 0 if expired/invalid
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) return 0

    const currentTime = Math.floor(Date.now() / 1000)
    const timeRemaining = payload.exp - currentTime

    return Math.max(0, timeRemaining)
  } catch (error) {
    console.error('Token time remaining check error:', error)
    return 0
  }
}
