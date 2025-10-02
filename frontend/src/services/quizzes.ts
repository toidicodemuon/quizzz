import api from './api';
import type { Pagination, Quiz } from '@/types';

export async function listQuizzes(params: { page?: number; pageSize?: number; search?: string }) {
  const { data } = await api.get<Pagination<Quiz>>('api/quizzes', { params });
  return data;
}

export async function createQuiz(payload: Partial<Quiz>) {
  const { data } = await api.post<Quiz>('api/quizzes', payload);
  return data;
}

export async function updateQuiz(id: number, payload: Partial<Quiz>) {
  const { data } = await api.patch<Quiz>(`api/quizzes/${id}`, payload);
  return data;
}

export async function deleteQuiz(id: number) {
  const { data } = await api.delete(`api/quizzes/${id}`);
  return data;
}

export async function publishQuiz(id: number) {
  const { data } = await api.post<Quiz>(`api/quizzes/${id}/publish`, {});
  return data;
}
