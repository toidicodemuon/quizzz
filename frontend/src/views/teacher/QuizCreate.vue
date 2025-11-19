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
                  <button
                    class="btn btn-outline-secondary"
                    @click="openPickerModal(e)"
                  >
                    <i class="bi bi-list-check me-1"></i>
                    <span class="d-none d-sm-inline">Câu hỏi</span>
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

  <!-- Question picker (reuse bank) for selected exam - inline card -->
  <div class="card mt-3" v-if="selectedIds.size === 1">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h6 class="mb-0">Câu hỏi cho đề thi #{{ selectedOneId }}</h6>
      <div class="text-muted small">Thêm/Gỡ câu hỏi từ ngân hàng</div>
    </div>
    <div class="card-body">
      <ExamQuestionPicker
        :exam-id="selectedOneId || null"
        :subjects="subjects"
      />
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

  <!-- Question Picker Modal -->
  <div
    class="modal fade show"
    v-if="showPickerModal"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chọn câu hỏi cho đề #{{ pickerExamId }}</h5>
          <button type="button" class="btn-close" @click="closePickerModal" />
        </div>
        <div class="modal-body">
          <ExamQuestionPicker :exam-id="pickerExamId" :subjects="subjects" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closePickerModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showPickerModal"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import ExamFormModal from "../../components/exams/ExamFormModal.vue";
import ExamViewModal from "../../components/exams/ExamViewModal.vue";
import ExamQuestionPicker from "../../components/exams/ExamQuestionPicker.vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type Subject = { id: number; name: string };
type ExamRow = {
  id: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
};

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
  pickerExamId.value = examId;
  showPickerModal.value = true;
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

// View modal
const showViewModal = ref(false);
const viewExamId = ref<number | null>(null);

function openView(e: ExamRow) {
  viewExamId.value = e.id;
  showViewModal.value = true;
}
function closeView() {
  showViewModal.value = false;
}

// Picker modal
const showPickerModal = ref(false);
const pickerExamId = ref<number | null>(null);

function openPickerModal(e: ExamRow) {
  pickerExamId.value = e.id;
  showPickerModal.value = true;
}
function closePickerModal() {
  showPickerModal.value = false;
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
  await load();
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
