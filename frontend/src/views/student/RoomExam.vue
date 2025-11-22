<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0">Làm bài thi</h5>
        <div class="small text-muted">
          Phòng #{{ roomId }} - Đề thi #{{ examId }}
        </div>
      </div>
      <div class="text-end">
        <div class="d-flex align-items-center gap-2 justify-content-end">
          <div>
            <div>Thời gian còn lại:</div>
            <div class="fw-bold" :class="timeLeft <= 60 ? 'text-danger' : ''">
              {{ countdownText }}
            </div>
          </div>
          <button
            v-if="started && !submitted"
            class="btn btn-sm btn-primary"
            type="button"
            @click="confirmSubmit"
            :disabled="submitting"
            title="Nộp bài"
          >
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            Nộp bài
          </button>
        </div>
      </div>
    </div>

    <div class="card-body" v-if="loaded && !submitting && !submitted">
      <template v-if="!started">
        <div class="mb-3 alert alert-info">
          <div><strong>Thông tin phòng thi</strong></div>
          <div v-if="durationSec">
            Tổng thời gian làm bài: {{ Math.round(durationSec / 60) }} phút.
          </div>
          <div v-else>Thời gian làm bài: không giới hạn.</div>
          <div class="small mt-1">
            Bấm <strong>Bắt đầu làm bài</strong> để hiện câu hỏi và bắt đầu đếm
            giờ.
          </div>
        </div>
        <div class="text-center mt-4">
          <button
            class="btn btn-primary"
            type="button"
            @click="beginExam"
            :disabled="startingExam"
          >
            <span
              v-if="startingExam"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            <i v-else class="bi bi-play-fill me-1"></i>
            Bắt đầu làm bài
          </button>
        </div>
      </template>
      <template v-else>
        <div class="mb-3 alert alert-info" v-if="durationSec">
          Tổng thời gian: {{ Math.round(durationSec / 60) }} phút.
        </div>
        <div v-for="(q, idx) in questions" :key="q.questionId" class="mb-3">
          <div class="fw-semibold mb-1">
            Câu {{ idx + 1 }}: {{ q.questionText }}
          </div>
          <div class="ms-3">
            <div v-for="ch in q.choices" :key="ch.id" class="form-check">
              <input
                class="form-check-input"
                type="radio"
                :name="'q-' + q.questionId"
                :id="'q-' + q.questionId + '-c-' + ch.id"
                :value="ch.id"
                v-model="answers[q.questionId]"
              />
              <label
                class="form-check-label"
                :for="'q-' + q.questionId + '-c-' + ch.id"
              >
                {{ ch.content }}
              </label>
            </div>
          </div>
        </div>
        <div class="text-end mt-4">
          <button class="btn btn-outline-secondary me-2" @click="confirmSubmit">
            Nộp bài
          </button>
        </div>
      </template>
    </div>

    <div class="card-body" v-else-if="submitting">
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3"></div>
        <div>Đang nộp bài...</div>
      </div>
    </div>

    <div class="card-body" v-else-if="submitted">
      <div class="alert alert-success mb-3">Đã nộp bài thành công.</div>
      <div v-if="result">
        <div class="mb-2">
          Điểm: <strong>{{ result.score ?? "-" }}</strong>
        </div>
        <div class="mb-2">
          Kết quả:
          <span v-if="pass === true" class="badge bg-success"> Đạt </span>
          <span v-else-if="pass === false" class="badge bg-danger">
            Trượt
          </span>
          <span v-else class="badge bg-secondary">-</span>
        </div>
      </div>
      <AttemptAnswersList
        v-if="showReview && detail"
        :answers="detail.answers"
        :show-explanation="detail.showExplanation"
      />
    </div>

    <div class="card-body" v-else>
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3"></div>
        <div>Đang tải dữ liệu...</div>
      </div>
    </div>
  </div>

  <div
    v-if="showWarning30s && !submitted"
    class="warning-toast shadow"
    role="alert"
    :style="{
      left: warningPos.x + 'px',
      top: warningPos.y + 'px',
      cursor: 'move',
    }"
    @mousedown.stop="startDragWarning"
  >
    <div class="d-flex align-items-start">
      <div class="me-3">
        <div class="fw-semibold">Sắp hết giờ</div>
        <div class="small text-muted">Hệ thống sẽ tự động nộp sau:</div>
        <div class="display-5 lh-1 text-danger mt-1">
          {{ warningSecondsLeft }}s
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="confirmSubmit"
          :disabled="submitting"
        >
          Nộp ngay
        </button>
        <button
          type="button"
          class="btn btn-sm btn-light"
          @click="closeWarning"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showTimeUpModal"
    class="modal fade show timeup-modal"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hết thời gian</h5>
        </div>
        <div class="modal-body">
          <p class="mb-2">
            Thời gian làm bài đã kết thúc. Hệ thống đã tự động nộp bài của bạn.
          </p>
          <p class="text-muted small mb-0">
            Nếu thấy chưa được cập nhật, vui lòng kiểm tra lại lịch sử bài thi.
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="showTimeUpModal = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showTimeUpModal" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api";
import AttemptAnswersList, {
  type AttemptAnswerView,
} from "../../components/attempts/AttemptAnswersList.vue";

