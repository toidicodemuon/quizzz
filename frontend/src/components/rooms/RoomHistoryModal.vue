<template>
  <div
    class="modal fade show"
    v-if="show"
    style="display: block"
    aria-modal="true"
    role="dialog"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Danh sách phòng thi đã tạo</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3 mb-3 align-items-end">
            <div class="col-12 col-md-4">
              <label class="form-label">Đề thi</label>
              <select v-model.number="filters.examId" class="form-select">
                <option :value="0">Tất cả đề thi</option>
                <option v-for="e in exams" :key="e.id" :value="e.id">
                  #{{ e.id }} - {{ e.title }}
                  <span v-if="e.code">({{ e.code }})</span>
                </option>
              </select>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Tìm phòng (ID)</label>
              <input
                v-model.trim="filters.keyword"
                type="search"
                class="form-control"
                placeholder="Nhập ID phòng..."
              />
            </div>
            <div
              class="col-12 col-md-4 d-flex align-items-end justify-content-between flex-wrap gap-2"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="onlyActive"
                  v-model="filters.onlyActive"
                />
                <label class="form-check-label" for="onlyActive">
                  Chỉ hiển thị phòng đang mở
                </label>
              </div>
              <div class="d-flex align-items-center gap-2 ms-auto">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="deleteSelected"
                  :disabled="selectedCount === 0 || loading || deleting"
                >
                  <span
                    v-if="deleting"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  Xóa đã chọn ({{ selectedCount }})
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="reload"
                  :disabled="loading || deleting"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  Tải lại
                </button>
              </div>
            </div>
          </div>

          <DataTable
            :columns="columns"
            :items="pageItems"
            row-key="id"
            :loading="loading"
            :show-checkbox="true"
            :selected-ids="selectedIds"
          >
            <template #cell-examId="{ value }">
              <div class="small">
                <div>{{ examTitle(value) }}</div>
                <div class="text-muted">
                  #{{ value }}
                  <span v-if="examCode(value)">
                    · <code>{{ examCode(value) }}</code>
                  </span>
                </div>
              </div>
            </template>
            <template #cell-openAt="{ value }">
              {{ fmtDate(value) }}
            </template>
            <template #cell-closeAt="{ value }">
              <span>{{ fmtDate(value) }}</span>
            </template>
            <template #cell-status="{ row }">
              <span class="badge" :class="statusBadgeClass(row)">
                {{ getRoomStatus(row) }}
              </span>
            </template>
            <template #cell-durationSec="{ value }">
              {{ value ? Math.round(Number(value || 0) / 60) + " phút" : "-" }}
            </template>
            <template #cell-createdAt="{ value }">
              {{ fmtDate(value) }}
            </template>
            <template #cell-isProtected="{ value }">
              <span
                class="badge"
                :class="
                  value ? 'bg-warning text-dark' : 'bg-light text-muted border'
                "
              >
                <i class="bi" :class="value ? 'bi-lock-fill' : 'bi-unlock'"></i>
                {{ value ? "Có mật khẩu" : "Mở" }}
              </span>
            </template>
            <template #row-actions="{ row }">
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="openDetail(row)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-warning"
                  @click="openEdit(row)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="deleteRoom(row)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
            v-if="total >= 10"
            class="mt-2"
            :page="page"
            :page-size="pageSize"
            :total="total"
            :disabled="loading"
            @update:page="
              (p) => {
                page = p;
              }
            "
            @update:page-size="
              (s) => {
                pageSize = s;
                page = 1;
              }
            "
          />
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show" @click="close"></div>
  <RoomDetailModal
    :show="showDetail"
    :room="selectedRoom"
    @close="closeDetail"
  />
  <div
    class="modal fade show"
    v-if="showEdit"
    style="display: block"
    aria-modal="true"
    role="dialog"
    @click.self="showEdit = false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cập nhật bảo vệ phòng</h5>
          <button
            type="button"
            class="btn-close"
            @click="showEdit = false"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-check form-switch mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="editProtected"
              v-model="editProtected"
            />
            <label class="form-check-label" for="editProtected">
              Bảo vệ bằng mật khẩu
            </label>
          </div>
          <div class="form-check form-switch mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="editClose"
              v-model="editClose"
            />
            <label class="form-check-label" for="editClose">
              Đóng phòng ngay
            </label>
          </div>
          <div class="mb-2">
            <label class="form-label">Mật khẩu mới</label>
            <input
              type="text"
              class="form-control"
              v-model="editPassword"
              :disabled="!editProtected"
              placeholder="Nhập mật khẩu"
            />
            <div class="form-text" v-if="editProtected">
              Học viên sẽ cần mật khẩu này để vào phòng.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="showEdit = false">Hủy</button>
          <button
            class="btn btn-primary"
            @click="saveEdit"
            :disabled="deleting"
          >
            <span
              v-if="deleting"
              class="spinner-border spinner-border-sm me-1"
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
import { computed, reactive, ref, watch } from "vue";
import DataTable from "../common/DataTable.vue";
import Pagination from "../common/Pagination.vue";
import RoomDetailModal from "./RoomDetailModal.vue";
import api, { type Paginated } from "../../api";

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};

type RoomRow = {
  id: number;
  examId: number;
  code: string;
  isProtected?: boolean;
  openAt: string | null;
  closeAt: string | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: string;
};

