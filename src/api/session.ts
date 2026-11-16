/**
 * In-memory credentials for the Blog API.
 * The access token is attached as Authorization: Bearer. Nothing is written to localStorage.
 * A full page reload clears this module and the user signs in again.
 */
let accessToken = ''
let refreshToken = ''

export function getAccessToken(): string {
  return accessToken
}

export function getRefreshToken(): string {
  return refreshToken
}

export function setTokens(access: string, refresh: string): void {
  accessToken = access
  refreshToken = refresh
}

export function clearSession(): void {
  accessToken = ''
  refreshToken = ''
}
