import api from './api';
import type { LoginPayload, User } from '@/types';
import JwtService from '@/services/JwtService';
import { API_ENDPOINTS } from '@/config/api';

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  // Backend returns { accessToken, refreshToken, user }
  return { token: data.accessToken, user: data.user };
}

export async function register(payload: Partial<User> & { password: string }) {
  // Endpoint may not exist yet in backend; placeholder
  const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return data;
}

export async function fetchProfile(): Promise<User> {
  // Endpoint not implemented in backend; consider storing user in localStorage after login
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
  return data;
}
