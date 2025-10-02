import api from './api';
import type { Pagination, User, Role } from '@/types';
import { API_ENDPOINTS } from '@/config/api';

export async function listUsers(params: { page?: number; pageSize?: number; search?: string }) {
  const { data } = await api.get<Pagination<User>>(API_ENDPOINTS.USERS.LIST, { params });
  return data;
}

export async function updateUserRole(userId: number, role: Role) {
  const { data } = await api.patch<User>(API_ENDPOINTS.USERS.ROLE(userId), { role });
  return data;
}

export async function toggleUserActive(userId: number, isActive: boolean) {
  const { data } = await api.patch<User>(API_ENDPOINTS.USERS.ACTIVE(userId), { isActive });
  return data;
}
