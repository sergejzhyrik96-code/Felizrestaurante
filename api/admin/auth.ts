const ADMIN_COOKIE = "feliz_admin";
const MAX_AGE = 60 * 60 * 24; // 24h

export function getAdminToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isAdminAuthenticated(request: Request): boolean {
  const token = getAdminToken(request);
  if (!token) return false;
  try {
    const expected = process.env.ADMIN_PASSWORD;
    return !!expected && token === expected;
  } catch {
    return false;
  }
}

export function adminCookieHeader(token: string): string {
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax`;
}

export function clearAdminCookieHeader(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
