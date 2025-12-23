<template>
  <div class="card exam-card">
    <div
      class="card-header exam-header d-flex justify-content-between align-items-center flex-wrap gap-3"
    >
      <div>
        <h5 class="mb-0">Làm bài thi</h5>
        <div v-if="examTitle" class="exam-title text-primary fw-semibold">
          {{ examTitle }}
        </div>
        <div class="small text-muted">
          Phòng #{{ roomId }} - Đề thi #{{ examId }}
        </div>
      </div>
      <div
        class="d-flex align-items-center gap-3 justify-content-end flex-wrap countdown-wrap"
      >
        <div class="countdown-pill" :class="countdownVariant">
          <div class="countdown-icon">
            <i class="bi bi-stopwatch-fill"></i>
          </div>
          <div class="countdown-body">
            <div class="countdown-screen" aria-label="Dong ho dem nguoc">
              <span class="countdown-text">{{ countdownText }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="started && !submitted"
          class="d-flex align-items-center gap-2"
        >
          <button
            class="btn btn-primary submit-btn"
            type="button"
            @click="() => confirmSubmit()"
            :disabled="submitting"
            title="Nộp bài"
          >
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            <i v-else class="bi bi-send-check me-1"></i>
            Nộp bài
          </button>
        </div>
      </div>
    </div>

    <div class="card-body exam-body" v-if="loaded && !submitting && !submitted">
      <template v-if="!started">
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
        <div
          v-for="(q, idx) in questions"
          :key="q.questionId"
          class="mb-3 question-block"
        >
          <div class="fw-semibold mb-1">
            Câu {{ idx + 1 }}: {{ q.questionText }}
          </div>
          <div class="ms-2 ms-sm-3 choices-wrap">
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
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button
            class="btn btn-outline-secondary submit-btn"
            @click="() => confirmSubmit()"
            :disabled="submitting"
          >
            <i class="bi bi-send-check me-1"></i>
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
          <span v-else-if="pass === false" class="badge bg-danger"> Rớt </span>
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
          @click="() => confirmSubmit()"
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
import { getUser } from "../../utils/auth";
import {
  getAttemptShuffleSeed,
  shuffleQuestionsAndChoices,
} from "../../utils/shuffle";
import {
  openPrintWindow,
  renderAttemptPrint,
  renderPrintError,
  type PrintAttemptDetail,
} from "../../utils/printAttempt";
import AttemptAnswersList, {
  type AttemptAnswerView,
} from "../../components/attempts/AttemptAnswersList.vue";

const route = useRoute();
const router = useRouter();

const roomId = Number(route.params.roomId);
const examId = ref<number | null>(null);
const examTitle = ref<string | null>(null);
const durationSec = ref<number | null>(null);

type QuestionView = {
  questionId: number;
  questionText: string;
  choices: { id: number; content: string }[];
};
type AnswerPayload = { questionId: number; selectedChoiceId: number };

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
type RoomMeta = {
  isProtected?: boolean;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
};
const roomMeta = ref<RoomMeta | null>(null);
const roomPassword = ref<string>("");

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
  const totalMinutes = Math.floor(s / 60);
  const showHours = totalMinutes >= 60;
  const hh = Math.floor(s / 3600)
    .toString()
    .padStart(2, "0");
  const mm = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return showHours
    ? `${hh}:${mm}:${ss}`
    : `${totalMinutes.toString().padStart(2, "0")}:${ss}`;
});

