<template>
  <div class="card mb-3 dashboard-header-card rounded-0">
    <div
      class="card-body d-flex flex-wrap justify-content-between align-items-center py-2"
    >
      <div>
        <h6 class="card-title mb-1">Dashboard sinh viên</h6>
        <div class="text-muted small">
          Tổng quan nhanh về bài thi và phòng thi.
        </div>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary mt-2 mt-sm-0"
        @click="reload"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-1"
        ></span>
        <i v-else class="bi bi-arrow-clockwise me-1"></i>
        Làm mới
      </button>
    </div>
  </div>

  <div class="row g-3 justify-content-center align-items-top p-1">
    <!-- Last attempt card -->
    <div class="col-12 col-md-6 col-lg-6">
      <div class="card dashboard-card-small h-100">
        <div
          class="card-header py-2 d-flex justify-content-between align-items-center"
        >
          <span class="fw-semibold small">Bài thi gần nhất</span>
          <span
            v-if="lastAttempt"
            class="badge bg-light text-muted border small"
          >
            Đề #{{ lastAttempt.examId }}
          </span>
        </div>
        <div class="card-body" v-if="lastAttempt">
          <div class="mb-1">
            <div class="text-muted">Đề thi</div>
            <div class="fw-semibold">
              {{ lastAttempt.examTitle || "Không rõ tiêu đề" }}
            </div>
            <div class="text-muted">
              Mã đề: <code>{{ lastAttempt.examCode || "-" }}</code>
            </div>
          </div>
          <div class="mb-2">
            <div class="text-muted">Trạng thái:</div>
            <span class="badge" :class="statusBadgeClass">
              {{ statusText }}
            </span>
            <span v-if="passState !== null" class="ms-2 small">
              Kết quả:
              <span
                class="badge"
                :class="passState ? 'bg-success' : 'bg-danger'"
              >
                {{ passState ? "Đạt" : "Trượt" }}
              </span>
            </span>
          </div>
          <div class="row mb-2 small">
            <div class="col-6 mb-1">
              <div class="text-muted">Điểm</div>
              <div class="fw-semibold">
                {{ lastAttempt.score ?? "-" }}
              </div>
            </div>
            <div class="col-6 mb-1">
              <div class="text-muted">Đúng / Tổng</div>
              <div class="fw-semibold">
                {{ lastAttempt.correctCount ?? 0 }}/{{
                  lastAttempt.totalQuestions ?? 0
                }}
              </div>
            </div>
            <div class="col-6 mb-1">
              <div class="text-muted">Bắt đầu</div>
              <div>{{ fmtDate(lastAttempt.startedAt) }}</div>
            </div>
            <div class="col-6 mb-1">
              <div class="text-muted">Nộp</div>
              <div>{{ fmtDate(lastAttempt.submittedAt) }}</div>
            </div>
            <div class="col-6 mb-1">
              <div class="text-muted">Thời gian làm</div>
              <div>{{ fmtDuration(lastAttempt.timeTakenSec) }}</div>
            </div>
          </div>
          <div class="text-end">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              @click="goToExams"
            >
              <i class="bi bi-ui-checks-grid me-1"></i>
              Xem tất cả bài thi
            </button>
          </div>
        </div>
        <div class="card-body" v-else-if="loadingLastAttempt">
          <div class="d-flex align-items-center">
            <span
              class="spinner-border spinner-border-sm me-2 text-primary"
            ></span>
            <span class="small text-muted">Đang tải thông tin bài thi...</span>
          </div>
        </div>
        <div class="card-body" v-else>
          <div class="text-muted small mb-2">Bạn chưa có bài thi nào.</div>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            @click="goToRooms"
          >
            <i class="bi bi-door-open me-1"></i>
            Vào phòng thi đầu tiên
          </button>
        </div>
      </div>
    </div>

    <!-- Nearest open room card -->
    <div class="col-12 col-md-6 col-lg-6">
      <div class="card dashboard-card-small h-100">
        <div
          class="card-header py-2 d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-2">
            <span class="fw-semibold small"> Phòng thi đang mở gần nhất </span>
            <span v-if="nearestRoom" class="live-pill ms-1">
              <span class="dot"></span>
              <span>LIVE</span>
            </span>
          </div>
          <span
            v-if="nearestRoom"
            class="badge bg-light text-muted border small"
          >
            Phòng #{{ nearestRoom.id }}
          </span>
        </div>
        <div class="card-body" v-if="nearestRoom">
          <div
            class="mb-1 d-flex justify-content-between align-items-center small"
          >
            <div class="fw-semibold">
              Mã phòng: <code>{{ nearestRoom.code }}</code>
            </div>
            <div class="text-muted">Đề #{{ nearestRoom.examId }}</div>
          </div>
          <div class="mb-2 small">
            <div>
              <span class="text-muted">Mở:</span>
              <span class="ms-1">{{ fmtDate(nearestRoom.openAt) }}</span>
            </div>
            <div>
              <span class="text-muted">Đóng:</span>
              <span class="ms-1">{{ fmtDate(nearestRoom.closeAt) }}</span>
            </div>
            <div>
              <span class="text-muted">Thời gian:</span>
              <span class="ms-1">
                {{
                  nearestRoom.durationSec
                    ? Math.round(nearestRoom.durationSec / 60) + " phút"
                    : "Không giới hạn"
                }}
              </span>
            </div>
            <div v-if="timeLeftText" class="mt-1">
              <span class="text-muted">Còn lại:</span>
              <span
                class="ms-1 fw-semibold"
                :class="isClosingSoon ? 'text-danger' : ''"
              >
                {{ timeLeftText }}
              </span>
            </div>
          </div>
          <div class="text-end">
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="enterNearestRoom"
            >
              <i class="bi bi-play-fill me-1"></i>
              Vào phòng thi
            </button>
          </div>
        </div>
        <div class="card-body" v-else-if="loadingRooms">
          <div class="d-flex align-items-center">
            <span
              class="spinner-border spinner-border-sm me-2 text-primary"
            ></span>
            <span class="small text-muted"
              >Đang tải danh sách phòng thi...</span
            >
          </div>
        </div>
        <div class="card-body" v-else>
          <div class="text-muted small mb-2">
            Hiện không có phòng thi nào đang mở.
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="goToRooms"
          >
            <i class="bi bi-list-ul me-1"></i>
            Xem danh sách phòng thi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api, { type Paginated } from "../../api";

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
  correctCount?: number;
  totalQuestions?: number;
  passMarkPercent?: number | null;
  pass?: boolean | null;
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

