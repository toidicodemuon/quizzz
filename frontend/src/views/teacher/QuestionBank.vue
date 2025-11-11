<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Ngân hàng câu hỏi</h5>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn btn-success" @click="openAdd()">
          <i class="bi bi-plus-circle me-1"></i>
          <span class="d-none d-lg-inline">Thêm câu hỏi</span>
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="selectedIds.size !== 1"
          @click="openEdit(selectedOneId)"
        >
          <i class="bi bi-pencil-square me-1"></i>
          <span class="d-none d-sm-inline">Sửa</span>
        </button>
        <button
          class="btn btn-outline-danger"
          :disabled="selectedIds.size === 0"
          @click="bulkDelete()"
        >
          <i class="bi bi-trash me-1"></i>
          <span class="d-none d-sm-inline">Xóa</span>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-center mb-3">
        <div class="col-md-6 col-12">
          <input
            v-model.trim="search"
            type="search"
            class="form-control"
            placeholder="Tìm câu hỏi..."
          />
        </div>
        <div class="col-md-3 col-6">
          <div class="input-group">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select"
              v-model.number="subjectId"
              @change="onSubjectChange"
            >
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="input-group">
            <span class="input-group-text">Sắp xếp</span>
            <select class="form-select" v-model="sort" @change="onSortChange">
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
        <div class="col-md-3 col-6 text-muted small">Tổng: {{ total }}</div>
      </div>

      <DataTable
        :columns="columns"
        :items="itemsToShow"
        row-key="id"
        :loading="loading"
        :show-checkbox="true"
        :selected-ids="selectedIds"
        empty-text="Không có câu hỏi"
      >
        <template #cell-id="{ value }">
          <span class="fw-semibold d-none d-sm-inline">#{{ value }}</span>
        </template>
        <template #cell-text="{ row }">
          <div class="fw-semibold">{{ row.text }}</div>
          <div class="text-muted small" v-if="row.explanation">
            {{ row.explanation }}
          </div>
        </template>
        <template #row-actions="{ row }">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" @click="openEdit(row.id)">
              <i class="bi bi-pencil-square me-1"></i>
              <span class="d-none d-sm-inline">Sửa</span>
            </button>
            <button class="btn btn-outline-danger" @click="delOne(row.id)">
              <i class="bi bi-trash me-1"></i>
              <span class="d-none d-sm-inline">Xóa</span>
            </button>
          </div>
        </template>
      </DataTable>

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

  <!-- Add Modal -->
  <div
    class="modal fade show"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    v-if="showAdd"
    style="display: block"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Thêm câu hỏi</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeAdd"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Gắn vào đề thi (tùy chọn)</label>
                <select v-model.number="addForm.examId" class="form-select">
                  <option :value="0">— Không gắn —</option>
                  <option v-for="e in exams" :key="e.id" :value="e.id">
                    #{{ e.id }} - {{ e.title }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Môn học</label>
                <select v-model.number="addForm.subjectId" class="form-select">
                  <option :value="0" disabled>-- Chọn môn --</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Nội dung câu hỏi</label>
                <textarea
                  v-model.trim="addForm.text"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Giải thích (tùy chọn)</label>
                <textarea
                  v-model.trim="addForm.explanation"
                  rows="2"
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <div class="row g-3 mt-1">
              <div class="col-12 col-md-6">
                <label class="form-label">Loại câu hỏi</label>
                <select class="form-select" v-model="addForm.type">
                  <option value="SC">1 đáp án đúng</option>
                  <option value="MC">Nhiều đáp án đúng</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Điểm</label>
                <input
                  v-model.number="addForm.points"
                  type="number"
                  step="0.5"
                  min="0"
                  class="form-control"
                />
              </div>
            </div>

            <div class="mt-4">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <strong>Đáp án</strong>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="addChoice()"
                >
                  <i class="bi bi-plus-lg"></i> Thêm đáp án
                </button>
              </div>
              <div class="list-group">
                <div
                  v-for="(c, idx) in addForm.choices"
                  :key="idx"
                  class="list-group-item"
                >
                  <div class="row g-2 align-items-center">
                    <div class="col-12 col-md-8">
                      <input
                        v-model.trim="c.content"
                        type="text"
                        class="form-control"
                        :placeholder="`Đáp án #${idx + 1}`"
                      />
                    </div>
                    <div class="col-8 col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :checked="c.isCorrect"
                          @change="onToggleCorrect(idx, $event)"
                          :id="`c-${idx}`"
                        />
                        <label class="form-check-label" :for="`c-${idx}`"
                          >Đúng</label
                        >
                      </div>
                    </div>
                    <div class="col-4 col-md-1 text-end">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="removeChoice(idx)"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-text">
                Với loại 1 đáp án đúng, chỉ chọn đúng duy nhất 1 đáp án.
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeAdd">
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="saving || !canSubmitAdd"
            @click="submitAdd"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu câu hỏi
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showAdd"></div>

  <!-- Edit Modal -->
  <div
    class="modal fade show"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    v-if="showEdit"
    style="display: block"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sửa câu hỏi #{{ editForm.id }}</h5>
          <button class="btn-close" @click="closeEdit"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nội dung</label>
            <textarea
              v-model.trim="editForm.text"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Giải thích</label>
            <textarea
              v-model.trim="editForm.explanation"
              class="form-control"
              rows="2"
            ></textarea>
          </div>
          <div class="mt-4">
            <div class="fw-semibold mb-2">Đáp án</div>
            <ul class="list-group">
              <li
                v-for="c in editChoices"
                :key="c.id"
                class="list-group-item d-flex align-items-center"
              >
                <i
                  v-if="c.isCorrect"
                  class="bi bi-check-circle-fill text-success me-2"
                ></i>
                <i v-else class="bi bi-circle me-2 text-muted"></i>
                <span>{{ c.content }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeEdit">Đóng</button>
          <button
            class="btn btn-primary"
            :disabled="saving"
            @click="submitEdit"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span
            >Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showEdit"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";
import Pagination from "../../components/common/Pagination.vue";
import DataTable from "../../components/common/DataTable.vue";
import { useQuestionBankStore } from "../../stores/questionBank";

type QuestionListItem = { id: number; text: string; explanation: string | null };
type ExamSummary = { id: number; title: string };

const pageSizeOptions = [10, 20, 30, 40, 50];
const subjects = ref<Array<{ id: number; name: string }>>([]);
const selectedIds = reactive(new Set<number>());

// Shared store for question bank
const qb = useQuestionBankStore();
const { loading, total, page, pageSize, subjectId, sort, search, filteredItems, items } = storeToRefs(qb);
const itemsToShow = computed(() => (search.value && search.value.trim() ? filteredItems.value : items.value));

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

const selectedOneId = computed(() =>
  selectedIds.size === 1 ? Array.from(selectedIds)[0] : 0
);

const columns = [
  { key: "id", title: "ID", thClass: "d-none d-sm-table-cell", tdClass: "d-none d-sm-table-cell" },
  { key: "text", title: "Nội dung" },
];

async function load() {
  await qb.reload();
}
function changePage(p: number) {
  qb.setPage(Math.min(Math.max(1, p), totalPages.value));
  qb.reload();
}
function onPageSizeChange(sz: number) {
  qb.setPageSize(sz);
  qb.reload();
}
function onSubjectChange() {
  qb.setPage(1);
  qb.reload();
}
function onSortChange() {
  qb.setPage(1);
  qb.reload();
}
// Selection handling is managed inside DataTable via selectedIds set.

async function delOne(id: number) {
  if (!confirm("Xóa câu hỏi #" + id + "?")) return;
  await api.delete(`/questions/${id}`);
  selectedIds.delete(id);
  load();
}
async function bulkDelete() {
  if (!confirm(`Xóa ${selectedIds.size} câu hỏi?`)) return;
  for (const id of Array.from(selectedIds)) {
    try {
      await api.delete(`/questions/${id}`);
    } catch {
      // ignore error
    }
  }
  selectedIds.clear();
  load();
}

// Add modal
const showAdd = ref(false);
const saving = ref(false);
const exams = ref<ExamSummary[]>([]);
const addForm = reactive<{
  examId: number;
  text: string;
  explanation: string | null;
  subjectId: number;
  type: "SC" | "MC";
  points: number;
  choices: Array<{ content: string; isCorrect: boolean }>;
}>({
  examId: 0,
  text: "",
  explanation: null,
  subjectId: 0,
  type: "SC",
  points: 1,
  choices: [
    { content: "", isCorrect: true },
    { content: "", isCorrect: false },
  ],
});

function openAdd() {
  showAdd.value = true;
  ensureExams();
}
function closeAdd() {
  showAdd.value = false;
}
function addChoice() {
  addForm.choices.push({ content: "", isCorrect: false });
}
function removeChoice(i: number) {
  addForm.choices.splice(i, 1);
}
function onToggleCorrect(idx: number, e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  if (addForm.type === "SC")
    addForm.choices.forEach(
      (c, i) => (c.isCorrect = i === idx ? checked : false)
    );
  else addForm.choices[idx].isCorrect = checked;
}
const canSubmitAdd = computed(
  () =>
    addForm.text.trim().length > 0 &&
    addForm.subjectId > 0 &&
    addForm.choices.length > 0 &&
    addForm.choices.some((c) => c.content.trim()) &&
    addForm.choices.some((c) => c.isCorrect)
);

async function ensureExams() {
  if (exams.value.length) return;
  const user = getUser();
  const authorId = Number(user?.id || 0);
  const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
    params: { authorId, pageSize: 100 },
  });
  exams.value = data.items;
}

