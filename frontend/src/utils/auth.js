export function getToken() {
  return localStorage.getItem('accessToken') || '';
}

export function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function getRole() {
  const user = getUser();
  return String(user?.role || '').toUpperCase();
}

export function isAuthenticated() {
  return !!getToken();
}

export function saveAuth({ accessToken, refreshToken, user }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