const route = useRoute();
const router = useRouter();

const roomId = Number(route.params.roomId);
const examId = ref<number | null>(null);
const durationSec = ref<number | null>(null);

type QuestionView = {
  questionId: number;
  questionText: string;
  choices: { id: number; content: string }[];
};

const questions = ref<QuestionView[]>([]);
const answers = reactive<Record<number, number | undefined>>({});

type AttemptMeta = {
  id: number;
  roomId: number;
  examId: number;
  status: string;
  startedAt: string | null;
  timeTakenSec: number | null;
};
const attemptMeta = ref<AttemptMeta | null>(null);

const loaded = ref(false);
const submitting = ref(false);
const submitted = ref(false);
const result = ref<{
  score: number | null;
  passMarkPercent: number | null;
} | null>(null);

const detail = ref<{
  answers: AttemptAnswerView[];
  showExplanation: boolean;
} | null>(null);

const timeLeft = ref(0);
const started = ref(false);
const startingExam = ref(false);
const autoSubmitting = ref(false);
const warnedAt30s = ref(false);
const showTimeUpModal = ref(false);
const showWarning30s = ref(false);
const warningSecondsLeft = ref(30);
const warningDismissed = ref(false);
const warningPos = ref<{ x: number; y: number }>(
  typeof window !== "undefined"
    ? {
        x: Math.max(12, Math.floor(window.innerWidth / 2 - 180)),
        y: Math.max(12, window.innerHeight - 220),
      }
    : { x: 12, y: 12 }
);
const warningDragging = ref(false);
const warningOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 });
let timer: number | undefined;

const countdownText = computed(() => {
  const s = Math.max(0, timeLeft.value);
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
});

const pass = computed(() => {
  if (!result.value) return null;
  const p = result.value.passMarkPercent;
  const sc = result.value.score;
  if (typeof p !== "number" || typeof sc !== "number") return null;
  return sc >= p;
});

const ATTEMPT_SUBMITTED_CODE = "ATTEMPT_ALREADY_SUBMITTED";

function parseApiError(err: any): { message: string; code?: string } {
  const message = err?.response?.data?.message || err?.message || "";
  const code =
    typeof err?.response?.data?.code === "string"
      ? err.response.data.code
      : undefined;
  return { message, code };
}