const props = defineProps<{
  show: boolean;
  exams: ExamSummary[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const loading = ref(false);
const rooms = ref<RoomRow[]>([]);
const selectedRoom = ref<RoomRow | null>(null);
const showDetail = ref(false);
const deleting = ref(false);
const showEdit = ref(false);
const editingId = ref<number | null>(null);
const editProtected = ref(false);
const editPassword = ref("");
const editClose = ref(false);
const selectedIds = reactive(new Set<number>());

const filters = reactive({
  examId: 0,
  keyword: "",
  onlyActive: false,
});

const page = ref(1);
const pageSize = ref(10);

const examById = computed(() => {
  const map = new Map<number, ExamSummary>();
  (props.exams || []).forEach((e) => map.set(e.id, e));
  return map;
});

const columns = [
  { key: "id", title: "Số phòng" },
  { key: "examId", title: "ID đề thi" },
  { key: "openAt", title: "Mở lúc" },
  { key: "closeAt", title: "Đóng lúc" },
  { key: "status", title: "Trạng thái" },
  { key: "durationSec", title: "Thời lượng" },
  { key: "maxAttempts", title: "Lượt tối đa" },
  { key: "createdAt", title: "Tạo lúc" },
  {
    key: "isProtected",
    title: "Bảo vệ",
    thClass: "text-center",
    tdClass: "text-center",
  },
];

const filteredRooms = computed(() => {
  let list = rooms.value.slice();
  if (filters.examId) {
    list = list.filter((r) => r.examId === filters.examId);
  }
  const keyword = filters.keyword.trim().toLowerCase();
  if (keyword) {
    list = list.filter((r) => String(r.id).toLowerCase().includes(keyword));
  }
  if (filters.onlyActive) {
    list = list.filter((r) => isRoomLive(r));
  }
  return list;
});

const total = computed(() => filteredRooms.value.length);

const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRooms.value.slice(start, start + pageSize.value);
});

const selectedCount = computed(() => selectedIds.size);

function fmtDate(d: string | null): string {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function isRoomLive(r: RoomRow): boolean {
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const closeAt = r.closeAt ? new Date(r.closeAt) : null;
  const openOk = !openAt || openAt <= now;
  const closeOk = !closeAt || closeAt >= now;
  return openOk && closeOk;
}

function examTitle(id: number): string {
  const ex = examById.value.get(id);
  return ex?.title || `Đề #${id}`;
}

function examCode(id: number): string {
  const ex = examById.value.get(id);
  return ex?.code ? String(ex.code) : "";
}

function getRoomStatus(r: RoomRow): string {
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const closeAt = r.closeAt ? new Date(r.closeAt) : null;
  if (openAt && openAt > now) return "Chưa mở";
  if (closeAt && closeAt < now) return "Đã đóng";
  return "Đang mở";
}

function statusBadgeClass(r: RoomRow): string {
  if (isRoomLive(r)) return "bg-success";
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const now = new Date();
  if (openAt && openAt > now) return "bg-secondary";
  return "bg-dark";
}

async function reload() {
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<RoomRow>>("/rooms", {
      params: { page: 1, pageSize: 200 },
    });
    rooms.value = (data.items || []) as any;
    pruneSelection();
    page.value = 1;
  } finally {
    loading.value = false;
  }
}

function close() {
  emit("close");
}

function openDetail(room: RoomRow) {
  selectedRoom.value = room;
  showDetail.value = true;
}

function openEdit(room: RoomRow) {
  editingId.value = room.id;
  editProtected.value = !!room.isProtected;
  editPassword.value = "";
  editClose.value = !isRoomLive(room);
  showEdit.value = true;
}

function closeDetail() {
  showDetail.value = false;
}

async function deleteRoom(room: RoomRow) {
  if (!window.confirm(`Xóa phòng #${room.id}?`)) return;
  try {
    await api.delete(`/rooms/${room.id}`);
    await reload();
  } catch (e: any) {
    const msgCandidates = [
      e?.response?.data?.message,
      e?.response?.data?.error,
      e?.message,
    ].filter((x) => typeof x === "string" && x.trim()) as string[];
    alert(msgCandidates[0] || "Không thể xóa phòng thi");
  }
}

function pruneSelection() {
  const validIds = new Set(rooms.value.map((r) => r.id));
  Array.from(selectedIds).forEach((id) => {
    if (!validIds.has(id)) selectedIds.delete(id);
  });
}

async function deleteSelected() {
  if (!selectedCount.value) return;
  if (
    !window.confirm(
      `Xóa ${selectedCount.value} phòng thi đã chọn? Hành động này không thể hoàn tác.`
    )
  )
    return;
  deleting.value = true;
  try {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await api.delete(`/rooms/${id}`);
      selectedIds.delete(id);
    }
    await reload();
  } catch (e: any) {
    const msgCandidates = [
      e?.response?.data?.message,
      e?.response?.data?.error,
      e?.message,
    ].filter((x) => typeof x === "string" && x.trim()) as string[];
    alert(msgCandidates[0] || "Không thể xóa phòng thi");
  } finally {
    deleting.value = false;
  }
}

function clearSelection() {
  selectedIds.clear();
}

async function saveEdit() {
  if (!editingId.value) return;
  if (editProtected.value && !editPassword.value.trim()) {
    alert("Nhập mật khẩu khi bật bảo vệ.");
    return;
  }
  deleting.value = true;
  try {
    await api.post(`/rooms/${editingId.value}/protection`, {
      isProtected: editProtected.value,
      password: editProtected.value ? editPassword.value.trim() : undefined,
      close: editClose.value ? true : undefined,
    });
    await reload();
    showEdit.value = false;
  } catch (e: any) {
    alert(
      e?.response?.data?.message ||
        e?.message ||
        "Không thể cập nhật bảo vệ phòng."
    );
  } finally {
    deleting.value = false;
  }
}

watch(
  () => props.show,
  (v) => {
    if (v) {
      clearSelection();
      reload();
    } else {
      clearSelection();
    }
  }
);
</script>

<style scoped></style>
