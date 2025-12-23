<template>
  <div class="card rounded-0">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Bài thi đã làm</h5>
    </div>
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center w-100">
          <input
            v-model="search"
            type="search"
            class="form-control form-control-sm me-2 w-50"
            placeholder="Tìm theo mã đề hoặc tiêu đề..."
            @keydown.enter.prevent="reload"
          />
          <button
            class="btn btn-sm btn-outline-secondary w-150px"
            type="button"
            @click="reload"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            <i v-else class="bi bi-arrow-clockwise me-1"></i>
            Tải lại
          </button>
        </div>
      </div>

      <AttemptList
        mode="student"
        :items="filteredItems"
        :loading="loading"
        @view="openDetail"
        @print="printAttempt"
      />
    </div>
  </div>

  <!-- Detail modal (reused component) -->
  <AttemptDetailModal
    :show="showDetail"
    mode="student"
    :detail="detail"
    :exam-config="examConfig"
    :show-close="true"
    @close="closeDetail"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";
import AttemptList from "../../components/attempts/AttemptList.vue";
import AttemptDetailModal from "../../components/attempts/AttemptDetailModal.vue";
import type { AttemptAnswerView } from "../../components/attempts/AttemptAnswersList.vue";
import { openAttemptPrintTab } from "../../utils/printAttempt";

type AttemptRow = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examId: number;
  roomId: number;
  status: string;
  examCode?: string | null;
  examTitle?: string | null;
};

type AttemptDetail = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  studentId: number;
  examId: number;
  examTitle?: string | null;
  examCode?: string | null;
  passMarkPercent?: number | null;
  roomId?: number | null;
  status: string;
  answers: AttemptAnswerView[];
  roomShuffleQuestions?: boolean;
  roomShuffleChoices?: boolean;
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

const items = ref<AttemptRow[]>([]);
const loading = ref(false);
const search = ref("");

const showDetail = ref(false);
const detail = ref<AttemptDetail | null>(null);
const examConfig = ref<ExamConfig | null>(null);
const roomShuffleCache = new Map<
  number,
  { shuffleQuestions: boolean; shuffleChoices: boolean }
>();

const filteredItems = computed(() => {
  const q = (search.value || "").trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((a) => {
    const code = String(a.examCode || "").toLowerCase();
    const title = String(a.examTitle || "").toLowerCase();
    const idStr = `#${a.id}`.toLowerCase();
    return code.includes(q) || title.includes(q) || idStr.includes(q);
  });
});

async function reload() {
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { page: 1, pageSize: 100 },
    });
    items.value = data.items as any;
  } finally {
    loading.value = false;
  }
}

async function getRoomShuffle(roomId?: number | null) {
  if (!roomId) return null;
  const cached = roomShuffleCache.get(roomId);
  if (cached) return cached;
  try {
    const { data } = await api.get<any>(`/rooms/${roomId}`);
    const info = {
      shuffleQuestions: !!data?.shuffleQuestions,
      shuffleChoices: !!data?.shuffleChoices,
    };
    roomShuffleCache.set(roomId, info);
    return info;
  } catch {
    return null;
  }
}

async function openDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    const meta = items.value.find((a) => a.id === id);
    const { data: exam } = await api.get<ExamConfig>(`/exams/${data.examId}`);
    const shuffle = await getRoomShuffle(data.roomId ?? meta?.roomId ?? null);
    detail.value = {
      ...data,
      examCode: data.examCode ?? meta?.examCode ?? exam.code ?? null,
      examTitle: data.examTitle ?? meta?.examTitle ?? exam.title ?? null,
      roomId: data.roomId ?? meta?.roomId ?? null,
      roomShuffleQuestions: shuffle?.shuffleQuestions,
      roomShuffleChoices: shuffle?.shuffleChoices,
    } as any;
    examConfig.value = exam;
    showDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết bài thi");
  }
}

function printAttempt(id: number) {
  const win = openAttemptPrintTab({ attemptId: id, mode: "student" });
  if (!win) {
    alert("Khong the mo cua so in bai thi");
  }
}


function closeDetail() {
  showDetail.value = false;
}

onMounted(() => {
  reload();
});
</script>