async function ensureAttemptCanBegin(opts?: {
  activate?: boolean;
}): Promise<AttemptMeta | null> {
  try {
    const { data } = await api.post<AttemptMeta>("/attempts/begin", {
      roomId,
      activate: !!opts?.activate,
    });
    return data;
  } catch (e: any) {
    const { message, code } = parseApiError(e);
    const normalized = (message || "").toLowerCase();
    const alreadySubmitted =
      code === ATTEMPT_SUBMITTED_CODE ||
      normalized.includes("attempt already submitted");
    const friendly = alreadySubmitted
      ? "Bạn đã làm bài thi này rồi, không thể vào phòng làm tiếp."
      : message || "Không thể vào phòng thi.";
    alert(friendly);
    if (alreadySubmitted) {
      router.replace({ name: "student-exams" });
    }
    return null;
  }
}

async function loadRoom() {
  const { data: room } = await api.get<any>(`/rooms/${roomId}`);
  examId.value = room.examId;
  durationSec.value = room.durationSec ?? null;
  if (durationSec.value) {
    timeLeft.value = durationSec.value;
  }
}

async function fetchAttemptMeta(): Promise<AttemptMeta | null> {
  try {
    const { data } = await api.get<any>("/attempts", {
      params: { roomId, page: 1, pageSize: 1 },
    });
    const first = Array.isArray(data?.items) ? data.items[0] : null;
    if (!first) return null;
    return {
      id: first.id,
      roomId: first.roomId,
      examId: first.examId,
      status: first.status,
      startedAt: first.startedAt ?? null,
      timeTakenSec:
        typeof first.timeTakenSec === "number"
          ? Number(first.timeTakenSec)
          : null,
    };
  } catch {
    return null;
  }
}

async function loadQuestions() {
  if (!examId.value) return;
  const { data } = await api.get<any>(`/questions`, {
    params: { examId: examId.value, page: 1, pageSize: 200 },
  });
  const baseItems = Array.isArray(data?.items) ? data.items : [];
  const full = await Promise.all(
    baseItems.map((q: any) =>
      api
        .get<any>(`/questions/${q.id}`)
        .then((res) => res.data)
        .catch(() => null)
    )
  );
  questions.value = full
    .filter((q: any) => q && Array.isArray(q.choices))
    .map(
      (q: any): QuestionView => ({
        questionId: q.id,
        questionText: q.text,
        choices: (q.choices || []).map((c: any) => ({
          id: c.id,
          content: c.content,
        })),
      })
    );
}

function startTimerFromAttempt(startedAt: string | null) {
  const duration = durationSec.value;
  if (!duration || !startedAt) return;
  warnedAt30s.value = false;
  showWarning30s.value = false;
  stopTimer();
  const startedMs = new Date(startedAt).getTime();
  const tick = () => {
    const elapsed = Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
    const left = Math.max(0, duration - elapsed);
    timeLeft.value = left;
    if (!warningDismissed.value) {
      if (left <= 30) {
        warnedAt30s.value = true;
        showWarning30s.value = true;
        warningSecondsLeft.value = Math.max(0, Math.floor(left));
      } else if (warnedAt30s.value) {
        warnedAt30s.value = false;
        showWarning30s.value = false;
      }
    } else {
      showWarning30s.value = false;
    }
    if (left <= 0) {
      stopTimer();
      autoSubmit(true);
    }
  };
  tick();
  timer = window.setInterval(tick, 1000) as unknown as number;
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer);
    timer = undefined;
  }
}
async function beginExam() {
  if (started.value || startingExam.value) return;
  startingExam.value = true;
  try {
    const attempt = await ensureAttemptCanBegin({ activate: true });
    if (!attempt) return;
    attemptMeta.value = attempt;
    if (questions.value.length === 0) {
      await loadQuestions();
    }
    started.value = true;
    warningDismissed.value = false;
    startTimerFromAttempt(attempt.startedAt ?? null);
  } finally {
    startingExam.value = false;
  }
}

function confirmSubmit() {
  if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) return;
  submitAttempt();
}

function autoSubmit(isAuto = false) {
  if (submitted.value || submitting.value || autoSubmitting.value) return;
  autoSubmitting.value = true;
  showTimeUpModal.value = true;
  submitAttempt(isAuto).finally(() => {
    autoSubmitting.value = false;
  });
}

