<template>
  <div
    class="modal fade show"
    v-if="show && detail"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    style="display: block"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Bài thi #{{ detail.id }}
            <template v-if="mode === 'student'">
              - {{ detail.examTitle ?? "-" }}
            </template>
            <template v-else>
              -
              {{ detail.studentName ?? "#" + detail.studentId }}
              <span v-if="detail.studentCode" class="text-muted small">
                ({{ detail.studentCode }})
              </span>
            </template>
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2 d-flex flex-wrap gap-3 align-items-center">
            <span><b>Bắt đầu:</b> {{ fmtDate(detail.startedAt) }}</span>
            <span>
              <b>Thời gian làm:</b>
              {{ fmtDurationText(detail.timeTakenSec) }}
            </span>
            <!-- <span v-if="showScore">
              <b>Điểm:</b>
              <strong>{{ detail.score ?? "-" }}</strong>
            </span> -->

            <span>
              <b>Số câu đúng:</b>
              <strong>{{ detailCorrect }}</strong
              >/{{ detailTotal }}
            </span>
            <span>
              <strong>Kết quả:</strong>
              <span v-if="detailPass === true" class="badge bg-success ms-1">
                Đậu
              </span>
              <span
                v-else-if="detailPass === false"
                class="badge bg-danger ms-1"
              >
                Trượt
              </span>
              <span v-else class="badge bg-secondary ms-1">-</span>
            </span>
          </div>

          <template v-if="mode === 'teacher'">
            <hr />
            <AttemptAnswersList
              :answers="detail.answers || []"
              :show-explanation="true"
            />
          </template>
          <template v-else>
            <div v-if="!canReviewNow" class="alert alert-warning">
              Đã hết thời gian xem lại bài thi này.
            </div>
            <div v-else-if="!canShowDetail" class="alert alert-info">
              Bài thi này không cho xem đáp án chi tiết.
            </div>
            <div v-else>
              <AttemptAnswersList
                :answers="detail.answers || []"
                :show-explanation="!!examConfig?.showExplanation"
              />
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show && detail"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AttemptAnswersList, {
  type AttemptAnswerView,
} from "../attempts/AttemptAnswersList.vue";

type BaseAttemptDetail = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examId: number;
  examTitle?: string | null;
  passMarkPercent?: number | null;
  answers: AttemptAnswerView[];
  studentId?: number;
  studentName?: string | null;
  studentCode?: string | null;
};

type ExamConfig = {
  id: number;
  title: string;
  feedbackMode?: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  showScoreImmediately?: boolean;
  showCorrectAnswers?: boolean;
  showExplanation?: boolean;
  reviewWindowMin?: number | null;
  passMarkPercent?: number | null;
};

const props = defineProps<{
  show: boolean;
  mode?: "student" | "teacher";
  detail: BaseAttemptDetail | null;
  examConfig?: ExamConfig | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mode = computed(() => props.mode ?? "student");

function fmtDate(d: any) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch {
    return String(d);
  }
}

function fmtDurationText(sec: any) {
  const s = Number(sec || 0);
  if (!s || s <= 0) return "0 giây";
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const parts: string[] = [];
  if (hh > 0) parts.push(`${hh} giờ`);
  if (mm > 0) parts.push(`${mm} phút`);
  if (ss > 0) parts.push(`${ss} giây`);
  return parts.join(" ");
}

const detail = computed(() => props.detail);

const detailCorrect = computed(() =>
  detail.value
    ? (detail.value.answers || []).filter((a) => !!a.isCorrect).length
    : 0
);
const detailTotal = computed(() =>
  detail.value ? (detail.value.answers || []).length : 0
);
const detailPass = computed(() => {
  const p = detail.value?.passMarkPercent;
  const sc = detail.value?.score;
  if (typeof p !== "number" || typeof sc !== "number") return null;
  return Number(sc) >= Number(p);
});

const canReviewNow = computed(() => {
  // Always allow reviewing attempts; ignore any time-based review window
  return !!detail.value;
});

const showScore = computed(() => {
  if (!detail.value) return false;
  if (mode.value === "teacher") return true;
  if (!props.examConfig) return true;
  if (props.examConfig.feedbackMode === "NONE") return false;
  if (props.examConfig.showScoreImmediately === false) return false;
  return canReviewNow.value;
});

const canShowDetail = computed(() => {
  if (!detail.value) return false;
  if (mode.value === "teacher") return true;
  if (!props.examConfig) return false;
  if (!canReviewNow.value) return false;
  if (props.examConfig.feedbackMode !== "DETAILED") return false;
  if (!props.examConfig.showCorrectAnswers) return false;
  return true;
});

function close() {
  emit("close");
}
</script>
