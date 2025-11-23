<template>
  <div class="dashboard">
    <div class="card border-0 shadow-sm hero mb-4">
      <div
        class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3"
      >
        <div>
          <p class="text-uppercase text-muted small mb-1">Xin chào, giáo viên</p>
          <h3 class="fw-semibold mb-2">Bảng điều khiển giám sát lớp thi</h3>
          <p class="mb-0 text-muted">
            Theo dõi nhanh đề thi, phòng đang mở và hoạt động làm bài theo thời gian thực.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link to="/teacher/quiz/create" class="btn btn-primary">
            <i class="bi bi-plus-circle me-1"></i> Tạo đề thi
          </router-link>
          <router-link to="/teacher/room/create" class="btn btn-outline-light text-dark">
            <i class="bi bi-door-open me-1"></i> Mở phòng thi
          </router-link>
          <router-link to="/teacher/question-bank" class="btn btn-outline-light text-dark">
            <i class="bi bi-journal-text me-1"></i> Ngân hàng câu hỏi
          </router-link>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="card in statCards" :key="card.title" class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex align-items-center gap-3">
            <span :class="['stat-icon', card.bg]">
              <i :class="card.icon"></i>
            </span>
            <div>
              <p class="text-muted text-uppercase small mb-1">{{ card.title }}</p>
              <h4 class="fw-semibold mb-0">{{ card.value }}</h4>
              <small class="text-muted">{{ card.sub }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Hoạt động gần đây</h6>
              <span class="badge bg-light text-muted">Live</span>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="(item, idx) in recent"
                :key="idx"
                class="list-group-item px-0 d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center gap-3">
                  <span class="bullet"></span>
                  <div>
                    <div class="fw-semibold">{{ item.title }}</div>
                    <small class="text-muted">{{ item.desc }}</small>
                  </div>
                </div>
                <small class="text-muted">{{ item.time }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Phòng thi nhanh</h6>
              <router-link to="/teacher/room/create" class="small">Xem tất cả</router-link>
            </div>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="(room, idx) in quickRooms"
                :key="idx"
                class="p-3 rounded border bg-light"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="fw-semibold">Phòng #{{ room.id }}</div>
                    <small class="text-muted">{{ room.exam }}</small>
                  </div>
                  <span :class="['badge', room.live ? 'bg-success' : 'bg-secondary']">
                    {{ room.live ? "Đang mở" : "Chưa mở" }}
                  </span>
                </div>
                <div class="d-flex gap-3 mt-2 text-muted small">
                  <span><i class="bi bi-people me-1"></i>{{ room.attendees }} SV</span>
                  <span><i class="bi bi-clock-history me-1"></i>{{ room.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";

defineOptions({
  name: "TeacherDashboard",
});

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};

type RoomRow = {
  id: number;
  examId: number;
  examTitle?: string;
  openAt: string | null;
  closeAt: string | null;
  createdAt: string;
};

type AttemptRow = {
  id: number;
  studentName?: string | null;
  studentId: number;
  roomId: number;
  examTitle?: string | null;
  submittedAt: string | null;
  status: string;
};

const loading = ref(false);
const stats = ref({
  examsTotal: 0,
  roomsTotal: 0,
  roomsLive: 0,
  activeStudents: 0,
  attemptsToday: 0,
});
const recentAttempts = ref<AttemptRow[]>([]);
const rooms = ref<RoomRow[]>([]);

const statCards = computed(() => [
  {
    title: "Đề thi",
    value: stats.value.examsTotal,
    sub: `${stats.value.roomsLive} phòng đang mở`,
    icon: "bi bi-file-earmark-text",
    bg: "bg-primary-soft",
  },
  {
    title: "Phòng thi",
    value: stats.value.roomsTotal,
    sub: `${stats.value.roomsLive} trực tuyến`,
    icon: "bi bi-door-open",
    bg: "bg-success-soft",
  },
  {
    title: "Học viên đang thi",
    value: stats.value.activeStudents,
    sub: "Trạng thái live",
    icon: "bi bi-people",
    bg: "bg-warning-soft",
  },
  {
    title: "Bài nộp hôm nay",
    value: stats.value.attemptsToday,
    sub: "Tự động chấm",
    icon: "bi bi-clipboard-check",
    bg: "bg-info-soft",
  },
]);

const recent = computed(() =>
  recentAttempts.value.slice(0, 4).map((a) => ({
    title: `Bài #${a.id} ${statusLabel(a.status)}`,
    desc: a.examTitle || `Phòng #${a.roomId}`,
    time: a.submittedAt ? fmtTimeAgo(a.submittedAt) : "Vừa xảy ra",
  }))
);

const quickRooms = computed(() =>
  rooms.value.slice(0, 3).map((r) => ({
    id: r.id,
    exam: r.examTitle || `Đề #${r.examId}`,
    attendees: stats.value.activeStudents, // placeholder until backend provides per-room count
    time: fmtRange(r.openAt, r.closeAt),
    live: isRoomLive(r),
  }))
);

function isRoomLive(r: RoomRow): boolean {
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const closeAt = r.closeAt ? new Date(r.closeAt) : null;
  const openOk = !openAt || openAt <= now;
  const closeOk = !closeAt || closeAt >= now;
  return openOk && closeOk;
}

function fmtRange(openAt: string | null, closeAt: string | null): string {
  const fmt = (d: string | null) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}/${mm} ${hh}:${mi}`;
  };
  return `${fmt(openAt)} - ${fmt(closeAt)}`;
}

function fmtTimeAgo(d: string): string {
  const dt = new Date(d);
  const diff = Date.now() - dt.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

function statusLabel(s: string): string {
  const up = String(s || "").toUpperCase();
  if (up === "SUBMITTED" || up === "GRADED") return "đã nộp";
  if (up === "IN_PROGRESS") return "đang làm";
  return "vừa cập nhật";
}

async function loadDashboard() {
  loading.value = true;
  try {
    const [examsRes, roomsRes, attemptsRes] = await Promise.all([
      api.get<Paginated<ExamSummary>>("/exams", { params: { page: 1, pageSize: 50 } }),
      api.get<Paginated<RoomRow>>("/rooms", { params: { page: 1, pageSize: 20 } }),
      api.get<Paginated<AttemptRow>>("/attempts", { params: { page: 1, pageSize: 20 } }),
    ]);

    const examItems = (examsRes.data.items || []) as ExamSummary[];
    const roomItems = (roomsRes.data.items || []) as RoomRow[];
    const attemptItems = (attemptsRes.data.items || []) as AttemptRow[];

    rooms.value = roomItems;
    recentAttempts.value = attemptItems;

    const liveRooms = roomItems.filter(isRoomLive).length;
    const activeStudents = attemptItems.filter(
      (a) => String(a.status || "").toUpperCase() === "IN_PROGRESS"
    ).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attemptsToday = attemptItems.filter((a) => {
      if (!a.submittedAt) return false;
      const dt = new Date(a.submittedAt);
      return dt >= today;
    }).length;

    stats.value = {
      examsTotal: examItems.length,
      roomsTotal: roomItems.length,
      roomsLive: liveRooms,
      activeStudents,
      attemptsToday,
    };
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<style scoped>
.dashboard .hero {
  background: linear-gradient(120deg, #f0f5ff 0%, #f6fdf6 100%);
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
.bg-info-soft {
  background: rgba(13, 202, 240, 0.16);
  color: #0aa2c0;
}
.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  display: inline-block;
}
.date-picker-wrap .form-control[readonly] {
  background-color: #fff;
}
</style>