async function submitAttempt(isAuto = false) {
  if (!examId.value) return;
  submitting.value = true;
  try {
    const entries = Object.entries(answers).filter(
      ([, choiceId]) => typeof choiceId === "number"
    );
    if (!entries.length) {
      if (!isAuto) {
        alert("Bạn chưa chọn câu trả lời nào.");
      }
      submitting.value = false;
      return;
    }
    const payload = {
      roomId,
      answers: entries.map(([qId, choiceId]) => ({
        questionId: Number(qId),
        selectedChoiceId: Number(choiceId),
      })),
    };
    const { data } = await api.post<any>("/attempts", payload);
    submitted.value = true;
    result.value = {
      score: data.score ?? null,
      passMarkPercent: data.passMarkPercent ?? null,
    };
    await loadReview(data.id);
  } catch (e: any) {
    const { message } = parseApiError(e);
    if (!isAuto) {
      alert(message || "Khong the nop bai thi");
    } else if (message) {
      console.warn("Auto submit failed:", message);
    }
  } finally {
    submitting.value = false;
  }
}

const showReview = computed(() => !!detail.value);

async function loadReview(attemptId: number) {
  try {
    const { data } = await api.get<any>(`/attempts/${attemptId}/detail`);
    detail.value = {
      answers: data.answers as AttemptAnswerView[],
      showExplanation: !!data.showExplanation,
    };
  } catch {
    // ignore
  }
}

onMounted(async () => {
  if (!roomId || Number.isNaN(roomId)) {
    router.replace({ name: "student-rooms" });
    return;
  }
  try {
    await loadRoom();
    let attempt = await fetchAttemptMeta();
    if (!attempt) {
      attempt = await ensureAttemptCanBegin();
    }
    attemptMeta.value = attempt;
    loaded.value = true;
    if (attempt) {
      const status = String(attempt.status || "").toUpperCase();
      if (status === "SUBMITTED" || status === "GRADED") {
        submitted.value = true;
        alert("Bạn đã làm bài thi này rồi.");
        router.replace({ name: "student-exams" });
        return;
      }
      if (status === "IN_PROGRESS" && attempt.timeTakenSec !== null) {
        started.value = true;
        if (questions.value.length === 0) {
          await loadQuestions();
        }
        startTimerFromAttempt(attempt.startedAt ?? null);
      }
    }
  } catch (e: any) {
    const { message } = parseApiError(e);
    alert(message || "Khong the tai du lieu phong thi");
    router.replace({ name: "student-rooms" });
  }
});

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});

function closeWarning() {
  showWarning30s.value = false;
  warningDismissed.value = true;
}

function startDragWarning(event: MouseEvent) {
  warningDragging.value = true;
  warningOffset.value = {
    x: event.clientX - warningPos.value.x,
    y: event.clientY - warningPos.value.y,
  };
  window.addEventListener("mousemove", onDragWarning);
  window.addEventListener("mouseup", endDragWarning);
}

function onDragWarning(event: MouseEvent) {
  if (!warningDragging.value) return;
  warningPos.value = {
    x: event.clientX - warningOffset.value.x,
    y: event.clientY - warningOffset.value.y,
  };
}

function endDragWarning() {
  warningDragging.value = false;
  window.removeEventListener("mousemove", onDragWarning);
  window.removeEventListener("mouseup", endDragWarning);
}
</script>

<style scoped>
.card {
  width: 100%;
}

.warning-toast {
  position: fixed;
  min-width: 320px;
  padding: 14px 16px;
  background: #fffaf5;
  border: 1px solid #ffd7a8;
  border-radius: 10px;
  z-index: 1060;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.warning-toast .display-6 {
  font-size: 2.4rem;
}

.warning-toast .display-5 {
  font-size: 2.6rem;
}

.timeup-modal .modal-content {
  border-radius: 12px;
}
</style>
