import { defineStore } from 'pinia';
import type { Pagination, Quiz } from '@/types';
import * as QuizService from '@/services/quizzes';

interface QuizState {
  items: Quiz[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
  }),
  actions: {
    async fetch(params: { page?: number; pageSize?: number; search?: string } = {}) {
      this.loading = true;
      try {
        const res: Pagination<Quiz> = await QuizService.listQuizzes({
          page: params.page ?? this.page,
          pageSize: params.pageSize ?? this.pageSize,
          search: params.search,
        });
        this.items = res.items;
        this.total = res.total;
        this.page = res.page;
        this.pageSize = res.pageSize;
      } finally {
        this.loading = false;
      }
    },
  },
});