const router = useRouter();

const loading = ref(false);
const loadingLastAttempt = ref(false);
const loadingRooms = ref(false);

const lastAttempt = ref<AttemptRow | null>(null);
const nearestRoom = ref<RoomSummary | null>(null);

function fmtDate(d: string | null | undefined): string {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function fmtDuration(sec: number | null | undefined): string {
  const s = Number(sec || 0);
  if (!s || s <= 0) return "-";
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

const passState = computed(() => {
  if (!lastAttempt.value) return null as boolean | null;
  if (typeof lastAttempt.value.pass === "boolean") {
    return lastAttempt.value.pass;
  }
  const p = lastAttempt.value.passMarkPercent;
  const sc = lastAttempt.value.score;
  if (typeof p !== "number" || typeof sc !== "number") return null;
  return Number(sc) >= Number(p);
});

const statusText = computed(() => {
  const s = String(lastAttempt.value?.status || "").toUpperCase();
  if (s === "GRADED") return "Đã chấm điểm";
  if (s === "SUBMITTED") return "Đã nộp";
  if (s === "IN_PROGRESS") return "Đang làm";
  return s || "-";
});

const statusBadgeClass = computed(() => {
  const s = String(lastAttempt.value?.status || "").toUpperCase();
  if (s === "GRADED") return "bg-success";
  if (s === "SUBMITTED") return "bg-primary";
  if (s === "IN_PROGRESS") return "bg-warning text-dark";
  return "bg-secondary";
});

const timeLeftText = computed(() => {
  if (!nearestRoom.value || !nearestRoom.value.closeAt) return "";
  const now = Date.now();
  const close = new Date(nearestRoom.value.closeAt).getTime();
  const diffSec = Math.floor((close - now) / 1000);
  if (diffSec <= 0) return "";
  const mm = Math.floor(diffSec / 60);
  const hh = Math.floor(mm / 60);
  const remMin = mm % 60;
  if (hh > 0) {
    return `${hh} giờ ${remMin} phút`;
  }
  return `${mm} phút`;
});

const isClosingSoon = computed(() => {
  if (!nearestRoom.value || !nearestRoom.value.closeAt) return false;
  const now = Date.now();
  const close = new Date(nearestRoom.value.closeAt).getTime();
  const diffSec = Math.floor((close - now) / 1000);
  return diffSec > 0 && diffSec <= 15 * 60; // 15 phút
});

async function loadLastAttempt() {
  loadingLastAttempt.value = true;
  try {
    const { data: first } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { page: 1, pageSize: 1 },
    });
    const total = Number(first.total || 0);
    if (!total) {
      lastAttempt.value = null;
      return;
    }
    const { data: lastPage } = await api.get<Paginated<AttemptRow>>(
      "/attempts",
      {
        params: { page: total, pageSize: 1 },
      }
    );
    lastAttempt.value = lastPage.items[0] || null;
  } catch {
    lastAttempt.value = null;
  } finally {
    loadingLastAttempt.value = false;
  }
}

