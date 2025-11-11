import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api, { type Paginated } from "../api";

export type QuestionLite = { id: number; text: string; explanation: string | null };

export const useQuestionBankStore = defineStore("questionBank", () => {
  // state
  const items = ref<QuestionLite[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const subjectId = ref(0);
  const sort = ref<"asc" | "desc">("desc");
  const search = ref("");

  // actions
  let lastReloadToken = 0;
  async function reload() {
    const token = ++lastReloadToken;
    loading.value = true;
    try {
      const params: any = { page: page.value, pageSize: pageSize.value, sort: sort.value };
      if (subjectId.value > 0) params.subjectId = subjectId.value;
      const { data } = await api.get<Paginated<QuestionLite>>("/questions", { params });
      if (token !== lastReloadToken) return; // discard stale response
      items.value = data.items || [];
      total.value = data.total || 0;
    } finally {
      if (token === lastReloadToken) loading.value = false;
    }
  }
  function setPage(p: number) {
    page.value = Math.max(1, Math.floor(Number(p) || 1));
  }
  function setPageSize(sz: number) {
    pageSize.value = Math.max(1, Math.floor(Number(sz) || 10));
    page.value = 1;
  }
  function setFilters(filters: { subjectId?: number; sort?: "asc" | "desc"; search?: string }) {
    if (typeof filters.subjectId === "number") subjectId.value = filters.subjectId;
    if (typeof filters.sort !== "undefined") sort.value = filters.sort;
    if (typeof filters.search !== "undefined") search.value = filters.search;
  }
  async function addToExam(examId: number, questionIds: number[], points = 1) {
    if (!examId || !Array.isArray(questionIds) || questionIds.length === 0) return;
    await api.post(`/exams/${examId}/questions`, { questionIds, points });
  }
  async function removeFromExam(examId: number, questionIds: number[]) {
    if (!examId || !Array.isArray(questionIds) || questionIds.length === 0) return;
    for (const qid of questionIds) {
      try {
        await api.delete(`/exams/${examId}/questions/${qid}`);
      } catch {
        // ignore
      }
    }
  }

  // getters
  const filteredItems = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return items.value;
    return items.value.filter((it) => it.text.toLowerCase().includes(q) || String(it.id).includes(q));
  });

  return {
    items,
    total,
    page,
    pageSize,
    loading,
    subjectId,
    sort,
    search,
    filteredItems,
    reload,
    setPage,
    setPageSize,
    setFilters,
    addToExam,
    removeFromExam,
  };
});
