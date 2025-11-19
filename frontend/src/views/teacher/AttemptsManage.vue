<template>
  <div class="card rounded-0">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Quản lý bài thi sinh viên</h5>
    </div>
    <div class="card-body">
      <div class="position-relative" style="max-width: 400px">
        <input
          class="form-control form-control-sm"
          v-model="examInput"
          placeholder="Tìm theo mã đề hoặc tiêu đề..."
          type="search"
          @focus="showExamDropdown = true"
          @input="showExamDropdown = true"
          @keydown.enter.prevent="onExamInputChange"
          @blur="onExamInputBlur"
        />
        <div
          v-if="showExamDropdown && filteredExams.length > 0"
          class="dropdown-menu show w-100"
          style="max-height: 100vh; overflow-y: auto"
        >
          <button
            v-for="e in filteredExams"
            :key="e.id"
            type="button"
            class="dropdown-item small"
            @mousedown.prevent="onExamPick(e)"
          >
            <span class="fw-semibold">
              {{ e.code || "-" }}
            </span>
            -
            <span>{{ e.title }}</span>
            <span class="text-muted">(#{{ e.id }})</span>
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
              <th>Mã SV</th>
              <th>Tên học viên</th>
              <th>Đúng/Tổng</th>
              <th>Kết quả</th>
              <th>Bắt đầu</th>
              <th>Nộp</th>
              <th>Thời gian làm</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in items" :key="a.id">
              <td>{{ a.id }}</td>
              <td>
                <code>{{ a.examCode ?? "-" }}</code>
              </td>
              <td>{{ a.examTitle ?? "-" }}</td>
              <td class="small">
                <code>{{ (a as any).studentCode ?? "-" }}</code>
              </td>
              <td>{{ a.studentName ?? "#" + a.studentId }}</td>
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
                    class="btn btn-outline-primary"
                    @click="openDetail(a.id)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-outline-danger"
                    @click="delAttempt(a.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && items.length === 0">
              <td colspan="10" class="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        class="mt-2"
        :page="page"
        :page-size="pageSize"
        :total="total"
        :disabled="loading"
        @update:page="
          (p) => {
            page = p;
            reload();
          }
        "
        @update:page-size="
          (s) => {
            pageSize = s;
            page = 1;
            reload();
          }
        "
      />
    </div>
  </div>

  <!-- Detail Modal (reused) -->
  <AttemptDetailModal
    :show="showDetail"
    mode="teacher"
    :detail="detail"
    @close="closeDetail"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import AttemptDetailModal from "../../components/attempts/AttemptDetailModal.vue";
import type { AttemptAnswerView } from "../../components/attempts/AttemptAnswersList.vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};
type AttemptRow = {
  id: number;
  examId: number;
  roomId: number;
  studentId: number;
  studentName?: string | null;
  studentEmail?: string | null;
  studentCode?: string | null;
  score: number | null;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examCode?: string | null;
  examTitle?: string | null;
  correctCount?: number;
  totalQuestions?: number;
  passMarkPercent?: number | null;
  pass?: boolean | null;
};
type AttemptDetail = {
  id: number;
  studentId: number;
  studentName?: string | null;
  studentEmail?: string | null;
  studentCode?: string | null;
  examId: number;
  examTitle?: string | null;
  passMarkPercent?: number | null;
  roomId: number;
  score: number | null;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  answers: AttemptAnswerView[];
};

const exams = ref<ExamSummary[]>([]);
const publishedExams = computed(() =>
  exams.value.filter((e) => String(e.status).toUpperCase() === "PUBLISHED")
);
const examInput = ref("");
const showExamDropdown = ref(false);
const filteredExams = computed(() => {
  const v = (examInput.value || "").trim().toLowerCase();
  if (!v) return publishedExams.value;
  return publishedExams.value.filter((e) => {
    const code = (e.code || "").toLowerCase();
    const title = e.title.toLowerCase();
    const idStr = `#${e.id}`;
    return (
      code.includes(v) || title.includes(v) || idStr.toLowerCase().includes(v)
    );
  });
});

const examId = ref<number>(0);
const items = ref<AttemptRow[]>([]);
let page = ref(1);
let pageSize = ref(10);
const total = ref(0);
const loading = ref(false);

const showDetail = ref(false);
const detail = ref<AttemptDetail | null>(null);

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

async function ensureExams() {
  const user = getUser();
  const authorId = Number(user?.id || 0);
  const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
    params: { authorId, pageSize: 200 },
  });
  exams.value = data.items as any;
}

function onExamInputChange() {
  const v = (examInput.value || "").trim().toLowerCase();
  let found = publishedExams.value.find(
    (e) => (e.code || "").toLowerCase() === v
  );
  if (!found) {
    const idMatch = v.match(/#?(\d+)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      found = publishedExams.value.find((e) => e.id === id) || found;
    }
  }
  if (!found) {
    found = publishedExams.value.find((e) =>
      e.title.toLowerCase().includes(v)
    );
  }
  examId.value = found ? found.id : 0;
  if (found) {
    examInput.value = `${found.code ? found.code + " - " : ""}${
      found.title
    } (#${found.id})`;
  }
  showExamDropdown.value = false;
  page.value = 1;
  reload();
}

function onExamPick(e: ExamSummary) {
  examId.value = e.id;
  examInput.value = `${e.code ? e.code + " - " : ""}${e.title} (#${e.id})`;
  showExamDropdown.value = false;
  page.value = 1;
  reload();
}

function onExamInputBlur() {
  setTimeout(() => {
    showExamDropdown.value = false;
  }, 150);
}

async function reload() {
  loading.value = true;
  try {
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (examId.value) params.examId = examId.value;
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params,
    });
    items.value = data.items as any;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

async function openDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    detail.value = data as any;
    showDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết");
  }
}
function closeDetail() {
  showDetail.value = false;
}

async function delAttempt(id: number) {
  if (!confirm(`Xóa bài thi #${id}?`)) return;
  try {
    await api.delete(`/attempts/${id}`);
    reload();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa bài thi");
  }
}

onMounted(async () => {
  await ensureExams();
  reload();
});
</script>

<style scoped></style>

