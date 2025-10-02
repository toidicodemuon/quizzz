import api from './api';
import type { LoginPayload, User } from '@/types';

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const { data } = await api.post('api/auth/login', payload);
  return data;
}

export async function register(payload: Partial<User> & { password: string }) {
  const { data } = await api.post('api/auth/register', payload);
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get('api/auth/me');
  return data;
}
