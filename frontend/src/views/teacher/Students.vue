<template>
  <div class="card">
    <div
      class="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap"
    >
      <h5 class="mb-0">Quản lý học viên</h5>
      <div class="d-flex gap-2">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          @click="openCreate()"
        >
          <i class="bi bi-plus-lg me-1"></i> Thêm học viên
        </button>
        <button
          class="btn btn-outline-secondary btn-sm"
          type="button"
          :disabled="loading"
          @click="fetchStudents()"
        >
          <i class="bi bi-arrow-repeat me-1" :class="{ spin: loading }"></i> Tải
          lại
        </button>
      </div>
    </div>
    <div class="card-body">
      <!-- Filters -->
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-6 col-lg-5">
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model.trim="search"
              placeholder="Tìm theo mã số, email hoặc họ tên..."
              @keyup.enter="applyFilters()"
            />
            <button
              v-if="search"
              class="btn btn-outline-secondary"
              type="button"
              :disabled="loading"
              title="Xóa bộ lọc"
              @click="clearSearch()"
            >
              <i class="bi bi-x-lg"></i>
            </button>
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
      </div>

      <!-- Table -->
      <DataTable
        :columns="columns"
        :items="items"
        :loading="loading"
        row-key="id"
        :empty-text="loading ? 'Đang tải...' : 'Không có dữ liệu'"
      >
        <template #cell-email="{ value }">
          <code>{{ value }}</code>
        </template>
        <template #cell-createdAt="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #row-actions="{ row }">
          <div class="btn-group btn-group-sm">
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
            {{ editing ? "Cập nhật học viên" : "Thêm học viên" }}
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
              />
            </div>
            <div class="col-12">
              <label class="form-label">Mã số học viên</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="form.userCode"
                placeholder="VD: SV20240001"
                :disabled="editing"
              />
            </div>
            <div class="col-12">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model.trim="form.email"
                placeholder="email@domain.com"
              />
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
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                >
                  <i
                    class="bi"
                    :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "TeacherStudents",
});

import { onMounted, reactive, ref, watch } from "vue";
import api, { type Paginated } from "../../api";
import DataTable from "../../components/common/DataTable.vue";
import Pagination from "../../components/common/Pagination.vue";

type Student = {
  id: number;
  email: string | null;
  fullName: string | null;
  userCode?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const loading = ref(false);
const items = ref<Student[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const search = ref("");

const columns = [
  { key: "userCode", title: "Mã số" },
  { key: "email", title: "Email" },
  { key: "fullName", title: "Họ tên" },
  { key: "createdAt", title: "Ngày tạo" },
];

async function fetchStudents() {
  loading.value = true;
  try {
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (search.value) params.search = search.value;
    const res = await api.get<Paginated<Student>>("/teacher/students", {
      params,
    });
    items.value = (res.data?.items || []).map((it) => ({
      ...it,
      createdAt: it.createdAt,
    }));
    total.value = res.data?.total || 0;
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
onMounted(() => fetchStudents());

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
const currentId = ref<number | null>(null);
const showPassword = ref(false);
const form = reactive<{
  fullName: string;
  email: string;
  userCode: string;
  password: string;
}>({
  fullName: "",
  email: "",
  userCode: "",
  password: "",
});

function openCreate() {
  editing.value = false;
  currentId.value = null;
  form.fullName = "";
  form.email = "";
  form.userCode = "";
  form.password = "";
  showModal.value = true;
}
function openEdit(row: Student) {
  editing.value = true;
  currentId.value = row.id;
  form.fullName = row.fullName || "";
  form.email = row.email || "";
  form.userCode = (row as any).userCode || "";
  form.password = "";
  showModal.value = true;
}
function closeModal() {
  if (saving.value) return;
  showModal.value = false;
}
async function save() {
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
        password: form.password ? form.password : undefined,
      });
    } else {
      await api.post("/teacher/students", {
        fullName: form.fullName || null,
        email: form.email || null,
        userCode: form.userCode,
        password: form.password,
      });
    }
    showModal.value = false;
    fetchStudents();
  } catch (e) {
    console.error(e);
    alert("Không thể lưu. Vui lòng thử lại.");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(row: Student) {
  if (!confirm(`Xóa học viên: ${row.email}?`)) return;
  try {
    await api.delete(`/teacher/students/${row.id}`);
    fetchStudents();
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || "Không thể xóa học viên.";
    alert(msg);
  }
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
