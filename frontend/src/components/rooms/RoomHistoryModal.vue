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
          <div class="row g-3 mb-3">
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
              <label class="form-label">Tìm theo mã phòng</label>
              <input
                v-model.trim="filters.code"
                type="search"
                class="form-control"
                placeholder="Nhập một phần mã phòng..."
              />
            </div>
            <div class="col-12 col-md-4 d-flex align-items-end">
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
            </div>
          </div>

          <DataTable
            :columns="columns"
            :items="pageItems"
            row-key="id"
            :loading="loading"
          >
            <template #cell-code="{ value }">
              <code>{{ value }}</code>
            </template>
            <template #cell-openAt="{ value }">
              {{ fmtDate(value) }}
            </template>
            <template #cell-closeAt="{ value, row }">
              <span>{{ fmtDate(value) }}</span>
              <span v-if="isRoomLive(row)" class="badge bg-success ms-1"
                >Đang mở</span
              >
            </template>
            <template #cell-durationSec="{ value }">
              {{ value ? Math.round(Number(value || 0) / 60) + " phút" : "-" }}
            </template>
            <template #cell-createdAt="{ value }">
              {{ fmtDate(value) }}
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
                  class="btn btn-outline-danger"
                  @click="deleteRoom(row)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
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
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="reload"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            Tải lại dữ liệu
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show" @click="close"></div>
  <RoomDetailModal
    :show="showDetail"
    :room="selectedRoom"
    @close="closeDetail"
  />
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

const filters = reactive({
  examId: 0,
  code: "",
  onlyActive: false,
});

const page = ref(1);
const pageSize = ref(10);

const columns = [
  { key: "id", title: "#" },
  { key: "code", title: "Mã phòng" },
  { key: "examId", title: "ID đề thi" },
  { key: "openAt", title: "Mở lúc" },
  { key: "closeAt", title: "Đóng lúc" },
  { key: "durationSec", title: "Thời lượng" },
  { key: "maxAttempts", title: "Lượt tối đa" },
  { key: "createdAt", title: "Tạo lúc" },
];

const filteredRooms = computed(() => {
  let list = rooms.value.slice();
  if (filters.examId) {
    list = list.filter((r) => r.examId === filters.examId);
  }
  const codeValue = filters.code.trim().toLowerCase();
  if (codeValue) {
    list = list.filter((r) =>
      String(r.code || "")
        .toLowerCase()
        .includes(codeValue)
    );
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

async function reload() {
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<RoomRow>>("/rooms", {
      params: { page: 1, pageSize: 200 },
    });
    rooms.value = (data.items || []) as any;
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

function closeDetail() {
  showDetail.value = false;
}

async function deleteRoom(room: RoomRow) {
  if (!window.confirm(`Xóa phòng #${room.id}?`)) return;
  try {
    await api.delete(`/rooms/${room.id}`);
    await reload();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa phòng thi");
  }
}

watch(
  () => props.show,
  (v) => {
    if (v) {
      reload();
    }
  }
);
</script>

<style scoped></style>
