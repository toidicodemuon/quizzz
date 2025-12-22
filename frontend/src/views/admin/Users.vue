<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="mb-0">Login Security</h5>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div class="fw-semibold">Enable captcha on login</div>
          <div class="text-muted small">
            Require captcha verification for all login attempts.
          </div>
        </div>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="captchaEnabled"
            :disabled="settingsLoading"
            @change="toggleCaptcha"
          />
        </div>
      </div>
      <div v-if="captchaEnabled && !recaptchaSiteKey" class="text-warning small mt-2">
        RECAPTCHA_SITE_KEY is missing on the API server.
      </div>
    </div>
  </div>

  <div class="card">
    <div
      class="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap"
    >
      <h5 class="mb-0">Quản lý người dùng</h5>
      <div class="d-flex gap-2">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          @click="openCreate()"
        >
          <i class="bi bi-plus-lg me-1"></i> Thêm người dùng
        </button>
      </div>
    </div>
    <div class="card-body">
      <!-- Filters -->
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-4">
          <label class="form-label small text-muted">Tìm kiếm</label>
          <input
            type="search"
            class="form-control form-control-sm"
            v-model.trim="filters.search"
            placeholder="Tìm theo email hoặc họ tên..."
            @keyup.enter="onApplyFilters()"
          />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small text-muted">Vai trò</label>
          <select
            class="form-select form-select-sm"
            v-model="filters.role"
            @change="onApplyFilters()"
          >
            <option :value="''">Tất cả</option>
            <option value="TEACHER">Giáo viên</option>
            <option value="ADMIN">Quản trị</option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label d-block small text-muted">&nbsp;</label>
          <!-- <button
            class="btn btn-sm btn-primary me-2"
            type="button"
            :disabled="loading"
            @click="onApplyFilters()"
          >
            <i class="bi bi-filter me-1"></i> Áp dụng
          </button> -->
          <button
            class="btn btn-sm btn-outline-secondary"
            type="button"
            :disabled="loading"
            @click="onResetFilters()"
          >
            <i class="bi bi-arrow-repeat"></i>
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
        :empty-text="loading ? 'Đang tải...' : 'Không có dữ liệu'"
      >
        <template #cell-userCode="{ value }">
          <code>{{ value }}</code>
        </template>
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
              :disabled="isSelf(row)"
              :title="isSelf(row) ? 'Kh\u00f4ng th\u1ec3 x\u00f3a t\u00e0i kho\u1ea3n c\u1ee7a ch\u00ednh b\u1ea1n.' : ''"
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
            {{ editing ? "Cập nhật người dùng" : "Thêm người dùng" }}
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
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model.trim="form.email"
                placeholder="email@domain.com"
                :disabled="editing"
              />
            </div>
            <div class="col-12">
              <label class="form-label">Vai trò</label>
              <select
                class="form-select"
                v-model="form.role"
                :disabled="editing"
              >
                <option value="TEACHER">Giáo viên</option>
                <option value="ADMIN">Quản trị</option>
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
import { onMounted, reactive, ref, watch } from "vue";
import api, { type Paginated } from "../../api";
import DataTable from "../../components/common/DataTable.vue";
import Pagination from "../../components/common/Pagination.vue";
import { getUser } from "../../utils/auth";

defineOptions({
  name: "UsersList",
});

