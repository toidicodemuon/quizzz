<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Phòng thi đang mở</h5>
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="reload"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
        Tải lại
      </button>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div
          class="col-12 col-md-6 col-lg-4"
          v-for="r in openRooms"
          :key="r.id"
        >
          <div class="card h-100 border-success">
            <div class="card-body d-flex flex-column">
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <strong>Phòng #{{ r.id }}</strong>
                <span class="badge bg-success">Đang mở</span>
              </div>
              <div class="small text-muted mb-1">
                Mã phòng: <code>{{ r.code }}</code>
              </div>
              <div class="small text-muted mb-1">
                Đề thi:
                <span class="fw-semibold">{{ r.examTitle || "-" }}</span>
              </div>
              <div class="small text-muted mb-1">
                Thời gian: <span>{{ r.durationText }}</span>
              </div>
              <div class="small text-muted mb-2">
                Mở: {{ r.openText }}<br />
                Đóng: {{ r.closeText }}
              </div>
              <div class="mt-auto text-center">
                <button
                  class="btn btn-sm btn-primary px-3"
                  type="button"
                  @click="enterRoom(r)"
                >
                  <i class="bi bi-play-fill me-1"></i>
                  Vào thi
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!loading && openRooms.length === 0" class="col-12">
          <div class="alert alert-info mb-0">
            Hiện không có phòng thi nào đang mở.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../api";

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
  examTitle?: string | null;
};

const rooms = ref<RoomSummary[]>([]);
const loading = ref(false);
const router = useRouter();

function fmtDate(d: string | null): string {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

const openRooms = computed(() => {
  const now = new Date();
  return rooms.value
    .filter((r) => {
      const openOk = !r.openAt || new Date(r.openAt) <= now;
      const closeOk = !r.closeAt || new Date(r.closeAt) >= now;
      return openOk && closeOk;
    })
    .map((r) => ({
      ...r,
      openText: fmtDate(r.openAt),
      closeText: fmtDate(r.closeAt),
      durationText: r.durationSec
        ? `${Math.round(r.durationSec / 60)} phút`
        : "Không giới hạn",
    }));
});

async function reload() {
  loading.value = true;
  try {
    const { data } = await api.get<{ items: RoomSummary[]; total: number }>(
      "/rooms",
      {
        params: { page: 1, pageSize: 100 },
      }
    );
    // TODO: backend could be extended to include exam title; for now keep as-is
    rooms.value = (data.items as any[]).map((r) => ({
      ...r,
      openAt: (r as any).openAt ?? null,
      closeAt: (r as any).closeAt ?? null,
    }));
  } finally {
    loading.value = false;
  }
}

function enterRoom(r: RoomSummary) {
  router.push({ name: "student-room-exam", params: { roomId: r.id } });
}

onMounted(() => {
  reload();
});
</script>
