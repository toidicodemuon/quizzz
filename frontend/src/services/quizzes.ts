import api from './api';
import type { Pagination, Quiz } from '@/types';
import { API_ENDPOINTS } from '@/config/api';

export async function listQuizzes(params: { page?: number; pageSize?: number; search?: string }) {
  const { data } = await api.get<Pagination<Quiz>>(API_ENDPOINTS.QUIZZES.LIST, { params });
  return data;
}

export async function createQuiz(payload: Partial<Quiz>) {
  const { data } = await api.post<Quiz>(API_ENDPOINTS.QUIZZES.LIST, payload);
  return data;
}

export async function updateQuiz(id: number, payload: Partial<Quiz>) {
  const { data } = await api.patch<Quiz>(API_ENDPOINTS.QUIZZES.ITEM(id), payload);
  return data;
}

export async function deleteQuiz(id: number) {
  const { data } = await api.delete(API_ENDPOINTS.QUIZZES.ITEM(id));
  return data;
}

export async function publishQuiz(id: number) {
  const { data } = await api.post<Quiz>(API_ENDPOINTS.QUIZZES.PUBLISH(id), {});
  return data;
}
