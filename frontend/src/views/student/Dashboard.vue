<template>
  <div class="student-dashboard">
    <div class="card border-0 shadow-sm hero mb-4">
      <div
        class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3"
      >
        <div>
          <h3 class="fw-semibold mb-2">Theo dõi phòng thi và bài làm</h3>
          <p class="mb-0 text-muted">
            Vào phòng nhanh, xem bài đã làm và nắm trạng thái phòng đang mở.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link to="/student/rooms" class="btn btn-primary">
            <i class="bi bi-door-open me-1"></i> Vào phòng thi
          </router-link>
          <router-link
            to="/student/exams"
            class="btn btn-outline-light text-dark"
          >
            <i class="bi bi-ui-checks-grid me-1"></i> Xem bài thi
          </router-link>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="card in statCards" :key="card.title" class="col-12 col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex align-items-center gap-3">
            <span :class="['stat-icon', card.bg]">
              <i :class="card.icon"></i>
            </span>
            <div>
              <p class="text-muted text-uppercase small mb-1">
                {{ card.title }}
              </p>
              <h4 class="fw-semibold mb-0">{{ card.value }}</h4>
              <small class="text-muted">{{ card.sub }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-7">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Bài thi gần nhất</h6>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="reload"
                :disabled="loading || loadingLastAttempt"
              >
                <span
                  v-if="loading || loadingLastAttempt"
                  class="spinner-border spinner-border-sm me-1"
                ></span>
                <i v-else class="bi bi-arrow-clockwise me-1"></i>
                Làm mới
              </button>
            </div>
            <div v-if="lastAttempt">
              <div class="d-flex align-items-center gap-3 mb-2">
                <span class="badge bg-light text-muted border"
                  >Đề #{{ lastAttempt.examId }}</span
                >
                <span :class="['badge', statusBadgeClass]">{{
                  statusText
                }}</span>
                <span
                  v-if="passState !== null"
                  :class="['badge', passState ? 'bg-success' : 'bg-danger']"
                >
                  {{ passState ? "Đậu" : "Trượt" }}
                </span>
              </div>
              <div class="fw-semibold mb-1">
                {{ lastAttempt.examTitle || "Chưa có tiêu đề" }}
              </div>
              <div class="text-muted small mb-2">
                Mã đề: <code>{{ lastAttempt.examCode || "-" }}</code>
              </div>
              <div class="row gy-2 small">
                <div class="col-6">
                  <div class="text-muted">Điểm</div>
                  <div class="fw-semibold">{{ lastAttempt.score ?? "-" }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted">Đúng / Tổng</div>
                  <div class="fw-semibold">
                    {{ lastAttempt.correctCount ?? 0 }}/{{
                      lastAttempt.totalQuestions ?? 0
                    }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-muted">Bắt đầu</div>
                  <div>{{ fmtDate(lastAttempt.startedAt) }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted">Nộp</div>
                  <div>{{ fmtDate(lastAttempt.submittedAt) }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted">Thời gian làm</div>
                  <div>{{ fmtDuration(lastAttempt.timeTakenSec) }}</div>
                </div>
              </div>
              <div class="mt-3 text-end">
                <router-link
                  to="/student/exams"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-ui-checks-grid me-1"></i> Xem tất cả bài thi
                </router-link>
              </div>
            </div>
            <div v-else-if="loadingLastAttempt" class="text-muted small">
              <span
                class="spinner-border spinner-border-sm text-primary me-2"
              ></span>
              Đang tải thông tin bài thi...
            </div>
            <div v-else class="text-muted small">
              Bạn chưa có bài thi nào. Hãy vào phòng thi đầu tiên ngay!
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Phòng đang mở</h6>
              <router-link to="/student/rooms" class="small"
                >Xem tất cả</router-link
              >
            </div>
            <div v-if="nearestRoom">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-light text-muted border"
                  >Phòng #{{ nearestRoom.id }}</span
                >
                <span class="live-pill" v-if="isRoomLive(nearestRoom)">
                  <span class="dot"></span>
                  <span>LIVE</span>
                </span>
              </div>
              <!-- <div class="fw-semibold">{{ nearestRoom.code }}</div> -->
              <div class="text-muted small">Đề #{{ nearestRoom.examId }}</div>
              <div class="d-flex flex-wrap gap-3 text-muted small mt-2">
                <span
                  ><i class="bi bi-clock-history me-1"></i
                  >{{ fmtDate(nearestRoom.openAt) }}</span
                >
                <span
                  ><i class="bi bi-hourglass-split me-1"></i
                  >{{ fmtDate(nearestRoom.closeAt) }}</span
                >
              </div>
              <div class="text-muted small mt-2">
                Còn lại:
                <span
                  :class="['fw-semibold', isClosingSoon ? 'text-danger' : '']"
                >
                  {{ timeLeftText || "-" }}
                </span>
              </div>
              <div class="mt-3 text-end">
                <button
                  class="btn btn-sm btn-primary"
                  @click="enterNearestRoom"
                >
                  <i class="bi bi-play-fill me-1"></i> Vào phòng thi
                </button>
              </div>
            </div>
            <div v-else-if="loadingRooms" class="text-muted small">
              <span
                class="spinner-border spinner-border-sm text-primary me-2"
              ></span>
              Đang tải danh sách phòng thi...
            </div>
            <div v-else class="text-muted small">
              Hiện không có phòng thi nào đang mở.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

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
const subjectId = ref<number | null>(null);

const lastAttempt = ref<AttemptRow | null>(null);
const nearestRoom = ref<RoomSummary | null>(null);
const attemptsTotal = ref(0);
const openRooms = ref<RoomSummary[]>([]);

const statCards = computed(() => [
  {
    title: "Bài đã làm",
    value: attemptsTotal.value,
    sub: lastAttempt.value
      ? `Điểm gần nhất: ${lastAttempt.value.score ?? "-"}`
      : "Chưa có bài",
    icon: "bi bi-clipboard-check",
    bg: "bg-primary-soft",
  },
  {
    title: "Phòng đang mở",
    value: openRooms.value.length,
    sub: nearestRoom.value
      ? `Phòng #${nearestRoom.value.id}`
      : "Không có phòng",
    icon: "bi bi-door-open",
    bg: "bg-success-soft",
  },
  {
    title: "Thời gian còn lại",
    value: timeLeftText.value || "-",
    sub: nearestRoom.value
      ? fmtDate(nearestRoom.value.closeAt)
      : "Chưa vào phòng",
    icon: "bi bi-hourglass-split",
    bg: "bg-warning-soft",
  },
]);

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
  return diffSec > 0 && diffSec <= 15 * 60;
});

function isRoomLive(r: RoomSummary): boolean {
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const closeAt = r.closeAt ? new Date(r.closeAt) : null;
  const openOk = !openAt || openAt <= now;
  const closeOk = !closeAt || closeAt >= now;
  return openOk && closeOk;
}

async function loadLastAttempt() {
  loadingLastAttempt.value = true;
  try {
    const { data: first } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { page: 1, pageSize: 1 },
    });
    attemptsTotal.value = Number(first.total || 0);
    if (!attemptsTotal.value) {
      lastAttempt.value = null;
      return;
    }
    const { data: lastPage } = await api.get<Paginated<AttemptRow>>(
      "/attempts",
      {
        params: { page: attemptsTotal.value, pageSize: 1 },
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
      params: {
        page: 1,
        pageSize: 100,
        subjectId: subjectId.value ?? undefined,
      },
    });
    const items = (data.items || []) as RoomSummary[];
    const now = new Date();
    const openList = items.filter((r) => {
      const openOk = !r.openAt || new Date(r.openAt) <= now;
      const closeOk = !r.closeAt || new Date(r.closeAt) >= now;
      return openOk && closeOk;
    });
    openRooms.value = openList;
    if (openList.length === 0) {
      nearestRoom.value = null;
      return;
    }
    openList.sort((a, b) => {
      const closeA = a.closeAt
        ? new Date(a.closeAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      const closeB = b.closeAt
        ? new Date(b.closeAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      return closeA - closeB;
    });
    nearestRoom.value = openList[0];
  } catch {
    nearestRoom.value = null;
    openRooms.value = [];
  } finally {
    loadingRooms.value = false;
  }
}

async function reload() {
  loading.value = true;
  try {
    await ensureSubject();
    await Promise.all([loadLastAttempt(), loadNearestRoom()]);
  } finally {
    loading.value = false;
  }
}

async function ensureSubject() {
  if (subjectId.value !== null) return;
  const cached = getUser();
  if (cached && typeof cached.subjectId === "number") {
    subjectId.value = cached.subjectId;
    return;
  }
  try {
    const { data } = await api.get<any>("/me");
    if (typeof data?.subjectId === "number") {
      subjectId.value = data.subjectId;
    }
  } catch {
    subjectId.value = null;
  }
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
.student-dashboard .hero {
  background: linear-gradient(120deg, #f0f7ff 0%, #f9fdf6 100%);
}
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.bg-primary-soft {
  background: rgba(13, 110, 253, 0.12);
  color: #0d6efd;
}
.bg-success-soft {
  background: rgba(25, 135, 84, 0.12);
  color: #198754;
}
.bg-warning-soft {
  background: rgba(255, 193, 7, 0.16);
  color: #b58100;
}
.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  display: inline-block;
}
.live-pill {
  width: 42px;
  height: 16px;
  background: #ff1f1f;
  color: #fff;
  border-radius: 8px;
  font: 600 9px / 12px system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 6px;
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