const countdownVariant = computed(() => {
  const s = timeLeft.value;
  if (s <= 60) return "danger";
  if (s <= 300) return "warning";
  return "normal";
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
  const shouldPromptPassword =
    !!opts?.activate && roomMeta.value?.isProtected && !roomPassword.value;
  if (shouldPromptPassword) {
    const pw = window.prompt(
      "Phòng này yêu cầu mật khẩu. Nhập mật khẩu để vào:"
    );
    if (!pw) return null;
    roomPassword.value = pw;
  }
  try {
    const { data } = await api.post<AttemptMeta>("/attempts/begin", {
      roomId,
      activate: !!opts?.activate,
      password: roomPassword.value || undefined,
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
    if (e?.response?.status === 403) {
      roomPassword.value = "";
    }
    if (alreadySubmitted) {
      router.replace({ name: "student-exams" });
    }
    return null;
  }
}

async function loadRoom() {
  const { data: room } = await api.get<any>(`/rooms/${roomId}`);
  roomMeta.value = {
    isProtected: !!room.isProtected,
    shuffleQuestions:
      typeof room.shuffleQuestions === "boolean" ? room.shuffleQuestions : true,
    shuffleChoices:
      typeof room.shuffleChoices === "boolean" ? room.shuffleChoices : true,
  };
  examId.value = room.examId;
  examTitle.value =
    room.examTitle ?? room.title ?? room?.exam?.title ?? examTitle.value;
  durationSec.value = room.durationSec ?? null;
  if (durationSec.value) {
    timeLeft.value = durationSec.value;
  }
  await ensureExamTitle();
}

async function ensureExamTitle() {
  if (examTitle.value || !examId.value) return;
  try {
    const { data } = await api.get<any>(`/exams/${examId.value}`);
    if (data?.title) {
      examTitle.value = data.title;
    }
  } catch {
    // ignore missing title; not critical for exam flow
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
    params: {
      examId: examId.value,
      page: 1,
      pageSize: 500,
      includeChoices: true,
      sort: "desc",
    },
  });
  const full = Array.isArray(data?.items) ? data.items : [];
  const base = full
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
  const user = getUser();
  const seed = getAttemptShuffleSeed({
    studentId: Number(user?.id),
    roomId,
    examId: examId.value,
    sessionKey: `room-shuffle-seed:${roomId}`,
  });
  questions.value = shuffleQuestionsAndChoices(base, {
    seed,
    shuffleQuestions: !!roomMeta.value?.shuffleQuestions,
    shuffleChoices: !!roomMeta.value?.shuffleChoices,
  });
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
  showWarning30s.value = false;
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

function collectAnsweredChoices(): AnswerPayload[] {
  if (questions.value.length > 0) {
    return questions.value
      .map((q): AnswerPayload | null => {
        const choiceId = answers[q.questionId];
        return typeof choiceId === "number"
          ? { questionId: q.questionId, selectedChoiceId: Number(choiceId) }
          : null;
      })
      .filter((a): a is AnswerPayload => !!a);
  }
  return Object.entries(answers)
    .filter(([, choiceId]) => typeof choiceId === "number")
    .map(([qId, choiceId]) => ({
      questionId: Number(qId),
      selectedChoiceId: Number(choiceId),
    }));
}

function confirmSubmit(opts?: { print?: boolean }) {
  if (submitting.value || autoSubmitting.value) return;
  const answered = collectAnsweredChoices();
  const hasTimeLeft = timeLeft.value > 0;
  const message =
    answered.length === 0 && hasTimeLeft
      ? "Bạn chưa chọn đáp án nào và vẫn còn thời gian. Bạn có chắc muốn nộp bài trắng?"
      : answered.length === 0
      ? "Bạn chưa chọn đáp án nào. Bạn có muốn nộp bài trắng?"
      : "Bạn chắc chắn muốn nộp bài?";
  if (!window.confirm(message)) return;
  const printWin = opts?.print ? openPrintWindow("Attempt") : null;
  submitAttempt({ printWin });
}

function autoSubmit(isAuto = false) {
  if (submitted.value || submitting.value || autoSubmitting.value) return;
  stopTimer();
  autoSubmitting.value = true;
  showTimeUpModal.value = true;
  submitAttempt({ isAuto }).finally(() => {
    autoSubmitting.value = false;
  });
}

async function submitAttempt(
  options: { isAuto?: boolean; printWin?: Window | null } = {}
) {
  if (!examId.value) return;
  const isAuto = !!options.isAuto;
  const printWin = options.printWin ?? null;
  stopTimer();
  submitting.value = true;
  try {
    const payloadAnswers = collectAnsweredChoices();
    const payload = {
      roomId,
      answers: payloadAnswers,
    };
    const { data } = await api.post<any>("/attempts", payload);
    submitted.value = true;
    result.value = {
      score: data.score ?? null,
      passMarkPercent: data.passMarkPercent ?? null,
    };
    const attemptId = Number(data?.id || 0);
    const printDetail = attemptId ? await loadReview(attemptId) : null;
    if (printWin) {
      if (printDetail) {
        renderAttemptPrint(printWin, printDetail);
      } else {
        renderPrintError(printWin, "Unable to load attempt for printing.");
      }
    }
  } catch (e: any) {
    const { message } = parseApiError(e);
    if (printWin) {
      renderPrintError(printWin, message || "Unable to submit attempt.");
    }
    if (!isAuto) {
      alert(message || "Không thể nộp bài thi");
    } else if (message) {
      console.warn("Auto submit failed:", message);
    }
  } finally {
    submitting.value = false;
  }
}

const showReview = computed(() => !!detail.value);

async function loadReview(
  attemptId: number
): Promise<PrintAttemptDetail | null> {
  try {
    const { data } = await api.get<any>(`/attempts/${attemptId}/detail`);
    const user = getUser();
    const studentIdValue = Number(data?.studentId ?? user?.id);
    const studentId = Number.isFinite(studentIdValue)
      ? studentIdValue
      : undefined;
    const resolvedExamId = data?.examId ?? examId.value ?? undefined;
    const seed = getAttemptShuffleSeed({
      studentId,
      roomId,
      examId: resolvedExamId,
      sessionKey: `room-shuffle-seed:${roomId}`,
    });
    const rawAnswers = Array.isArray(data?.answers) ? data.answers : [];
    const orderedAnswers = shuffleQuestionsAndChoices(rawAnswers, {
      seed,
      shuffleQuestions: !!roomMeta.value?.shuffleQuestions,
      shuffleChoices: !!roomMeta.value?.shuffleChoices,
    });
    detail.value = {
      answers: orderedAnswers as AttemptAnswerView[],
      showExplanation: !!data.showExplanation,
    };
    const printDetail: PrintAttemptDetail = {
      id: Number(data?.id ?? attemptId),
      examId: resolvedExamId,
      examTitle: data?.examTitle ?? examTitle.value ?? null,
      examCode: data?.examCode ?? null,
      roomId: data?.roomId ?? roomId,
      studentId,
      studentName: data?.studentName ?? null,
      studentCode: data?.studentCode ?? null,
      startedAt: data?.startedAt ?? attemptMeta.value?.startedAt ?? null,
      submittedAt: data?.submittedAt ?? null,
      timeTakenSec:
        data?.timeTakenSec ?? attemptMeta.value?.timeTakenSec ?? null,
      score: data?.score ?? result.value?.score ?? null,
      passMarkPercent:
        data?.passMarkPercent ?? result.value?.passMarkPercent ?? null,
      answers: rawAnswers as AttemptAnswerView[],
      roomShuffleQuestions: roomMeta.value?.shuffleQuestions,
      roomShuffleChoices: roomMeta.value?.shuffleChoices,
    };
    return printDetail;
  } catch {
    return null;
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
    // if (!attempt) {
    //   attempt = await ensureAttemptCanBegin();
    // }
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

.exam-card {
  border: none;
  box-shadow: none;
  margin: 0;
}

.exam-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffff;
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.exam-body {
  padding: 12px 16px 24px;
}

.question-block {
  padding: 12px 10px;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  background: #ffffff;
}

.choices-wrap .form-check {
  margin-bottom: 6px;
}

.countdown-wrap {
  align-items: stretch;
}

.exam-title {
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.countdown-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  background: #0f172a;
  color: #eaf9ff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 150px;
  overflow: hidden;
  min-height: 44px;
}

.countdown-pill > * {
  position: relative;
  z-index: 1;
}

.countdown-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: #d4f7ff;
}

.countdown-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
}

.countdown-label {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #cbe7ff;
  font-weight: 600;
}

.countdown-screen {
  position: relative;
  padding: 4px 8px;
  border-radius: 10px;
  background: linear-gradient(
    180deg,
    rgba(2, 10, 22, 0.86),
    rgba(7, 21, 35, 0.8)
  );
  border: 1px solid rgba(148, 233, 255, 0.35);
  box-shadow: none;
  min-width: 110px;
}

.countdown-text {
  display: block;
  font-size: 1.05rem;
  font-family: "Share Tech Mono", "Orbitron", "DS-Digital", "Digital-7",
    monospace;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #32ff85;
  text-shadow: none;
}

.countdown-pill.warning {
  background: #2a1600;
}

.countdown-pill.danger {
  background: #2a0b0b;
}

.countdown-pill.warning .countdown-screen {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: none;
}

.countdown-pill.danger .countdown-screen {
  border-color: rgba(248, 113, 113, 0.45);
  box-shadow: none;
}

.countdown-pill.warning .countdown-text {
  color: #ffbd45;
  text-shadow: none;
}

.countdown-pill.danger .countdown-text {
  color: #ff8080;
  text-shadow: none;
}

.submit-btn {
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 14px;
  font-weight: 600;
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
