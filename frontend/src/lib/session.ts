const TOKEN_KEY = 'token';
const SESSION_COOKIE = 'session';

/**
 * Oturum bilgisi iki yerde tutulur:
 *  - API token'ı localStorage'da (axios isteklerine eklenir)
 *  - "session" çerezi yalnızca bir işarettir (değerinde gizli bilgi yok); middleware sayfa
 *    yönlendirmesi için buna bakar. Gerçek yetkilendirme her zaman API tarafında yapılır.
 */
export function saveSession(token: string, maxAgeSeconds = 60 * 60 * 24 * 7): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;