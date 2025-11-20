<template>
  <div class="card mt-3">
    <div
      class="card-header py-2 d-flex justify-content-between align-items-center"
    >
      <span class="fw-semibold small">
        Trạng thái làm bài của sinh viên
      </span>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="reload"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-1"
        ></span>
        Làm mới
      </button>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0">
          <thead>
            <tr class="text-muted small">
              <th>#</th>
              <th>Sinh viên</th>
              <th>Trạng thái</th>
              <th>Bắt đầu</th>
              <th>Nộp bài</th>
              <th>Thời gian làm</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in attempts" :key="a.id">
              <td>{{ a.id }}</td>
              <td>
                <div class="small">
                  <div v-if="a.studentName">
                    {{ a.studentName }}
                  </div>
                  <div class="text-muted">
                    #{{ a.studentId }}
                    <span v-if="a.studentCode">
                      · <code>{{ a.studentCode }}</code>
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="statusBadge(a).class">
                  {{ statusBadge(a).label }}
                </span>
              </td>
              <td>{{ fmtDate(a.startedAt) }}</td>
              <td>{{ fmtDate(a.submittedAt) }}</td>
              <td>{{ fmtDuration(a.timeTakenSec) }}</td>
              <td>{{ a.score ?? "-" }}</td>
            </tr>
            <tr v-if="!loading && attempts.length === 0">
              <td colspan="7" class="text-center text-muted small py-3">
                Chưa có sinh viên nào trong phòng này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";

type AttemptRow = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  studentId: number;
  roomId: number;
  status: string;
  studentName?: string | null;
  studentCode?: string | null;
};

const props = defineProps<{
  roomId: number | null;
}>();

const attempts = ref<AttemptRow[]>([]);
const loading = ref(false);
let timer: number | null = null;

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

function statusBadge(a: AttemptRow): { label: string; class: string } {
  const s = String(a.status || "").toUpperCase();
  if (s === "IN_PROGRESS") {
    const started = new Date(a.startedAt).getTime();
    const diffSec = (Date.now() - started) / 1000;
    if (!Number.isNaN(diffSec) && diffSec <= 60) {
      return { label: "Đã vào phòng", class: "bg-info text-dark" };
    }
    return { label: "Đang làm bài", class: "bg-warning text-dark" };
  }
  if (s === "SUBMITTED") {
    return { label: "Đã nộp bài", class: "bg-primary" };
  }
  if (s === "GRADED") {
    return { label: "Đã chấm điểm", class: "bg-success" };
  }
  return { label: s || "-", class: "bg-secondary" };
}

async function reload() {
  if (!props.roomId) {
    attempts.value = [];
    return;
  }
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { roomId: props.roomId, page: 1, pageSize: 100 },
    });
    attempts.value = (data.items || []) as any;
  } finally {
    loading.value = false;
  }
}

function startTimer() {
  stopTimer();
  timer = window.setInterval(() => {
    reload();
  }, 5000) as unknown as number;
}

function stopTimer() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

onMounted(() => {
  reload();
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped></style>

