<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Ngân hàng câu hỏi</h5>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success" @click="openAdd()">
          <i class="bi bi-plus-circle me-1"></i> Thêm câu hỏi
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="selectedIds.size !== 1"
          @click="openEdit(selectedOneId)"
        >
          <i class="bi bi-pencil-square me-1"></i> Sửa
        </button>
        <button
          class="btn btn-outline-danger"
          :disabled="selectedIds.size === 0"
          @click="bulkDelete()"
        >
          <i class="bi bi-trash me-1"></i> Xóa
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
            <select class="form-select" v-model.number="subjectId" @change="onSubjectChange">
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
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
              <th style="width: 80px">ID</th>
              <th>Nội dung</th>
              <th style="width: 180px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in filteredItems" :key="q.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedIds.has(q.id)"
                  @change="onToggle(q.id, $event)"
                />
              </td>
              <td class="fw-semibold">#{{ q.id }}</td>
              <td>
                <div class="fw-semibold">{{ q.text }}</div>
                <div class="text-muted small" v-if="q.explanation">
                  {{ q.explanation }}
                </div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-primary"
                    @click="openEdit(q.id)"
                  >
                    <i class="bi bi-pencil-square me-1"></i> Sửa
                  </button>
                  <button class="btn btn-outline-danger" @click="delOne(q.id)">
                    <i class="bi bi-trash me-1"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between">
        <div class="text-muted small">Trang {{ page }} / {{ totalPages }}</div>
        <div class="d-flex align-items-center gap-2">
          <div class="input-group input-group-md">
            <span class="input-group-text">Số dòng/trang</span>
            <select
              class="form-select"
              v-model.number="pageSize"
              @change="onPageSizeChange"
            >
              <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </div>
          <nav aria-label="Pagination">
            <ul class="pagination mb-0">
              <li
                class="page-item"
                :class="{ disabled: page === 1 || loading }"
              >
                <button
                  class="page-link"
                  type="button"
                  @click="changePage(1)"
                  :disabled="page === 1 || loading"
                >
                  First
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: page === 1 || loading }"
              >
                <button
                  class="page-link"
                  type="button"
                  @click="changePage(page - 1)"
                  :disabled="page === 1 || loading"
                >
                  Prev
                </button>
              </li>
              <li
                v-for="n in pageNumbers"
                :key="n"
                class="page-item"
                :class="{ active: n === page }"
              >
                <button class="page-link" type="button" @click="changePage(n)">
                  {{ n }}
                </button>
              </li>
              <li
                class="page-item p-0 m-0"
                :class="{ disabled: page === totalPages || loading }"
              >
                <button
                  class="page-link"
                  type="button"
                  @click="changePage(page + 1)"
                  :disabled="page === totalPages || loading"
                >
                  Next
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: page === totalPages || loading }"
              >
                <button
                  class="page-link"
                  type="button"
                  @click="changePage(totalPages)"
                  :disabled="page === totalPages || loading"
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
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
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
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
              <div class="col-md-6">
                <label class="form-label">Gắn vào đề thi (tuỳ chọn)</label>
                <select v-model.number="addForm.examId" class="form-select">
                  <option :value="0">— Không gắn —</option>
                  <option v-for="ex in exams" :key="ex.id" :value="ex.id">
                    #{{ ex.id }} - {{ ex.title }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Môn học</label>
                <select v-model.number="addForm.subjectId" class="form-select">
                  <option :value="0" disabled>-- Chọn môn --</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Nội dung câu hỏi</label>
                <textarea
                  v-model.trim="addForm.text"
                  class="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Giải thích (tuỳ chọn)</label>
                <textarea
                  v-model.trim="addForm.explanation"
                  class="form-control"
                  rows="2"
                ></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label">Loại câu hỏi</label>
                <select v-model="addForm.type" class="form-select">
                  <option value="SC">1 đáp án đúng</option>
                  <option value="MC">Nhiều đáp án đúng</option>
                </select>
              </div>
              <div class="col-md-4">
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
                    <div class="col-md-8">
                      <input
                        v-model.trim="c.content"
                        type="text"
                        class="form-control"
                        :placeholder="`Đáp án #${idx + 1}`"
                      />
                    </div>
                    <div class="col-md-3">
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
                    <div class="col-md-1 text-end">
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

  <!-- Edit Modal: sửa nội dung + đáp án -->
  <div
    class="modal fade show"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    v-if="showEdit"
    style="display: block"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
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
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type QuestionListItem = {
  id: number;
  text: string;
  explanation: string | null;
};
type ExamSummary = { id: number; title: string };

// table state
const loading = ref(false);
const items = ref<QuestionListItem[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 40, 50];
const search = ref("");
const subjects = ref<Array<{ id: number; name: string }>>([]);
const subjectId = ref(0);
const selectedIds = reactive(new Set<number>());
const sort = ref<"asc" | "desc">("desc");

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);
const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (it) => it.text.toLowerCase().includes(q) || String(it.id).includes(q)
  );
});
const allPageSelected = computed(
  () =>
    filteredItems.value.length > 0 &&
    filteredItems.value.every((it) => selectedIds.has(it.id))
);
const selectedOneId = computed(() =>
  selectedIds.size === 1 ? Array.from(selectedIds)[0] : 0
);

async function load() {
  loading.value = true;
  try {
    const params: any = { page: page.value, pageSize: pageSize.value, sort: sort.value };
    if (subjectId.value > 0) params.subjectId = subjectId.value;
    const { data } = await api.get<Paginated<QuestionListItem>>("/questions", { params });
    items.value = data.items;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}
function changePage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value);
  load();
}
function onPageSizeChange() {
  page.value = 1;
  load();
}
function onSubjectChange() {
  page.value = 1;
  load();
}
function onSortChange() {
  page.value = 1;
  load();
}
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
    } catch (err) {
      // Ignore deletion errors in bulk delete
      console.warn("Failed to delete question:", id);
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
  // don't auto-select; keep 0 = not linked
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
    // reset and reload
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
    const { data } = await api.get('/subjects');
    subjects.value = Array.isArray(data?.items) ? data.items.map((s: any) => ({ id: s.id, name: s.name })) : [];
  } catch {}
  load();
});
</script>
