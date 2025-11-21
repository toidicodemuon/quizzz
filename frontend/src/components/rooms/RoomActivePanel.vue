<template>
  <div class="card">
    <div
      class="card-header py-2 d-flex justify-content-between align-items-center"
    >
      <div class="d-flex align-items-center gap-2">
        <span class="fw-semibold small">Phòng thi đang mở</span>
        <span v-if="isLive" class="live-pill ms-1">
          <span class="dot"></span>
          <span>LIVE</span>
        </span>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary me-2"
          @click="$emit('refresh')"
          :disabled="loadingRoom"
        >
          <span
            v-if="loadingRoom"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          Tải lại
        </button>
        <button
          v-if="room && isLive"
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="$emit('close-room')"
        >
          Đóng phòng sớm
        </button>
      </div>
    </div>
    <div class="card-body" v-if="room">
      <div class="row small mb-3">
        <div class="col-12 col-md-4 mb-1">
          <div class="text-muted">Số phòng</div>
          <div>
            <code>{{ room.id }}</code>
          </div>
        </div>
        <div class="col-12 col-md-4 mb-1">
          <div class="text-muted">Đề thi</div>
          <div class="fw-semibold">
            {{ examName }}
          </div>
          <div class="text-muted">
            #{{ room.examId }}
            <span v-if="examCode">
              · <code>{{ examCode }}</code>
            </span>
          </div>
        </div>
        <div class="col-12 col-md-4 mb-1">
          <div class="text-muted">Thời lượng</div>
          <div>
            {{
              room.durationSec
                ? Math.round(room.durationSec / 60) + " phút"
                : "Không giới hạn"
            }}
          </div>
          <div class="text-muted">Số lượt tối đa: {{ room.maxAttempts }}</div>
        </div>
        <div class="col-12 col-md-4 mb-1">
          <div class="text-muted">Mở lúc</div>
          <div>{{ fmtDate(room.openAt) }}</div>
        </div>
        <div class="col-12 col-md-4 mb-1">
          <div class="text-muted">Đóng lúc</div>
          <div>{{ fmtDate(room.closeAt) }}</div>
        </div>
        <div class="col-12 col-md-4 mb-1" v-if="timeLeftText">
          <div class="text-muted">Còn lại</div>
          <div
            :class="isClosingSoon ? 'fw-semibold text-danger' : 'fw-semibold'"
          >
            {{ timeLeftText }}
          </div>
        </div>
      </div>

      <AttemptsRealtimeGrid :room-id="room.id" />
    </div>
    <div class="card-body" v-else-if="loadingRoom">
      <div class="d-flex align-items-center small">
        <span class="spinner-border spinner-border-sm me-2 text-primary"></span>
        <span class="text-muted">Đang tải thông tin phòng thi...</span>
      </div>
    </div>
    <div class="card-body" v-else>
      <div class="small text-muted">
        Chưa có phòng thi đang mở cho đề này. Hãy tạo phòng mới ở phần trên.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AttemptsRealtimeGrid from "./AttemptsRealtimeGrid.vue";

type RoomSummary = {
  id: number;
  examId: number;
  code?: string | null;
  openAt: string | null;
  closeAt: string | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: string;
};

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};

const props = defineProps<{
  room: RoomSummary | null;
  exam: ExamSummary | null;
  loadingRoom: boolean;
}>();

const now = ref(Date.now());
let timer: number | null = null;

const isLive = computed(() => {
  if (!props.room) return false;
  const nowDt = new Date(now.value);
  const openAt = props.room.openAt ? new Date(props.room.openAt) : null;
  const closeAt = props.room.closeAt ? new Date(props.room.closeAt) : null;
  const openOk = !openAt || openAt <= nowDt;
  const closeOk = !closeAt || closeAt >= nowDt;
  return openOk && closeOk;
});

const examName = computed(() => {
  return props.exam?.title || "-";
});

const examCode = computed(() => {
  return props.exam?.code ? String(props.exam.code) : "";
});

const timeLeftText = computed(() => {
  if (!props.room || !props.room.closeAt) return "";
  const close = new Date(props.room.closeAt).getTime();
  const diffSec = Math.floor((close - now.value) / 1000);
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
  if (!props.room || !props.room.closeAt) return false;
  const close = new Date(props.room.closeAt).getTime();
  const diffSec = Math.floor((close - now.value) / 1000);
  return diffSec > 0 && diffSec <= 15 * 60;
});

function fmtDate(d: string | null): string {
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

function startNowTimer() {
  stopNowTimer();
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 30000) as unknown as number;
}

function stopNowTimer() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

onMounted(() => {
  startNowTimer();
});

onBeforeUnmount(() => {
  stopNowTimer();
});
</script>

<style scoped>
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
