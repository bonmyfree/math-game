const MS_PER_SECOND = 1000

/** Khi không có `exp` trong JWT và không có `expires_in` hợp lệ từ API. */
export const FALLBACK_ACCESS_TTL_MS = 15 * 60 * MS_PER_SECOND

type JwtPayload = { exp?: number; data?: string }

function readJwtPayload(accessToken: string): JwtPayload | null {
  try {
    const parts = accessToken.split('.')
    if (parts.length < 2) return null
    return JSON.parse(atob(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

/** `exp` trong JWT (unix giây) → epoch ms. */
export function getJwtExpMs(accessToken: string): number | null {
  const exp = readJwtPayload(accessToken)?.exp
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return null
  return exp * MS_PER_SECOND
}

/** Session string từ claim `data` trong JWT (cùng parse một lần với expiry). */
export function sessionFromAccessToken(accessToken: string): string {
  if (!accessToken) return ''
  const data = readJwtPayload(accessToken)?.data
  if (typeof data === 'string' && data.length > 0) return data
  return accessToken.slice(0, 36)
}

/**
 * Một mốc `accessTokenExpiresAt` (epoch ms): ưu tiên JWT `exp`, sau đó `expires_in` (ms từ lúc cấp),
 * cuối cùng {@link FALLBACK_ACCESS_TTL_MS}.
 */
export function computeAccessTokenExpiresAtMs(
  accessToken: string,
  expiresInFromApi?: number | null,
): number {
  const fromJwt = getJwtExpMs(accessToken)
  if (fromJwt != null) return fromJwt
  if (
    typeof expiresInFromApi === 'number' &&
    expiresInFromApi > 0 &&
    Number.isFinite(expiresInFromApi)
  ) {
    return Date.now() + expiresInFromApi
  }
  return Date.now() + FALLBACK_ACCESS_TTL_MS
}
