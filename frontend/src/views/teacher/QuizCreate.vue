<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Đề thi</h5>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn btn-sm btn-success" @click="openAdd">
          <i class="bi bi-plus-circle me-1"></i>
          <span class="d-none d-sm-inline">Tạo đề thi</span>
        </button>
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="selectedIds.size !== 1"
          @click="openEditBySelection"
        >
          <i class="bi bi-pencil-square me-1"></i>
          <span class="d-none d-sm-inline">Sửa</span>
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          :disabled="selectedIds.size === 0"
          @click="bulkDelete"
        >
          <i class="bi bi-trash me-1"></i>
          <span class="d-none d-sm-inline">Xóa</span>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-4">
          <input
            v-model.trim="search"
            type="search"
            class="form-control form-control-sm"
            placeholder="Tìm đề thi..."
          />
        </div>
        <div class="col-6 col-md-3">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select form-select-sm"
              v-model.number="subjectId"
              @change="reload"
            >
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-6 col-md-3 text-muted small">Tổng: {{ total }}</div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase text-muted small">
              <th style="width: 36px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="allPageSelected"
                  @change="toggleSelectAll($event)"
                />
              </th>
              <th class="d-none d-sm-table-cell">ID</th>
              <th>Tiêu đề</th>
              <th class="d-none d-sm-table-cell">Mã đề</th>
              <th>Trạng thái</th>
              <th class="d-none d-lg-table-cell">Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in filteredItems" :key="e.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedIds.has(e.id)"
                  @change="onToggle(e.id, $event)"
                />
              </td>
              <td class="fw-semibold d-none d-sm-table-cell">#{{ e.id }}</td>
              <td>
                <div class="fw-semibold">{{ e.title }}</div>
                <div class="text-muted small" v-if="e.description">
                  {{ e.description }}
                </div>
              </td>
              <td class="d-none d-sm-table-cell">
                <code>{{ e.code || "-" }}</code>
              </td>
              <td>
                <span
                  class="badge"
                  :class="
                    e.status === 'PUBLISHED'
                      ? 'bg-success'
                      : e.status === 'ARCHIVED'
                      ? 'bg-danger'
                      : 'bg-warning'
                  "
                >
                  {{ e.status }}
                </span>
              </td>
              <td class="d-none d-lg-table-cell">
                {{ formatDate(e.createdAt) }}
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-secondary"
                    @click="openView(e)"
                  >
                    <i class="bi bi-eye me-1"></i>
                    <span class="d-none d-sm-inline">Xem</span>
                  </button>
                  <button class="btn btn-outline-primary" @click="openEdit(e)">
                    <i class="bi bi-pencil-square me-1"></i>
                    <span class="d-none d-sm-inline">Sửa</span>
                  </button>
                  <button class="btn btn-outline-danger" @click="delOne(e)">
                    <i class="bi bi-trash me-1"></i>
                    <span class="d-none d-sm-inline">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-2">
        <Pagination
          :page="page"
          :page-size="pageSize"
          :total="total"
          :page-size-options="pageSizeOptions"
          :disabled="loading"
          @update:page="changePage"
          @update:page-size="onPageSizeChange"
        />
      </div>
    </div>
  </div>

  <!-- Question picker (reuse bank) for selected exam -->
  <div class="card mt-3" v-if="selectedIds.size === 1">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h6 class="mb-0">Câu hỏi cho đề thi #{{ selectedOneId }}</h6>
      <div class="text-muted small">Thêm/Gỡ câu hỏi từ ngân hàng</div>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="mb-2 d-flex justify-content-between align-items-center">
            <strong>Câu hỏi trong đề</strong>
            <button
              class="btn btn-sm btn-outline-danger"
              :disabled="selectedExamQuestionIds.size === 0 || loading"
              @click="removeSelectedFromExam"
            >
              <i class="bi bi-trash me-1"></i>
              Gỡ khỏi đề
            </button>
          </div>
          <div class="table-responsive border rounded">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-uppercase text-muted small">
                  <th style="width: 36px">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allExamQuestionsSelected"
                      @change="toggleSelectAllExamQuestions($event)"
                    />
                  </th>
                  <th class="d-none d-sm-table-cell">ID</th>
                  <th>Nội dung</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="q in examQuestions" :key="q.id">
                  <td>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedExamQuestionIds.has(q.id)"
                      @change="onToggleExamQuestion(q.id, $event)"
                    />
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold">
                    #{{ q.id }}
                  </td>
                  <td>
                    <div class="fw-semibold">{{ q.text }}</div>
                    <div class="text-muted small" v-if="q.explanation">
                      {{ q.explanation }}
                    </div>
                  </td>
                </tr>
                <tr v-if="examQuestions.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    Chưa có câu hỏi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row g-2 align-items-center mb-2">
            <div class="col-12 col-md-6">
              <strong>Ngân hàng câu hỏi</strong>
            </div>
            <div class="col-6 col-md-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Môn</span>
                <select
                  class="form-select"
                  v-model.number="qb.subjectId"
                  @change="
                    () => {
                      qb.setPage(1);
                      qb.reload();
                    }
                  "
                >
                  <option :value="0">Tất cả</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <input
                v-model.trim="qb.search"
                class="form-control form-control-sm"
                placeholder="Tìm câu hỏi..."
              />
            </div>
          </div>
          <div class="table-responsive border rounded">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-uppercase text-muted small">
                  <th style="width: 36px">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allBankSelected"
                      @change="toggleSelectAllBank($event)"
                    />
                  </th>
                  <th class="d-none d-sm-table-cell">ID</th>
                  <th>Nội dung</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="q in qb.filteredItems" :key="q.id">
                  <td>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedBankIds.has(q.id)"
                      @change="onToggleBank(q.id, $event)"
                    />
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold">
                    #{{ q.id }}
                  </td>
                  <td>
                    <div class="fw-semibold">{{ q.text }}</div>
                    <div class="text-muted small" v-if="q.explanation">
                      {{ q.explanation }}
                    </div>
                  </td>
                </tr>
                <tr v-if="qb.filteredItems.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    Không có câu hỏi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-2 d-flex align-items-center justify-content-between">
            <div
              class="input-group input-group-sm"
              style="max-width: 260px"
              v-if="false"
            >
              <span class="input-group-text">Điểm mặc định</span>
              <input
                type="number"
                min="0"
                step="0.5"
                class="form-control"
                v-model.number="defaultAddPoints"
              />
            </div>
            <button
              class="btn btn-sm btn-primary"
              :disabled="selectedBankIds.size === 0 || loading"
              @click="addSelectedToExam"
            >
              <i class="bi bi-plus-lg me-1"></i>
              Thêm vào đề
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <ExamFormModal
    :show="showFormModal"
    :exam-id="editingExamId"
    :subjects="subjects"
    @close="closeFormModal"
    @saved="handleExamSaved"
    @pick="handleExamPick"
  />

  <!-- View Exam Modal -->
  <ExamViewModal
    :show="showViewModal"
    :exam-id="viewExamId"
    @close="closeView"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import ExamFormModal from "../../components/exams/ExamFormModal.vue";
