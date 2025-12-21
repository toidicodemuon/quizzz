<template>
  <!-- SubjectsList component -->
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Môn học</h5>
    </div>
    <div class="card-body position-relative">
      <LoadingOverlay :show="loading" />
      <form class="row g-2 align-items-end mb-3" @submit.prevent>
        <div class="col-12 col-md-5">
          <label class="form-label">Tên môn</label>
          <input
            v-model.trim="form.name"
            type="text"
            class="form-control form-control-sm"
            placeholder="Nhập tên môn"
          />
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label">Mã (tuỳ chọn)</label>
          <input
            v-model.trim="form.code"
            type="text"
            class="form-control form-control-sm"
            placeholder="VD: IT_BASIC"
          />
        </div>
        <div class="col-12 col-md-2 d-grid">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            :disabled="saving || !canAdd"
            @click="add"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Thêm
          </button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase text-muted small">
              <th>ID</th>
              <th>Tên môn</th>
              <th class="d-none d-sm-table-cell">Mã</th>
              <th class="text-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in items" :key="s.id">
              <td class="fw-semibold">#{{ s.id }}</td>
              <td>{{ s.name }}</td>
              <td class="d-none d-sm-table-cell">
                <code>{{ s.code || "—" }}</code>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" @click="openEdit(s)">
                    <i class="bi bi-pencil-square me-1"></i>
                    <span class="d-none d-sm-inline">Sửa</span>
                  </button>
                  <button class="btn btn-outline-danger" @click="delOne(s)">
                    <i class="bi bi-trash me-1"></i>
                    <span class="d-none d-sm-inline">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Edit modal -->
  <div
    class="modal fade show"
    v-if="showEdit"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sửa môn học #{{ edit.id }}</h5>
          <button type="button" class="btn-close" @click="closeEdit"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Tên môn</label>
            <input v-model.trim="edit.name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Mã</label>
            <input v-model.trim="edit.code" type="text" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeEdit">Đóng</button>
          <button
            class="btn btn-primary"
            :disabled="saving || !edit.name.trim()"
            @click="submitEdit"
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
  <div class="modal-backdrop fade show" v-if="showEdit"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import api, { type Paginated } from "../../api";
import LoadingOverlay from "../../components/common/LoadingOverlay.vue";

type Subject = { id: number; name: string; code: string | null };

const items = ref<Subject[]>([]);
const total = ref(0);
const loading = ref(false);
const saving = ref(false);

const form = reactive<{ name: string; code: string | null }>({
  name: "",
  code: "",
});
const canAdd = computed(() => form.name.trim().length > 0);

async function load() {
  items.value = [];
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<Subject>>("/subjects");
    items.value = data.items || [];
    total.value = data.total || items.value.length;
  } finally {
    loading.value = false;
  }
}

async function add() {
  if (!canAdd.value) return;
  saving.value = true;
  try {
    await api.post("/subjects", {
      name: form.name.trim(),
      code: (form.code || "").trim() || null,
    });
    form.name = "";
    form.code = "";
    await load();
  } catch (e: any) {
    alert(e?.message || "Không thể thêm môn học");
  } finally {
    saving.value = false;
  }
}

const showEdit = ref(false);
const edit = reactive<{ id: number; name: string; code: string | null }>({
  id: 0,
  name: "",
  code: "",
});
function openEdit(s: Subject) {
  edit.id = s.id;
  edit.name = s.name;
  edit.code = s.code;
  showEdit.value = true;
}
function closeEdit() {
  showEdit.value = false;
}

async function submitEdit() {
  if (!edit.name.trim()) return;
  saving.value = true;
  try {
    await api.put(`/subjects/${edit.id}`, {
      name: edit.name.trim(),
      code: (edit.code || "").trim() || null,
    });
    closeEdit();
    await load();
  } catch (e: any) {
    alert(e?.message || "Không thể cập nhật môn học");
  } finally {
    saving.value = false;
  }
}

async function delOne(s: Subject) {
  if (!confirm(`Xóa môn "${s.name}"?`)) return;
  try {
    await api.delete(`/subjects/${s.id}`);
    await load();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa môn (có thể còn câu hỏi liên kết)");
  }
}

onMounted(load);
</script>

<style scoped>
@media (max-width: 575.98px) {
  .table td,
  .table th {
    padding: 0.5rem;
  }
}
</style>