async function submitAdd() {
  if (!canSubmitAdd.value) return;
  saving.value = true;
  try {
    const payload: any = {
      text: addForm.text,
      explanation: addForm.explanation,
      subjectId: addForm.subjectId,
      type: addForm.type,
      choices: addForm.choices
        .filter((c) => c.content.trim())
        .map((c, idx) => ({
          content: c.content.trim(),
          isCorrect: !!c.isCorrect,
          order: idx,
        })),
    };
    if (addForm.examId > 0) {
      payload.examId = addForm.examId;
      payload.points = addForm.points;
    }
    await api.post("/questions", payload);
    closeAdd();
    addForm.text = "";
    addForm.explanation = null;
    addForm.choices = [
      { content: "", isCorrect: true },
      { content: "", isCorrect: false },
    ];
    selectedIds.clear();
    load();
  } catch (e: any) {
    alert(e?.message || "Không thể thêm câu hỏi");
  } finally {
    saving.value = false;
  }
}

// Edit modal (chỉ sửa nội dung/giải thích)
const showEdit = ref(false);
const editForm = reactive<{
  id: number;
  text: string;
  explanation: string | null;
}>({ id: 0, text: "", explanation: null });
const editChoices = ref<
  Array<{ id: number; content: string; isCorrect: boolean; order: number }>
>([]);
async function openEdit(id: number) {
  try {
    const { data } = await api.get(`/questions/${id}`);
    editForm.id = data.id;
    editForm.text = data.text;
    editForm.explanation = data.explanation ?? null;
    editChoices.value = (data.choices || [])
      .slice()
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    showEdit.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể mở form sửa");
  }
}
function closeEdit() {
  showEdit.value = false;
}
async function submitEdit() {
  saving.value = true;
  try {
    await api.put(`/questions/${editForm.id}`, {
      text: editForm.text,
      explanation: editForm.explanation,
    });
    closeEdit();
    load();
  } catch (e: any) {
    alert(e?.message || "Không thể cập nhật");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch (error) {
    // Ignore error loading subjects
    console.debug("Failed to load subjects:", error);
  }
  load();
});
</script>

<style scoped>
@media (max-width: 575.98px) {
  .table td,
.table th {
    padding: 0.5rem 0.5rem;
  }
}
@media (max-width: 575.98px) {
  .modal-body .list-group-item {
    padding: 0.5rem;
  }
}
</style>
