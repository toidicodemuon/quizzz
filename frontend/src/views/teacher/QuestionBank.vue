<template>
  <div class="card rounded-0">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Ngân hàng câu hỏi</h5>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn btn-sm btn-success" @click="openAdd">
          <i class="bi bi-plus-circle me-1"></i>
          <span class="d-none d-lg-inline">Thêm câu hỏi</span>
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          :disabled="selectedIds.size !== 1"
          @click="openView(selectedOneId)"
        >
          <i class="bi bi-eye me-1"></i>
          <span class="d-none d-sm-inline">Xem</span>
        </button>
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="selectedIds.size !== 1"
          @click="openEdit(selectedOneId)"
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
        <div class="col-md-6 col-12">
          <input
            v-model.trim="search"
            type="search"
            class="form-control form-control-sm"
            placeholder="Tìm câu hỏi..."
          />
        </div>
        <div class="col-md-3 col-6">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select form-select-sm"
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
          <div class="input-group input-group-sm">
            <span class="input-group-text">Sắp xếp</span>
            <select
              class="form-select form-select-sm"
              v-model="sort"
              @change="onSortChange"
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
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
          <div class="fw-semibold">{{ plainText(row.text) }}</div>
          <div class="text-muted small" v-if="plainText(row.explanation)">
            {{ plainText(row.explanation) }}
          </div>
        </template>
        <template #row-actions="{ row }">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" @click="openView(row.id)">
              <i class="bi bi-eye me-1"></i>
              <span class="d-none d-sm-inline">Xem</span>
            </button>
            <button class="btn btn-outline-primary" @click="openEdit(row.id)">
              <i class="bi bi-pencil-square me-1"></i>
              <span class="d-none d-sm-inline">Sửa</span>
            </button>
            <button
              class="btn btn-outline-danger"
              :disabled="row.locked"
              :title="
                row.locked
                  ? 'Không thể xóa: Câu hỏi đang thuộc đề thi đã xuất bản và đã có lượt thi'
                  : ''
              "
              @click="delOne(row.id)"
            >
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

  <QuestionAddModal
    :show="showAdd"
    :subjects="subjects"
    @close="showAdd = false"
    @created="onQuestionCreated"
  />
  <QuestionEditModal
    :show="showEdit"
    :question-id="editingId"
    @close="closeEditModal"
    @updated="onQuestionUpdated"
  />
  <QuestionViewModal
    :show="showView"
    :question-id="viewingId"
    @close="closeViewModal"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import api from "../../api";
import Pagination from "../../components/common/Pagination.vue";
import DataTable from "../../components/common/DataTable.vue";
import QuestionAddModal from "../../components/questions/QuestionAddModal.vue";
import QuestionEditModal from "../../components/questions/QuestionEditModal.vue";
import QuestionViewModal from "../../components/questions/QuestionViewModal.vue";
import { useQuestionBankStore } from "../../stores/questionBank";
import { stripHtml } from "../../utils/richText";

const pageSizeOptions = [10, 15, 20, 25, 30, 40, 50];
const subjects = ref<Array<{ id: number; name: string }>>([]);
const selectedIds = reactive(new Set<number>());

const plainText = (value?: string | null) => stripHtml(value || "");

// Shared store for question bank
const qb = useQuestionBankStore();
const {
  loading,
  total,
  page,
  pageSize,
  subjectId,
  sort,
  search,
  filteredItems,
  items,
} = storeToRefs(qb);

const itemsToShow = computed(() =>
  search.value && search.value.trim() ? filteredItems.value : items.value
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);

const selectedOneId = computed(() =>
  selectedIds.size === 1 ? Array.from(selectedIds)[0] : 0
);

const columns = [
  {
    key: "id",
    title: "ID",
    thClass: "d-none d-sm-table-cell",
    tdClass: "d-none d-sm-table-cell",
  },
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

async function delOne(id: number) {
  const row = itemsToShow.value.find((r: any) => r.id === id);
  if (row?.locked) {
    alert("Không thể xóa: Câu hỏi thuộc đề thi đã xuất bản");
    return;
  }
  if (!confirm("Xóa câu hỏi #" + id + "?")) return;
  await api.delete(`/questions/${id}`);
  selectedIds.delete(id);
  load();
}

async function bulkDelete() {
  if (selectedIds.size === 0) return;
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

// Modals
const showAdd = ref(false);
const showEdit = ref(false);
const showView = ref(false);
const editingId = ref<number | null>(null);
const viewingId = ref<number | null>(null);

function openAdd() {
  showAdd.value = true;
}

function onQuestionCreated() {
  selectedIds.clear();
  load();
}

function openEdit(id: number | null) {
  if (!id) return;
  editingId.value = id;
  showEdit.value = true;
}

function closeEditModal() {
  showEdit.value = false;
}

function onQuestionUpdated() {
  load();
}

function openView(id: number | null) {
  if (!id) return;
  viewingId.value = id;
  showView.value = true;
}

function closeViewModal() {
  showView.value = false;
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
</style>
