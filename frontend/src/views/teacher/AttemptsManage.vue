<template>
  <div class="card rounded-0">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Quản lý bài thi học viên</h5>
      <div class="d-flex align-items-center gap-2">
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="deleteSelected"
          :disabled="selectedCount === 0 || loading || deleting"
        >
          <span
            v-if="deleting"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          Xóa đã chọn ({{ selectedCount }})
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="reload"
          :disabled="loading || deleting"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          Tải lại
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-md-6 col-lg-5">
          <div class="position-relative">
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
        </div>
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Mã SV</span>
            <input
              type="search"
              class="form-control"
              placeholder="Nhập mã số học viên"
              v-model="studentCode"
              @keydown.enter.prevent="onStudentCodeSearch"
            />
            <button
              class="btn btn-primary"
              type="button"
              @click="onStudentCodeSearch"
              :disabled="loading"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <AttemptList
        class="mt-3"
        mode="teacher"
        :items="items"
        :loading="loading"
        :show-checkbox="true"
        :selected-ids="selectedIds"
        @view="openDetail"
        @print="printAttempt"
        @delete="delAttempt"
        @search-student-code="onSelectStudentCode"
        @view-exam="openExam"
      />

      <Pagination
        v-if="total >= 10"
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
    :show-close="true"
    @close="closeDetail"
  />
  <ExamViewModal
    :show="showExamModal"
    :exam-id="viewExamId"
    @close="closeExam"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import AttemptList from "../../components/attempts/AttemptList.vue";
import AttemptDetailModal from "../../components/attempts/AttemptDetailModal.vue";
import ExamViewModal from "../../components/exams/ExamViewModal.vue";
import type { AttemptAnswerView } from "../../components/attempts/AttemptAnswersList.vue";
import { openAttemptPrintTab } from "../../utils/printAttempt";
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
  examCode?: string | null;
  passMarkPercent?: number | null;
  roomId?: number | null;
  score: number | null;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  answers: AttemptAnswerView[];
  roomShuffleQuestions?: boolean;
  roomShuffleChoices?: boolean;
};

const exams = ref<ExamSummary[]>([]);
const publishedExams = computed(() =>
  exams.value.filter((e) => String(e.status).toUpperCase() === "PUBLISHED")
);
const examInput = ref("");
const studentCode = ref("");
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
const deleting = ref(false);
const selectedIds = reactive(new Set<number>());
const selectedCount = computed(() => selectedIds.size);

const showDetail = ref(false);
const detail = ref<AttemptDetail | null>(null);
const showExamModal = ref(false);
const viewExamId = ref<number | null>(null);
const roomShuffleCache = new Map<
  number,
  { shuffleQuestions: boolean; shuffleChoices: boolean }
>();

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
    found = publishedExams.value.find((e) => e.title.toLowerCase().includes(v));
  }
  examId.value = found ? found.id : 0;
  if (found) {
    examInput.value = `${found.code ? found.code + " - " : ""}${
      found.title
    } (#${found.id})`;
  }
  showExamDropdown.value = false;
  page.value = 1;
  clearSelection();
  reload();
}

function onExamPick(e: ExamSummary) {
  examId.value = e.id;
  examInput.value = `${e.code ? e.code + " - " : ""}${e.title} (#${e.id})`;
  showExamDropdown.value = false;
  page.value = 1;
  clearSelection();
  reload();
}

function onStudentCodeSearch() {
  page.value = 1;
  clearSelection();
  reload();
}

function clearStudentCode() {
  if (!studentCode.value) return;
  studentCode.value = "";
  page.value = 1;
  clearSelection();
  reload();
}

function onSelectStudentCode(code: string) {
  studentCode.value = code || "";
  page.value = 1;
  clearSelection();
  onStudentCodeSearch();
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
    const examSearch = (examInput.value || "").trim();
    if (examSearch) params.search = examSearch;
    const studentCodeFilter = (studentCode.value || "").trim();
    if (studentCodeFilter) params.studentCode = studentCodeFilter;
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params,
    });
    items.value = data.items as any;
    total.value = data.total;
    pruneSelection();
  } finally {
    loading.value = false;
  }
}

async function getRoomShuffle(roomId?: number | null) {
  if (!roomId) return null;
  const cached = roomShuffleCache.get(roomId);
  if (cached) return cached;
  try {
    const { data } = await api.get<any>(`/rooms/${roomId}`);
    const info = {
      shuffleQuestions: !!data?.shuffleQuestions,
      shuffleChoices: !!data?.shuffleChoices,
    };
    roomShuffleCache.set(roomId, info);
    return info;
  } catch {
    return null;
  }
}

async function openDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    const meta = items.value.find((it) => it.id === id);
    const shuffle = await getRoomShuffle(data.roomId ?? meta?.roomId ?? null);
    detail.value = {
      ...data,
      examCode: data.examCode ?? meta?.examCode ?? null,
      examTitle: data.examTitle ?? meta?.examTitle ?? null,
      roomId: data.roomId ?? meta?.roomId ?? null,
      roomShuffleQuestions: shuffle?.shuffleQuestions,
      roomShuffleChoices: shuffle?.shuffleChoices,
    } as any;
    showDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết");
  }
}

function printAttempt(id: number) {
  const win = openAttemptPrintTab({ attemptId: id, mode: "teacher" });
  if (!win) {
    alert("Khong the mo cua so in bai thi");
  }
}

function closeDetail() {
  showDetail.value = false;
}

function openExam(id: number) {
  viewExamId.value = id;
  showExamModal.value = true;
}
function closeExam() {
  showExamModal.value = false;
}

async function delAttempt(id: number) {
  if (!confirm(`Xóa bài thi #${id}?`)) return;
  try {
    await api.delete(`/attempts/${id}`);
    selectedIds.delete(id);
    reload();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa bài thi");
  }
}

function pruneSelection() {
  const valid = new Set(items.value.map((i) => i.id));
  Array.from(selectedIds).forEach((id) => {
    if (!valid.has(id)) selectedIds.delete(id);
  });
}

function clearSelection() {
  selectedIds.clear();
}

async function deleteSelected() {
  if (!selectedCount.value) return;
  if (
    !window.confirm(
      `Xóa ${selectedCount.value} bài thi đã chọn? Hành động này không thể hoàn tác.`
    )
  )
    return;
  deleting.value = true;
  try {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await api.delete(`/attempts/${id}`);
      selectedIds.delete(id);
    }
    await reload();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa bài thi");
  } finally {
    deleting.value = false;
  }
}

onMounted(async () => {
  await ensureExams();
  reload();
});
</script>

<style scoped></style>
