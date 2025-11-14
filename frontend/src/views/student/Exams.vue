<template>
  <div class="card rounded-0">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Bài thi đã làm</h5>
    </div>
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center w-100">
          <input
            v-model="search"
            type="search"
            class="form-control form-control-sm me-2 w-50"
            placeholder="Tìm theo mã đề hoặc tiêu đề..."
            @keydown.enter.prevent="reload"
          />
          <button
            class="btn btn-sm btn-outline-secondary w-150px"
            type="button"
            @click="reload"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            <i v-else class="bi bi-arrow-clockwise me-1"></i>
            Tải lại
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr class="text-muted small">
              <th>#</th>
              <th>Mã đề</th>
              <th>Tiêu đề</th>
              <th>Điểm</th>
              <th>Bắt đầu</th>
              <th>Nộp</th>
              <th>Thời gian làm</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in filteredItems" :key="a.id">
              <td>{{ a.id }}</td>
              <td>
                <code>{{ a.examCode ?? "-" }}</code>
              </td>
              <td>{{ a.examTitle ?? "-" }}</td>
              <td>{{ a.score ?? "-" }}</td>
              <td>{{ fmtDate(a.startedAt) }}</td>
              <td>{{ fmtDate(a.submittedAt) }}</td>
              <td>{{ fmtDuration(a.timeTakenSec) }}</td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-primary"
                  type="button"
                  @click="openDetail(a.id)"
                >
                  Xem
                </button>
              </td>
            </tr>
            <tr v-if="!loading && items.length === 0">
              <td colspan="8" class="text-center text-muted">
                Chưa có bài thi nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Detail modal -->
  <div
    class="modal fade show"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    v-if="showDetail"
    style="display: block"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Bài thi #{{ detail?.id }} - {{ detail?.examTitle ?? "-" }}
          </h5>
          <button type="button" class="btn-close" @click="closeDetail"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2 d-flex flex-wrap gap-3 align-items-center">
            <span><b>Bắt đầu:</b> {{ fmtDate(detail?.startedAt) }}</span>
            <span
              ><b>Thời gian:</b>
              {{ fmtDurationText(detail?.timeTakenSec) }}</span
            >
            <span v-if="canShowScore">
              <b>Điểm:</b>
              <strong>{{ detail?.score ?? "-" }}</strong>
            </span>
          </div>
          <div v-if="!canReviewNow" class="alert alert-warning">
            Đã hết thời gian xem lại bài thi này.
          </div>
          <div v-else-if="!canShowDetail" class="alert alert-info">
            Bài thi này không cho xem đáp án chi tiết.
          </div>
          <div v-else>
            <AttemptAnswersList
              :answers="detail?.answers || []"
              :show-explanation="!!examConfig?.showExplanation"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeDetail">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showDetail"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";
import AttemptAnswersList, {
  type AttemptAnswerView,
} from "../../components/attempts/AttemptAnswersList.vue";

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
};

type AttemptDetail = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  studentId: number;
  examId: number;
  examTitle?: string | null;
  passMarkPercent?: number | null;
  roomId: number;
  status: string;
  answers: AttemptAnswerView[];
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

const items = ref<AttemptRow[]>([]);
const loading = ref(false);
const search = ref("");

const showDetail = ref(false);
const detail = ref<AttemptDetail | null>(null);
const examConfig = ref<ExamConfig | null>(null);

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

function fmtDuration(sec: any) {
  const s = Number(sec || 0);
  if (!s || s <= 0) return "-";
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
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

const filteredItems = computed(() => {
  const q = (search.value || "").trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((a) => {
    const code = String(a.examCode || "").toLowerCase();
    const title = String(a.examTitle || "").toLowerCase();
    const idStr = `#${a.id}`.toLowerCase();
    return code.includes(q) || title.includes(q) || idStr.includes(q);
  });
});

const canReviewNow = computed(() => {
  if (!detail.value) return false;
  if (!examConfig.value) return true;
  const limitMin = examConfig.value.reviewWindowMin;
  if (!limitMin || !detail.value.submittedAt) return true;
  const submittedAt = new Date(detail.value.submittedAt).getTime();
  const until = submittedAt + limitMin * 60 * 1000;
  return Date.now() <= until;
});

const canShowScore = computed(() => {
  if (!detail.value) return false;
  if (!examConfig.value) return true;
  if (examConfig.value.feedbackMode === "NONE") return false;
  if (examConfig.value.showScoreImmediately === false) return false;
  return canReviewNow.value;
});

const canShowDetail = computed(() => {
  if (!detail.value) return false;
  if (!examConfig.value) return false;
  if (!canReviewNow.value) return false;
  if (examConfig.value.feedbackMode !== "DETAILED") return false;
  if (!examConfig.value.showCorrectAnswers) return false;
  return true;
});

async function reload() {
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params: { page: 1, pageSize: 100 },
    });
    items.value = data.items as any;
  } finally {
    loading.value = false;
  }
}

async function openDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    detail.value = data as any;
    const { data: exam } = await api.get<ExamConfig>(`/exams/${data.examId}`);
    examConfig.value = exam;
    showDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết bài thi");
  }
}

function closeDetail() {
  showDetail.value = false;
}

onMounted(() => {
  reload();
});
</script>
