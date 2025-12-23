<template>
  <div class="card rounded-0 mt-0 attempts-grid border-0 px-1">
    <div
      class="card-header py-2 d-flex justify-content-between align-items-center"
    >
      <div class="d-flex flex-column">
        <span class="fw-semibold small">
          Danh sách học viên thi trong
          <span v-if="roomId">phòng #{{ roomId }}</span>
        </span>
        <span class="text-muted small" v-if="!roomId">
          Chọn phòng thi để xem danh sách.
        </span>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <input
            type="number"
            min="1"
            class="form-control form-control-sm"
            style="width: 90px"
            v-model.number="autoRefreshSec"
            :disabled="!roomId"
          />
          <span class="small text-muted">giây</span>
        </div>
        <div class="form-check form-switch mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="autoRefreshAttempts"
            :checked="autoRefreshEnabled"
            :disabled="!roomId"
            @change="toggleAutoRefresh"
          />
          <label class="form-check-label small" for="autoRefreshAttempts">
            Tự động cập nhật
          </label>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="reload"
          :disabled="loading || !roomId"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          Cập nhật
        </button>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0">
          <thead>
            <tr class="text-muted small">
              <th>STT</th>
              <th>Học viên</th>
              <th>Trạng thái</th>
              <th>Đúng/Tổng</th>
              <th>Kết quả</th>
              <th>Bắt đầu</th>
              <th>Nộp bài</th>
              <th>Thời gian làm</th>
              <th class="text-end">Xem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, idx) in attempts" :key="a.id">
              <td>{{ idx + 1 }}</td>
              <td>
                <div class="small">
                  <div v-if="a.studentName">
                    {{ a.studentName }}
                  </div>
                  <div class="text-muted">
                    #{{ a.studentId }}
                    <span v-if="a.studentCode">
                      - <code>{{ a.studentCode }}</code>
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="statusBadge(a).class">
                  {{ statusBadge(a).label }}
                </span>
              </td>
              <td>{{ a.correctCount ?? 0 }}/{{ a.totalQuestions ?? 0 }}</td>
              <td>
                <span v-if="a.pass === true" class="badge bg-success">Đậu</span>
                <span v-else-if="a.pass === false" class="badge bg-danger"
                  >Rớt</span
                >
                <span v-else class="badge bg-secondary">-</span>
              </td>
              <td>{{ fmtDate(a.startedAt) }}</td>
              <td>{{ fmtDate(a.submittedAt) }}</td>
              <td>{{ fmtDuration(a.timeTakenSec) }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="onView(a.id)"
                    :disabled="!roomId"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="onPrint(a.id)"
                    :disabled="!roomId"
                    title="In bai thi"
                  >
                    <i class="bi bi-printer"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && !roomId">
              <td colspan="9" class="text-center text-muted small py-3">
                Chọn phòng thi để xem danh sách học viên.
              </td>
            </tr>
            <tr v-else-if="!loading && attempts.length === 0">
              <td colspan="9" class="text-center text-muted small py-3">
                Chưa có học viên nào trong phòng này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
  activityStatus?: string;
  rawStatus?: string;
  studentName?: string | null;
  studentCode?: string | null;
  correctCount?: number | null;
  totalQuestions?: number | null;
  pass?: boolean | null;
  answerCount?: number | null;
};

const props = defineProps<{
  roomId: number | null;
  autoRefresh?: boolean;
}>();

const emit = defineEmits<{
  (e: "view", id: number): void;
  (e: "print", id: number): void;
  (e: "update:autoRefresh", value: boolean): void;
}>();

const attempts = ref<AttemptRow[]>([]);
const loading = ref(false);
let timer: number | null = null;
const autoRefreshSec = ref(5);

const autoRefreshEnabled = computed(() => props.autoRefresh !== false);

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
  const s = String(a.activityStatus || a.status || "").toUpperCase();
  if (s === "IN_ROOM")
    return { label: "Đã vào phòng", class: "bg-info text-dark" };
  if (s === "IN_PROGRESS")
    return { label: "Đang làm bài", class: "bg-warning text-dark" };
  if (s === "SUBMITTED" || s === "GRADED") {
    return { label: "Đã nộp bài", class: "bg-success" };
  }
  return { label: s || "-", class: "bg-secondary" };
}

async function reload() {
  if (!props.roomId) {
    attempts.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { roomId: props.roomId, page: 1, pageSize: 100 },
    });
    const items = (data.items || []).map((item) => {
      const rawStatus = String(item.status || "").toUpperCase();
      const answerCount =
        typeof (item as any).answerCount === "number"
          ? Number((item as any).answerCount)
          : 0;
      const hasStarted =
        rawStatus !== "IN_PROGRESS"
          ? false
          : item.timeTakenSec !== null &&
            typeof item.timeTakenSec !== "undefined";
      const activityStatus =
        rawStatus === "IN_PROGRESS" && !hasStarted ? "IN_ROOM" : rawStatus;
      return {
        ...item,
        rawStatus,
        activityStatus,
        status: rawStatus,
        answerCount,
      };
    });
    attempts.value = items as any;
  } finally {
    loading.value = false;
  }
}

function startTimer() {
  stopTimer();
  if (!props.roomId || !autoRefreshEnabled.value) return;
  const ms = Math.max(1000, Number(autoRefreshSec.value || 0) * 1000);
  timer = window.setInterval(() => {
    reload();
  }, ms) as unknown as number;
}

function stopTimer() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

function onView(id: number) {
  emit("view", id);
}

function onPrint(id: number) {
  emit("print", id);
}

function toggleAutoRefresh(event: Event) {
  const target = event.target as HTMLInputElement | null;
  const next = !!target?.checked;
  emit("update:autoRefresh", next);
  if (next) {
    startTimer();
  } else {
    stopTimer();
  }
}

watch(
  () => props.roomId,
  () => {
    reload();
    startTimer();
  }
);

watch(autoRefreshEnabled, (enabled) => {
  if (enabled) {
    startTimer();
  } else {
    stopTimer();
  }
});

watch(autoRefreshSec, () => {
  startTimer();
});

onMounted(() => {
  reload();
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped>
.attempts-grid .form-check-input {
  cursor: pointer;
}
</style>
