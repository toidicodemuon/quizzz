<template>
  <div class="card">
    <div
      class="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap"
    >
      <h5 class="mb-0">Quản lý học viên</h5>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          @click="openCreate()"
        >
          <i class="bi bi-plus-lg me-1"></i> Thêm học viên
        </button>
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            type="button"
            :disabled="selectedIds.size !== 1"
            @click="openViewSelected()"
          >
            <i class="bi bi-eye"></i>
          </button>
          <button
            class="btn btn-outline-secondary"
            type="button"
            :disabled="selectedIds.size !== 1"
            @click="openEditSelected()"
          >
            <i class="bi bi-pencil-square"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            type="button"
            :disabled="selectedIds.size === 0"
            @click="deleteSelected()"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <!-- Filters -->
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-5 col-lg-4">
          <div class="input-group input-group-sm">
            <input
              type="search"
              class="form-control"
              v-model.trim="search"
              placeholder="Tìm theo mã số, email hoặc họ tên..."
              @keyup.enter="applyFilters()"
            />
            <button
              class="btn btn-primary"
              type="button"
              :disabled="loading"
              title="Tìm kiếm"
              @click="applyFilters()"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div class="col-12 col-md-4 col-lg-3">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select"
              v-model.number="subjectFilter"
              :disabled="loading || subjectsLoading"
              @change="applyFilters()"
            >
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12 col-md-3 text-md-end justify-content-start d-flex">
          <button
            class="btn btn-outline-secondary btn-sm"
            type="button"
            :disabled="loading"
            @click="fetchStudents()"
          >
            <i class="bi bi-arrow-repeat me-1" :class="{ spin: loading }"></i>
            Tải lại
          </button>
        </div>
      </div>

      <!-- Table -->
      <DataTable
        :columns="columns"
        :items="items"
        :loading="loading"
        row-key="id"
        :show-checkbox="true"
        :selected-ids="selectedIds"
        :empty-text="loading ? 'Đang tải...' : 'Không có dữ liệu'"
      >
        <template #cell-id="{ value }">
          <span class="fw-semibold">#{{ value }}</span>
        </template>
        <template #cell-userCode="{ value }">
          <code>{{ value }}</code>
        </template>
        <template #cell-email="{ value }">
          <code>{{ value }}</code>
        </template>
        <template #cell-subjectId="{ value }">
          <span v-if="value">
            <span class="badge bg-light text-dark" v-if="getSubjectName(value)">
              {{ getSubjectName(value) }}
            </span>
            <span v-else>#{{ value }}</span>
          </span>
          <span v-else class="text-muted">-</span>
        </template>
        <template #cell-createdAt="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #row-actions="{ row }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="openView(row)"
            >
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="openEdit(row)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              type="button"
              @click="confirmDelete(row)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </DataTable>

      <div class="mt-3">
        <Pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
          :disabled="loading"
          :page-size-options="[10, 20, 30, 40, 50]"
        />
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div v-if="showModal" class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title mb-0">
            {{
              viewing
                ? "Xem học viên"
                : editing
                ? "Cập nhật học viên"
                : "Thêm học viên"
            }}
          </h6>
          <button
            type="button"
            class="btn-close"
            @click="closeModal()"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Họ và tên</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="form.fullName"
                placeholder="Nguyễn Văn A"
                :disabled="viewing"
              />
            </div>
            <div class="col-12">
              <label class="form-label">Mã số học viên</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="form.userCode"
                placeholder="VD: SV20240001"
                :disabled="editing || viewing"
              />
            </div>
            <div class="col-12">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model.trim="form.email"
                placeholder="email@domain.com"
                :disabled="viewing"
              />
            </div>
            <div class="col-12">
              <label class="form-label">Môn học</label>
              <select
                class="form-select"
                v-model.number="form.subjectId"
                :disabled="viewing || subjectsLoading"
              >
                <option :value="0">Chưa chọn</option>
                <option v-for="s in subjects" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Mật khẩu</label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  v-model.trim="form.password"
                  :placeholder="
                    editing ? 'Để trống nếu không đổi' : 'Tối thiểu 6 ký tự'
                  "
                  :disabled="viewing"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="viewing"
                  @click="showPassword = !showPassword"
                >
                  <i
                    class="bi"
                    :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"
                  ></i>
                </button>
              </div>
              <div class="form-text" v-if="editing">
                Để trống nếu không đổi.
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" type="button" @click="closeModal()">
            Hủy
          </button>
          <template v-if="!viewing">
            <button
              class="btn btn-primary"
              type="button"
              :disabled="saving"
              @click="save()"
            >
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ editing ? "Lưu thay đổi" : "Tạo mới" }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "TeacherStudents",
});

import { computed, onMounted, reactive, ref, watch } from "vue";
import api, { type Paginated } from "../../api";
import DataTable from "../../components/common/DataTable.vue";
import Pagination from "../../components/common/Pagination.vue";