import ExamViewModal from "../../components/exams/ExamViewModal.vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";
import { useQuestionBankStore } from "../../stores/questionBank";

type Subject = { id: number; name: string };
type ExamRow = {
  id: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
};
type QuestionLite = { id: number; text: string; explanation: string | null };

const loading = ref(false);
const items = ref<ExamRow[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 40, 50];
const search = ref("");
const subjects = ref<Subject[]>([]);
const subjectId = ref(0);

// selection for bulk actions
const selectedIds = reactive(new Set<number>());
const allPageSelected = computed(
  () =>
    filteredItems.value.length > 0 &&
    filteredItems.value.every((it) => selectedIds.has(it.id))
);
function onToggle(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedIds.add(id);
  else selectedIds.delete(id);
}
function toggleSelectAll(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  filteredItems.value.forEach((it) =>
    c ? selectedIds.add(it.id) : selectedIds.delete(it.id)
  );
}
const selectedOneId = computed(() =>
  selectedIds.size === 1 ? Array.from(selectedIds)[0] : 0
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (it) =>
      it.title.toLowerCase().includes(q) ||
      String(it.id).includes(q) ||
      (it.code || "").toLowerCase().includes(q)
  );
});

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

async function load() {
  loading.value = true;
  try {
    const user = getUser();
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (user?.id) params.authorId = Number(user.id);
    if (subjectId.value > 0) params.subjectId = subjectId.value;
    const { data } = await api.get<Paginated<ExamRow>>("/exams", { params });
    items.value = data.items as any;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}
async function bulkDelete() {
  if (selectedIds.size === 0) return;
  if (!confirm(`Xóa ${selectedIds.size} đề thi đã chọn?`)) return;
  for (const id of Array.from(selectedIds)) {
    try {
      await api.delete(`/exams/${id}`);
    } catch {
      // ignore
    }
  }
  selectedIds.clear();
  load();
}
function changePage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value);
  load();
}
function onPageSizeChange(sz: number) {
  pageSize.value = sz;
  page.value = 1;
  load();
}
function reload() {
  page.value = 1;
  load();
}
function openEditBySelection() {
  const id = selectedOneId.value;
  const row = items.value.find((it) => it.id === id);
  if (row) openEdit(row);
}