type Role = "ADMIN" | "TEACHER" | "STUDENT";
type User = {
  id: number;
  email: string | null;
  fullName: string | null;
  userCode?: string | null;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const loading = ref(false);
const items = ref<User[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const settingsLoading = ref(false);
const captchaEnabled = ref(false);
const recaptchaSiteKey = ref<string | null>(null);

const filters = reactive<{ search: string; role: "" | Role }>({
  search: "",
  role: "",
});

const currentUser = getUser();
const currentUserId = currentUser?.id ?? null;
const currentEmail = currentUser?.email?.toLowerCase() ?? null;
const currentUserCode =
  (currentUser as any)?.userCode ?? (currentUser as any)?.username ?? null;

const columns = [
  { key: "userCode", title: "Tên đăng nhập" },
  { key: "email", title: "Email" },
  { key: "fullName", title: "Họ tên" },
  {
    key: "role",
    title: "Vai trò",
    thClass: "text-center",
    tdClass: "text-center",
  },
  { key: "createdAt", title: "Ngày tạo" },
];

async function fetchSettings() {
  settingsLoading.value = true;
  try {
    const res = await api.get("/settings");
    captchaEnabled.value = Boolean(res.data?.captchaEnabled);
    recaptchaSiteKey.value = res.data?.recaptchaSiteKey || null;
  } catch (e: any) {
    console.error(e);
    alert("Failed to load captcha settings.");
  } finally {
    settingsLoading.value = false;
  }
}

async function toggleCaptcha() {
  if (settingsLoading.value) return;
  settingsLoading.value = true;
  try {
    const res = await api.put("/settings", {
      captchaEnabled: !captchaEnabled.value,
    });
    captchaEnabled.value = Boolean(res.data?.captchaEnabled);
    recaptchaSiteKey.value = res.data?.recaptchaSiteKey || null;
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || "Failed to update settings.";
    alert(msg);
  } finally {
    settingsLoading.value = false;
  }
}

async function fetchUsers() {
  loading.value = true;
  try {
    const params: any = {
      page: page.value,
      pageSize: pageSize.value,
    };
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    // Never list students in Admin Users view
    params.excludeStudent = true;

    const res = await api.get<Paginated<User>>("/users", { params });
    items.value = (res.data?.items || []).map((it) => ({
      ...it,
      createdAt: it.createdAt,
    }));
    total.value = res.data?.total || 0;
  } catch (e: any) {
    console.error(e);
    alert("Không tải được danh sách người dùng.");
  } finally {
    loading.value = false;
  }
}

function onApplyFilters() {
  page.value = 1;
  fetchUsers();
}
function onResetFilters() {
  filters.search = "";
  filters.role = "";
  onApplyFilters();
}

watch([page, pageSize], () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
  fetchSettings();
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
const currentId = ref<number | null>(null);
const showPassword = ref(false);
const form = reactive<{
  fullName: string;
  email: string;
  password: string;
  role: Role;
}>({
  fullName: "",
  email: "",
  password: "",
  role: "TEACHER",
});

function openCreate() {
  editing.value = false;
  currentId.value = null;
  form.fullName = "";
  form.email = "";
  form.password = "";
  form.role = "TEACHER";
  showModal.value = true;
}
function openEdit(row: User) {
  editing.value = true;
  currentId.value = row.id;
  form.fullName = row.fullName || "";
  form.email = row.email || "";
  form.password = "";
  showModal.value = true;
}
function closeModal() {
  if (saving.value) return;
  showModal.value = false;
}
async function save() {
  if (saving.value) return;
  if (!form.email || (!editing.value && !form.password)) {
    alert("Vui lòng nhập email và mật khẩu.");
    return;
  }
  saving.value = true;
  try {
    if (editing.value && currentId.value) {
      await api.put(`/users/${currentId.value}`, {
        fullName: form.fullName || null,
        // email can be updated server-side, but keep disabled in UI to avoid confusion
        password: form.password ? form.password : undefined,
        // role unchanged
      });
    } else {
      await api.post("/users", {
        fullName: form.fullName || null,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    }
    showModal.value = false;
    fetchUsers();
  } catch (e: any) {
    console.error(e);
    alert("Không thể lưu. Vui lòng thử lại.");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(row: User) {
  if (isSelf(row)) {
    alert("Không thể xóa tài khoản của chính bạn.");
    return;
  }
  if (!confirm(`Xóa tài khoản: ${row.email || row.userCode}?`)) return;
  try {
    await api.delete(`/users/${row.id}`);
    fetchUsers();
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || "Không thể xóa người dùng.";
    alert(msg);
  }
}

function isSelf(row: User) {
  if (currentUserId !== null && row.id === currentUserId) return true;
  if (currentEmail && row.email?.toLowerCase() === currentEmail) return true;
  if (currentUserCode && row.userCode === currentUserCode) return true;
  return false;
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

/* Lightweight modal */
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



