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
        <div>Thời gian còn lại:</div>
        <div class="fw-bold" :class="timeLeft <= 60 ? 'text-danger' : ''">
          {{ countdownText }}
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

async function ensureAttemptCanBegin(opts?: { activate?: boolean }): Promise<boolean> {
  try {
    await api.post("/attempts/begin", { roomId, activate: !!opts?.activate });
    return true;
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
    return false;
  }
}

async function loadRoom() {
  const { data: room } = await api.get<any>(`/rooms/${roomId}`);
  examId.value = room.examId;
  durationSec.value = room.durationSec ?? null;
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

function startTimer() {
  if (!durationSec.value) return;
  timeLeft.value = durationSec.value;
  timer = window.setInterval(() => {
    timeLeft.value -= 1;
    if (timeLeft.value <= 0) {
      window.clearInterval(timer);
      autoSubmit();
    }
  }, 1000) as unknown as number;
}

async function beginExam() {
  if (started.value || startingExam.value) return;
  startingExam.value = true;
  try {
    const ok = await ensureAttemptCanBegin({ activate: true });
    if (!ok) return;
    if (questions.value.length === 0) {
      await loadQuestions();
    }
    started.value = true;
    startTimer();
  } finally {
    startingExam.value = false;
  }
}

function confirmSubmit() {
  if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) return;
  submitAttempt();
}

function autoSubmit() {
  if (submitted.value || submitting.value) return;
  submitAttempt(true);
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
      alert(message || "Không thể nộp bài thi");
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
    const prefetched = String(route.query?.prefetched || "").toLowerCase() === "1";
    const ok = prefetched ? true : await ensureAttemptCanBegin();
    loaded.value = true;
    if (!ok) return;
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
</script>