// create/edit modal
const showFormModal = ref(false);
const editingExamId = ref<number | null>(null);

function openAdd() {
  editingExamId.value = null;
  showFormModal.value = true;
}
function openEdit(e: ExamRow) {
  editingExamId.value = e.id;
  showFormModal.value = true;
}
function closeFormModal() {
  showFormModal.value = false;
}
function handleExamSaved() {
  load();
}
function handleExamPick(examId: number) {
  selectedIds.clear();
  selectedIds.add(examId);
}

async function delOne(e: ExamRow) {
  if (!confirm(`Xóa đề thi "${e.title}"?`)) return;
  try {
    await api.delete(`/exams/${e.id}`);
    load();
  } catch (err: any) {
    alert(err?.message || "Không thể xóa");
  }
}

// === Question picker logic ===
const examQuestions = ref<QuestionLite[]>([]);
const selectedExamQuestionIds = reactive(new Set<number>());
const allExamQuestionsSelected = computed(
  () =>
    examQuestions.value.length > 0 &&
    examQuestions.value.every((q) => selectedExamQuestionIds.has(q.id))
);
function onToggleExamQuestion(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedExamQuestionIds.add(id);
  else selectedExamQuestionIds.delete(id);
}
function toggleSelectAllExamQuestions(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  examQuestions.value.forEach((q) =>
    c ? selectedExamQuestionIds.add(q.id) : selectedExamQuestionIds.delete(q.id)
  );
}
async function loadExamQuestions() {
  const id = selectedOneId.value;
  if (!id) {
    examQuestions.value = [];
    selectedExamQuestionIds.clear();
    return;
  }
  const { data } = await api.get<Paginated<QuestionLite>>("/questions", {
    params: { examId: id, pageSize: 100 },
  });
  examQuestions.value = data.items || [];
  selectedExamQuestionIds.clear();
}
async function removeSelectedFromExam() {
  const id = selectedOneId.value;
  if (!id || selectedExamQuestionIds.size === 0) return;
  if (!confirm(`Gỡ ${selectedExamQuestionIds.size} câu hỏi khỏi đề #${id}?`))
    return;
  for (const qid of Array.from(selectedExamQuestionIds)) {
    try {
      await api.delete(`/exams/${id}/questions/${qid}`);
    } catch (e) {
      console.error(e);
    }
  }
  await loadExamQuestions();
}

// bank list via shared store
const qb = useQuestionBankStore();
const selectedBankIds = reactive(new Set<number>());
const allBankSelected = computed(
  () =>
    qb.filteredItems.length > 0 &&
    qb.filteredItems.every((q) => selectedBankIds.has(q.id))
);
function onToggleBank(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedBankIds.add(id);
  else selectedBankIds.delete(id);
}
function toggleSelectAllBank(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  qb.filteredItems.forEach((q) =>
    c ? selectedBankIds.add(q.id) : selectedBankIds.delete(q.id)
  );
}
const defaultAddPoints = ref(1);
async function addSelectedToExam() {
  const id = selectedOneId.value;
  if (!id || selectedBankIds.size === 0) return;
  const questionIds = Array.from(selectedBankIds);
  await qb.addToExam(id, questionIds, defaultAddPoints.value);
  selectedBankIds.clear();
  await loadExamQuestions();
}

// === View modal ===
const showViewModal = ref(false);
const viewExamId = ref<number | null>(null);

function openView(e: ExamRow) {
  viewExamId.value = e.id;
  showViewModal.value = true;
}
function closeView() {
  showViewModal.value = false;
}

onMounted(async () => {
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch (e) {
    console.error(e);
  }
  await qb.reload();
  await load();

  watch(
    () => selectedOneId.value,
    async () => {
      await loadExamQuestions();
    }
  );
});
</script>

<style scoped>
.table-responsive.border.rounded {
  max-height: 360px;
  overflow-y: auto;
}
@media (max-width: 575.98px) {
  .table td,
  .table th {
    padding: 0.5rem;
  }
}
.pagination {
  gap: 0.25rem;
}
</style>
