import api from './api';
import type { LoginPayload, User } from '@/types';

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const { data } = await api.post('api/auth/login', payload);
  // Backend returns { accessToken, refreshToken, user }
  return { token: data.accessToken, user: data.user };
}

export async function register(payload: Partial<User> & { password: string }) {
  // Endpoint may not exist yet in backend; placeholder
  const { data } = await api.post('api/auth/register', payload);
  return data;
}

export async function fetchProfile(): Promise<User> {
  // Endpoint not implemented in backend; consider storing user in localStorage after login
  const { data } = await api.get('api/auth/me');
  return data;
}