async function loadNearestRoom() {
  loadingRooms.value = true;
  try {
    const { data } = await api.get<Paginated<RoomSummary>>("/rooms", {
      params: { page: 1, pageSize: 100 },
    });
    const items = (data.items || []) as any[];
    const now = new Date();
    const openRooms = items
      .map((r) => ({
        id: r.id as number,
        examId: r.examId as number,
        code: String(r.code),
        openAt: (r.openAt as string | null) ?? null,
        closeAt: (r.closeAt as string | null) ?? null,
        durationSec:
          typeof r.durationSec === "number" ? (r.durationSec as number) : null,
        shuffleQuestions: !!r.shuffleQuestions,
        shuffleChoices: !!r.shuffleChoices,
        maxAttempts: Number(r.maxAttempts || 0),
        createdAt: String(r.createdAt),
      }))
      .filter((r) => {
        const openOk = !r.openAt || new Date(r.openAt) <= now;
        const closeOk = !r.closeAt || new Date(r.closeAt) >= now;
        return openOk && closeOk;
      });

    if (openRooms.length === 0) {
      nearestRoom.value = null;
      return;
    }

    openRooms.sort((a, b) => {
      const closeA = a.closeAt
        ? new Date(a.closeAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      const closeB = b.closeAt
        ? new Date(b.closeAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      return closeA - closeB;
    });

    nearestRoom.value = openRooms[0];
  } catch {
    nearestRoom.value = null;
  } finally {
    loadingRooms.value = false;
  }
}

async function reload() {
  loading.value = true;
  try {
    await Promise.all([loadLastAttempt(), loadNearestRoom()]);
  } finally {
    loading.value = false;
  }
}

function goToExams() {
  router.push({ name: "student-exams" });
}

function goToRooms() {
  router.push({ name: "student-rooms" });
}

function enterNearestRoom() {
  if (!nearestRoom.value) return;
  router.push({
    name: "student-room-exam",
    params: { roomId: nearestRoom.value.id },
  });
}

onMounted(() => {
  reload();
});
</script>

<style scoped>
.dashboard-header-card {
  font-size: 0.9rem;
}

.dashboard-card-small .card-body {
  padding: 0.75rem 1rem;
}

.dashboard-card-small .card-header {
  padding-left: 1rem;
  padding-right: 1rem;
}

.live-pill {
  width: 38px;
  height: 14px;
  background: #ff1f1f;
  color: #fff;
  border-radius: 6px;
  font: 600 8px / 10px system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05) inset;
  animation: bgBlink 1s infinite steps(1);
}

.live-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  position: relative;
}

.live-pill .dot::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.85);
  opacity: 0.6;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.9;
  }
  70% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@keyframes bgBlink {
  0%,
  50% {
    background: #ff1f1f;
  }
  51%,
  100% {
    background: #d50000;
  }
}
</style>
