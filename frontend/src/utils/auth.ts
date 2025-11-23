export function getToken(): string {
  return localStorage.getItem("accessToken") || "";
}

export function getRefreshToken(): string {
  return localStorage.getItem("refreshToken") || "";
}

export type AuthUser = {
  id?: number;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
  subjectId?: number | null;
};

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch (_) {
    return null;
  }
}

export function getRole(): string {
  const user = getUser();
  return String(user?.role || "").toUpperCase();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function saveAuth({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}): void {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
