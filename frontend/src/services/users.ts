import api from './api';
import type { Pagination, User, Role } from '@/types';

export async function listUsers(params: { page?: number; pageSize?: number; search?: string }) {
  const { data } = await api.get<Pagination<User>>('api/users', { params });
  return data;
}

export async function updateUserRole(userId: number, role: Role) {
  const { data } = await api.patch<User>(`api/users/${userId}/role`, { role });
  return data;
}

export async function toggleUserActive(userId: number, isActive: boolean) {
  const { data } = await api.patch<User>(`api/users/${userId}/active`, { isActive });
  return data;
}
