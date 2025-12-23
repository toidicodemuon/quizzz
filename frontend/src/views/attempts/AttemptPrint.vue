<template>
  <div class="attempt-print-page">
    <div class="print-toolbar">
      <div>
        <div class="fw-semibold">Attempt {{ attemptIdLabel }}</div>
        <div v-if="detail?.examTitle" class="small text-muted">
          {{ detail.examTitle }}
          <span v-if="detail?.examCode">({{ detail.examCode }})</span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="doPrint"
        >
          <i class="bi bi-printer me-1"></i>
          Print
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-muted py-4">Loading attempt...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <AttemptDetailModal
      v-else-if="detail"
      :show="true"
      :detail="detail"
      :exam-config="examConfig"
      :mode="mode"
      embedded
      :show-close="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../../api";
import AttemptDetailModal from "../../components/attempts/AttemptDetailModal.vue";
import type { AttemptAnswerView } from "../../components/attempts/AttemptAnswersList.vue";

type AttemptDetail = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examId: number;
  examTitle?: string | null;
  examCode?: string | null;
  passMarkPercent?: number | null;
  roomId?: number | null;
  roomShuffleQuestions?: boolean;
  roomShuffleChoices?: boolean;
  answers: AttemptAnswerView[];
  studentId?: number;
  studentName?: string | null;
  studentCode?: string | null;
};

type ExamConfig = {
  id: number;
  title: string;
  code?: string | null;
  feedbackMode?: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  showScoreImmediately?: boolean;
  showCorrectAnswers?: boolean;
  showExplanation?: boolean;
  reviewWindowMin?: number | null;
  passMarkPercent?: number | null;
};

const route = useRoute();

const mode = computed<"student" | "teacher">(() => {
  const raw = String(route.query.mode || "").toLowerCase();
  return raw === "teacher" ? "teacher" : "student";
});

const attemptId = computed(() => {
  const raw = route.query.attemptId ?? route.query.id ?? "";
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : 0;
});

const attemptIdLabel = computed(() =>
  attemptId.value ? `#${attemptId.value}` : "-"
);

const loading = ref(false);
const error = ref("");
const detail = ref<AttemptDetail | null>(null);
const examConfig = ref<ExamConfig | null>(null);

function doPrint() {
  window.print();
}

async function loadAttempt() {
  const id = attemptId.value;
  if (!id) {
    error.value = "Missing attemptId.";
    detail.value = null;
    examConfig.value = null;
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    let room: any = null;
    let exam: any = null;
    if (data.roomId) {
      try {
        const res = await api.get<any>(`/rooms/${data.roomId}`);
        room = res.data;
      } catch {
        room = null;
      }
    }
    if (data.examId) {
      try {
        const res = await api.get<any>(`/exams/${data.examId}`);
        exam = res.data;
      } catch {
        exam = null;
      }
    }
    detail.value = {
      ...data,
      examTitle: data.examTitle ?? exam?.title ?? null,
      examCode: data.examCode ?? exam?.code ?? null,
      roomShuffleQuestions:
        typeof room?.shuffleQuestions === "boolean"
          ? room.shuffleQuestions
          : undefined,
      roomShuffleChoices:
        typeof room?.shuffleChoices === "boolean"
          ? room.shuffleChoices
          : undefined,
    };
    examConfig.value = mode.value === "student" ? (exam as any) : null;
    document.title = `Attempt #${id}`;
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "";
    error.value = msg || "Unable to load attempt.";
    detail.value = null;
    examConfig.value = null;
  } finally {
    loading.value = false;
  }
}

watch([attemptId, mode], () => {
  loadAttempt();
}, { immediate: true });
</script>

<style scoped>
.attempt-print-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 16px;
}

.print-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 4px 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 12px;
}

@media print {
  .print-toolbar {
    display: none;
  }
  .attempt-print-page {
    padding: 0;
  }
}
</style>
