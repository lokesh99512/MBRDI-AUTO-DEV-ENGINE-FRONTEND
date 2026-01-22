import { JWTPayload, User } from '@/types';

/**
 * Decode JWT token payload (without verification)
 * Note: This is client-side decoding only. Server should verify the token.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Extract user info from JWT token
 */
export function extractUserFromToken(token: string): User | null {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.userId,
    userId: payload.userId,
    email: payload.email,
    username: payload.sub,
    tenantId: payload.tenantId,
    role: (payload.role as User['role']) || 'USER',
  };
}

/**
 * Get remaining time until token expires (in seconds)
 */
export function getTokenExpiryTime(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
}
