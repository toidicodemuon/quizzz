<template>
  <div class="room-create-page">
    <div class="card rounded-0 mb-3">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <div>
          <h5 class="mb-0">Mở phòng thi cho sinh viên</h5>
          <div class="small text-muted">
            Bước 1: chọn đề thi đã publish · Bước 2: tạo phòng · Bước 3:
            theo dõi trạng thái làm bài.
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="showHistory = true"
          >
            <i class="bi bi-clock-history me-1"></i>
            Lịch sử phòng thi
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="toggleConfig"
            :aria-expanded="showConfig ? 'true' : 'false'"
          >
            <i
              class="bi"
              :class="showConfig ? 'bi-chevron-up' : 'bi-chevron-down'"
            ></i>
          </button>
        </div>
      </div>
      <div class="card-body" v-show="showConfig">
        <div class="row g-2 align-items-end">
          <div class="col-12 col-md-4">
            <label class="form-label">Đề thi (chỉ hiển thị đã publish)</label>
            <select
              class="form-select form-select-sm"
              v-model.number="selectedExamId"
              @change="onExamChange"
            >
              <option :value="0" disabled>-- Chọn đề thi --</option>
              <option v-for="e in publishedExams" :key="e.id" :value="e.id">
                #{{ e.id }} - {{ e.title }}
                <span v-if="e.code">({{ e.code }})</span>
              </option>
            </select>
            <div
              class="form-text text-muted"
              v-if="!loadingExams && publishedExams.length === 0"
            >
              Bạn chưa có đề thi nào ở trạng thái PUBLISHED.
            </div>
          </div>
          <div class="col-12 col-md-8">
            <div v-if="!selectedExam" class="alert alert-info mb-0">
              Vui lòng chọn một đề thi đã publish để mở phòng cho sinh viên.
            </div>
            <div v-else>
              <div class="mb-2 small text-muted">
                Đề đã chọn:
                <strong>{{ selectedExam.title }}</strong>
                <span v-if="selectedExam.code" class="ms-1">
                  (Mã đề: <code>{{ selectedExam.code }}</code
                  >)
                </span>
              </div>
              <RoomCreateForm :creating="creating" @submit="handleCreateRoom" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <RoomActivePanel
      :room="activeRoom"
      :exam="selectedExam"
      :loading-room="loadingActiveRoom"
      v-if="selectedExamId"
      class="mb-3"
      @close-room="handleCloseRoom"
      @refresh="loadActiveRoom"
    />

    <RoomHistoryModal
      :show="showHistory"
      :exams="publishedExams"
      @close="showHistory = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";
import RoomCreateForm from "../../components/rooms/RoomCreateForm.vue";
import RoomActivePanel from "../../components/rooms/RoomActivePanel.vue";
import RoomHistoryModal from "../../components/rooms/RoomHistoryModal.vue";

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};

type RoomSummary = {
  id: number;
  examId: number;
  code: string;
  openAt: string | null;
  closeAt: string | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: string;
};

const exams = ref<ExamSummary[]>([]);
const loadingExams = ref(false);
const selectedExamId = ref<number>(0);
const creating = ref(false);
const activeRoom = ref<RoomSummary | null>(null);
const loadingActiveRoom = ref(false);
const showHistory = ref(false);
const showConfig = ref(true);

const publishedExams = computed(() =>
  exams.value.filter(
    (e) => String(e.status || "").toUpperCase() === "PUBLISHED"
  )
);

const selectedExam = computed<ExamSummary | null>(() => {
  if (!selectedExamId.value) return null;
  return (
    publishedExams.value.find((e) => e.id === selectedExamId.value) || null
  );
});

async function ensureExams() {
  loadingExams.value = true;
  try {
    const user = getUser();
    const authorId = Number(user?.id || 0);
    const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
      params: { authorId, pageSize: 200 },
    });
    exams.value = (data.items || []) as any;
  } finally {
    loadingExams.value = false;
  }
}

function normalizeRoom(r: any): RoomSummary {
  return {
    id: Number(r.id),
    examId: Number(r.examId),
    code: String(r.code),
    openAt: (r.openAt as string | null) ?? null,
    closeAt: (r.closeAt as string | null) ?? null,
    durationSec:
      typeof r.durationSec === "number" ? (r.durationSec as number) : null,
    shuffleQuestions: !!r.shuffleQuestions,
    shuffleChoices: !!r.shuffleChoices,
    maxAttempts: Number(r.maxAttempts || 0),
    createdAt: String(r.createdAt),
  };
}

async function loadActiveRoom() {
  if (!selectedExamId.value) {
    activeRoom.value = null;
    return;
  }
  loadingActiveRoom.value = true;
  try {
    const { data } = await api.get<Paginated<RoomSummary>>("/rooms", {
      params: { examId: selectedExamId.value, page: 1, pageSize: 50 },
    });
    const items = (data.items || []) as any[];
    const now = new Date();
    const live = items.filter((r) => {
      const openAt = r.openAt ? new Date(r.openAt) : null;
      const closeAt = r.closeAt ? new Date(r.closeAt) : null;
      const openOk = !openAt || openAt <= now;
      const closeOk = !closeAt || closeAt >= now;
      return openOk && closeOk;
    });
    const picked = (live[0] || items[0]) ?? null;
    activeRoom.value = picked ? normalizeRoom(picked) : null;
  } finally {
    loadingActiveRoom.value = false;
  }
}

async function handleCreateRoom(payload: {
  code: string;
  openAt: string;
  closeAt: string;
  durationMinutes: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
}) {
  if (!selectedExamId.value) return;
  creating.value = true;
  try {
    const body: any = {
      examId: selectedExamId.value,
      code: payload.code || undefined,
      openAt: payload.openAt ? new Date(payload.openAt) : null,
      closeAt: payload.closeAt ? new Date(payload.closeAt) : null,
      durationSec: payload.durationMinutes
        ? Number(payload.durationMinutes) * 60
        : null,
      shuffleQuestions: !!payload.shuffleQuestions,
      shuffleChoices: !!payload.shuffleChoices,
      maxAttempts: payload.maxAttempts || 1,
    };
    await api.post("/rooms", body);
    await loadActiveRoom();
    showConfig.value = false;
  } catch (e: any) {
    alert(e?.message || "Không thể tạo phòng thi");
  } finally {
    creating.value = false;
  }
}

async function handleCloseRoom() {
  if (!activeRoom.value) return;
  if (
    !window.confirm(
      "Bạn chắc chắn muốn đóng phòng thi này ngay bây giờ? Sinh viên sẽ không thể vào thêm."
    )
  ) {
    return;
  }
  try {
    await api.post(`/rooms/${activeRoom.value.id}/close`);
    await loadActiveRoom();
  } catch (e: any) {
    alert(e?.message || "Không thể đóng phòng thi");
  }
}

function onExamChange() {
  loadActiveRoom();
}

function toggleConfig() {
  showConfig.value = !showConfig.value;
}

onMounted(async () => {
  await ensureExams();
  if (publishedExams.value.length > 0) {
    selectedExamId.value = publishedExams.value[0].id;
    await loadActiveRoom();
  }
});
</script>

<style scoped>
.room-create-page code {
  font-size: 0.9rem;
}
</style>
