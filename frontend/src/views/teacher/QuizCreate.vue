<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Đề thi</h5>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success" @click="openAdd()">
          <i class="bi bi-plus-circle me-1"></i>
          <span class="d-none d-sm-inline">Tạo đề thi</span>
        </button>
        <button class="btn btn-outline-primary" @click="openBank()">
          <i class="bi bi-journal-text me-1"></i>
          <span class="d-none d-sm-inline">Ngân hàng câu hỏi</span>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-4">
          <input
            v-model.trim="search"
            type="search"
            class="form-control"
            placeholder="Tìm đề thi..."
          />
        </div>
        <div class="col-6 col-md-3">
          <div class="input-group">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select"
              v-model.number="subjectId"
              @change="reload()"
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
              <th>ID</th>
              <th>Tiêu đề</th>
              <th class="d-none d-sm-table-cell">Mã đề</th>
              <th>Trạng thái</th>
              <th class="d-none d-lg-table-cell">Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in filteredItems" :key="e.id">
              <td class="fw-semibold">#{{ e.id }}</td>
              <td>
                <div class="fw-semibold">{{ e.title }}</div>
                <div class="text-muted small" v-if="e.description">
                  {{ e.description }}
                </div>
              </td>
              <td class="d-none d-sm-table-cell">
                <code>{{ e.code || "—" }}</code>
              </td>
              <td>
                <span class="badge bg-secondary">{{ e.status }}</span>
              </td>
              <td class="d-none d-lg-table-cell">
                {{ formatDate(e.createdAt) }}
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
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

      <div class="d-flex align-items-center justify-content-between">
        <div class="text-muted small">Trang {{ page }} / {{ totalPages }}</div>
        <div class="d-flex align-items-center gap-2 flex-wrap">
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
            <ul
              class="pagination mb-0 flex-wrap"
              :class="{ 'pagination-sm': isNarrow }"
            >
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
                  <i class="bi bi-chevron-double-left"></i
                  ><span class="d-none d-sm-inline ms-1">First</span>
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
                  <i class="bi bi-chevron-left"></i
                  ><span class="d-none d-sm-inline ms-1">Prev</span>
                </button>
              </li>
              <li
                v-for="(it, idx) in pageItems"
                :key="`p-${idx}-${it}`"
                class="page-item"
                :class="{
                  active: typeof it === 'number' && it === page,
                  disabled: typeof it === 'string',
                }"
              >
                <span v-if="typeof it === 'string'" class="page-link">…</span>
                <button
                  v-else
                  class="page-link"
                  type="button"
                  @click="changePage(it as number)"
                >
                  {{ it }}
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
                  <span class="d-none d-sm-inline me-1">Next</span
                  ><i class="bi bi-chevron-right"></i>
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
                  <span class="d-none d-sm-inline me-1">Last</span
                  ><i class="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div
    class="modal fade show"
    v-if="showModal"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? "Sửa đề thi" : "Tạo đề thi" }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Tiêu đề</label>
                <input
                  v-model.trim="form.title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Mã đề</label>
                <input
                  v-model.trim="form.code"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Môn học (tuỳ chọn)</label>
                <select v-model.number="form.subjectId" class="form-select">
                  <option :value="0">— Không chọn —</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model.trim="form.description"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeModal">Đóng</button>
          <button
            class="btn btn-primary"
            :disabled="saving || !form.title.trim()"
            @click="submitModal"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showModal"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
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

function range(from: number, to: number) {
  const r: number[] = [];
  for (let i = from; i <= to; i++) r.push(i);
  return r;
}
const isNarrow = ref(false);
function updateNarrow() {
  isNarrow.value = window.matchMedia("(max-width: 575.98px)").matches;
}
updateNarrow();
onMounted(() => window.addEventListener("resize", updateNarrow));
onUnmounted(() => window.removeEventListener("resize", updateNarrow));

const pageItems = computed<(number | string)[]>(() => {
  const tp = totalPages.value;
  const cur = page.value;
  if (tp <= 12) return range(1, tp);
  if (isNarrow.value) {
    const around = range(Math.max(1, cur - 1), Math.min(tp, cur + 1));
    const items: (number | string)[] = [1];
    if (around[0] > 2) items.push("...l");
    items.push(...around);
    if (around[around.length - 1] < tp - 1) items.push("...r");
    if (tp > 1) items.push(tp);
    return items;
  }
  const edge = 5;
  const startEdge = range(1, edge);
  const endEdge = range(tp - edge + 1, tp);
  if (tp <= edge * 2 + 5) return range(1, tp);
  const around = range(
    Math.max(edge + 1, cur - 2),
    Math.min(tp - edge, cur + 2)
  );
  const items: (number | string)[] = [...startEdge];
  if (around[0] > startEdge[startEdge.length - 1] + 1) items.push("...l");
  items.push(...around);
  if (around[around.length - 1] < endEdge[0] - 1) items.push("...r");
  items.push(...endEdge);
  return items;
});

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
function changePage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value);
  load();
}
function onPageSizeChange() {
  page.value = 1;
  load();
}
function reload() {
  page.value = 1;
  load();
}

// create/edit modal
const showModal = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const form = reactive<{
  id?: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subjectId: number;
}>({ title: "", description: null, code: null, status: "DRAFT", subjectId: 0 });
function openAdd() {
  isEdit.value = false;
  form.title = "";
  form.description = null;
  form.code = null;
  form.status = "DRAFT";
  form.subjectId = 0;
  showModal.value = true;
}
function openEdit(e: ExamRow) {
  isEdit.value = true;
  (form as any).id = e.id;
  form.title = e.title;
  form.description = e.description;
  form.code = e.code;
  form.status = e.status;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
async function submitModal() {
  saving.value = true;
  try {
    if (isEdit.value && form.id) {
      await api.put(`/exams/${form.id}`, {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
      });
    } else {
      await api.post("/exams", {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
      });
    }
    closeModal();
    load();
  } catch (e: any) {
    alert(e?.message || "Không thể lưu");
  } finally {
    saving.value = false;
  }
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

function openBank() {
  window.location.hash = "#/teacher/question-bank";
}

onMounted(async () => {
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch {}
  load();
});
</script>

<style scoped>
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