type Student = {
  id: number;
  email: string | null;
  fullName: string | null;
  userCode?: string | null;
  subjectId?: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type Subject = {
  id: number;
  name: string;
};

const loading = ref(false);
const subjectsLoading = ref(false);
const items = ref<Student[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const search = ref("");
const subjectFilter = ref(0);
const subjects = ref<Subject[]>([]);
const selectedIds = reactive(new Set<number>());

const columns = [
  { key: "id", title: "ID" },
  { key: "userCode", title: "Mã số" },
  { key: "email", title: "Email" },
  { key: "fullName", title: "Họ tên" },
  { key: "subjectId", title: "Môn" },
  { key: "createdAt", title: "Ngày tạo" },
];

const subjectMap = computed(() => {
  const m = new Map<number, string>();
  subjects.value.forEach((s) => m.set(s.id, s.name));
  return m;
});

function getSubjectName(id?: number | null) {
  if (!id) return "";
  return subjectMap.value.get(Number(id)) || "";
}

async function fetchSubjects() {
  subjectsLoading.value = true;
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch (error) {
    console.debug("Failed to load subjects", error);
  } finally {
    subjectsLoading.value = false;
  }
}

async function fetchStudents() {
  loading.value = true;
  try {
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (search.value) params.search = search.value;
    if (subjectFilter.value > 0) params.subjectId = subjectFilter.value;
    const res = await api.get<Paginated<Student>>("/teacher/students", {
      params,
    });
    items.value = (res.data?.items || []).map((it) => ({
      ...it,
      createdAt: it.createdAt,
      subjectId: (it as any).subjectId ?? null,
    }));
    total.value = res.data?.total || 0;
    const currentIds = new Set(items.value.map((it) => it.id));
    Array.from(selectedIds).forEach((id) => {
      if (!currentIds.has(id)) selectedIds.delete(id);
    });
  } catch (e) {
    console.error(e);
    alert("Không tải được danh sách học viên.");
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  fetchStudents();
}

function clearSearch() {
  search.value = "";
  applyFilters();
}

watch([page, pageSize], () => fetchStudents());
onMounted(() => {
  fetchSubjects();
  fetchStudents();
});

function formatDate(v: string | Date): string {
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

// Create/Edit/Delete
const showModal = ref(false);
const saving = ref(false);
const editing = ref(false);
const viewing = ref(false);
const currentId = ref<number | null>(null);
const showPassword = ref(false);
const form = reactive<{
  fullName: string;
  email: string;
  userCode: string;
  subjectId: number;
  password: string;
}>({
  fullName: "",
  email: "",
  userCode: "",
  subjectId: 0,
  password: "",
});

function openCreate() {
  editing.value = false;
  viewing.value = false;
  currentId.value = null;
  form.fullName = "";
  form.email = "";
  form.userCode = "";
  form.subjectId = 0;
  form.password = "";
  showModal.value = true;
}
function openEdit(row: Student) {
  editing.value = true;
  viewing.value = false;
  currentId.value = row.id;
  form.fullName = row.fullName || "";
  form.email = row.email || "";
  form.userCode = (row as any).userCode || "";
  form.subjectId = Number((row as any).subjectId) || 0;
  form.password = "";
  showModal.value = true;
}
function openView(row: Student) {
  viewing.value = true;
  editing.value = false;
  currentId.value = row.id;
  form.fullName = row.fullName || "";
  form.email = row.email || "";
  form.userCode = (row as any).userCode || "";
  form.subjectId = Number((row as any).subjectId) || 0;
  form.password = "";
  showPassword.value = false;
  showModal.value = true;
}
function openViewSelected() {
  const row = items.value.find((it) => selectedIds.has(it.id));
  if (row) openView(row);
}
function openEditSelected() {
  const row = items.value.find((it) => selectedIds.has(it.id));
  if (row) openEdit(row);
}
function closeModal() {
  if (saving.value) return;
  showModal.value = false;
  viewing.value = false;
}
async function save() {
  if (viewing.value) return;
  if (saving.value) return;
  if (!form.userCode || (!editing.value && !form.password)) {
    alert("Vui lòng nhập mã số và mật khẩu.");
    return;
  }
  saving.value = true;
  try {
    if (editing.value && currentId.value) {
      await api.put(`/teacher/students/${currentId.value}`, {
        fullName: form.fullName || null,
        email: form.email || null,
        userCode: form.userCode,
        subjectId: form.subjectId || null,
        password: form.password ? form.password : undefined,
      });
    } else {
      await api.post("/teacher/students", {
        fullName: form.fullName || null,
        email: form.email || null,
        userCode: form.userCode,
        subjectId: form.subjectId || null,
        password: form.password,
      });
    }
    showModal.value = false;
    viewing.value = false;
    fetchStudents();
  } catch (e) {
    console.error(e);
    alert("Không thể lưu. Vui lòng thử lại.");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(row: Student) {
  if (!confirm(`Xóa học viên: ${row.email || row.userCode}?`)) return;
  try {
    await api.delete(`/teacher/students/${row.id}`);
    fetchStudents();
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || "Không thể xóa học viên.";
    alert(msg);
  }
}

async function deleteSelected() {
  if (selectedIds.size === 0) return;
  if (
    !confirm(
      `Xóa ${selectedIds.size} học viên đã chọn? Hành động này không thể hoàn tác.`
    )
  )
    return;
  for (const id of Array.from(selectedIds)) {
    try {
      await api.delete(`/teacher/students/${id}`);
      selectedIds.delete(id);
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.message || "Không thể xóa học viên.";
      alert(msg);
      break;
    }
  }
  fetchStudents();
}
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-dialog {
  max-width: 520px;
  width: 100%;
}
.modal-content {
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 1rem;
}
.modal-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
}
</style>
