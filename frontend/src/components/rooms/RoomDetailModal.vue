<template>
  <div
    class="modal fade show"
    v-if="show && room"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    style="display: block"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Phòng #{{ room.id }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="small mb-3">
            <div class="mb-1">
              <span class="text-muted">Đề thi:</span>
              <span class="ms-1 fw-semibold">#{{ room.examId }}</span>
              <span v-if="room.examCode" class="ms-1 text-muted">
                (Mã đề: <code>{{ room.examCode }}</code
                >)
              </span>
              <div v-if="room.examTitle" class="text-muted">
                {{ room.examTitle }}
              </div>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-4">
                <span class="text-muted">Mở lúc:</span>
                <span class="ms-1">{{ fmtDate(room.openAt) }}</span>
              </div>
              <div class="col-12 col-md-4">
                <span class="text-muted">Đóng lúc:</span>
                <span class="ms-1">{{ fmtDate(room.closeAt) }}</span>
              </div>
              <div class="col-12 col-md-4">
                <span class="text-muted">Thời lượng:</span>
                <span class="ms-1">
                  {{
                    room.durationSec
                      ? Math.round(room.durationSec / 60) + " phút"
                      : "Không giới hạn"
                  }}
                </span>
              </div>
            </div>
          </div>

          <hr />

          <h6 class="mb-2">Danh sách học viên đã thi trong phòng này</h6>

          <AttemptList
            mode="teacher"
            :items="items"
            :loading="loading"
            class="mb-2"
            :show-exam-icon="false"
            :show-student-search="false"
            @view="openAttemptDetail"
            @print="printAttempt"
            @delete="deleteAttempt"
          />

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
                reload();
              }
            "
            @update:page-size="
              (s) => {
                pageSize = s;
                page = 1;
                reload();
              }
            "
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show && room"></div>
  <AttemptDetailModal
    :show="showAttemptDetail"
    mode="teacher"
    :detail="attemptDetail"
    @close="closeAttemptDetail"
  />
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import Pagination from "../common/Pagination.vue";
import AttemptList from "../attempts/AttemptList.vue";
import AttemptDetailModal from "../attempts/AttemptDetailModal.vue";
import type { AttemptAnswerView } from "../attempts/AttemptAnswersList.vue";
import api, { type Paginated } from "../../api";
import {
  openPrintWindow,
  renderAttemptPrint,
  renderPrintError,
  type PrintAttemptDetail,
} from "../../utils/printAttempt";

type RoomRow = {
  id: number;
  examId: number;
  examCode?: string | null;
  examTitle?: string | null;
  code: string;
  openAt: string | null;
  closeAt: string | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: string;
};

type AttemptRow = {
  id: number;
  examId: number;
  roomId: number;
  studentId: number;
  studentName?: string | null;
  studentEmail?: string | null;
  studentCode?: string | null;
  score: number | null;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examCode?: string | null;
  examTitle?: string | null;
  correctCount?: number;
  totalQuestions?: number;
  passMarkPercent?: number | null;
  pass?: boolean | null;
};

type AttemptDetail = {
  id: number;
  studentId: number;
  studentName?: string | null;
  studentEmail?: string | null;
  studentCode?: string | null;
  examId: number;
  examTitle?: string | null;
  examCode?: string | null;
  passMarkPercent?: number | null;
  roomId?: number | null;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  answers: AttemptAnswerView[];
  roomShuffleQuestions?: boolean;
  roomShuffleChoices?: boolean;
};

const props = defineProps<{
  show: boolean;
  room: RoomRow | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const items = ref<AttemptRow[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);

const showAttemptDetail = ref(false);
const attemptDetail = ref<AttemptDetail | null>(null);

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

async function reload() {
  if (!props.room) {
    items.value = [];
    total.value = 0;
    return;
  }
  loading.value = true;
  try {
    const params: any = {
      roomId: props.room.id,
      page: page.value,
      pageSize: pageSize.value,
    };
    const { data } = await api.get<Paginated<AttemptRow>>("/attempts", {
      params,
    });
    items.value = data.items as any;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

async function openAttemptDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    const meta = items.value.find((it) => it.id === id);
    attemptDetail.value = {
      ...data,
      examCode: data.examCode ?? meta?.examCode ?? null,
      examTitle: data.examTitle ?? meta?.examTitle ?? null,
      roomId: data.roomId ?? meta?.roomId ?? null,
      roomShuffleQuestions: props.room?.shuffleQuestions,
      roomShuffleChoices: props.room?.shuffleChoices,
    } as any;
    showAttemptDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết bài thi");
  }
}

async function printAttempt(id: number) {
  const win = openPrintWindow(`Attempt #${id}`);
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    const meta = items.value.find((it) => it.id === id);
    const detail: PrintAttemptDetail = {
      ...data,
      examCode: data.examCode ?? meta?.examCode ?? props.room?.examCode ?? null,
      examTitle:
        data.examTitle ?? meta?.examTitle ?? props.room?.examTitle ?? null,
      roomId: data.roomId ?? meta?.roomId ?? props.room?.id ?? null,
      roomShuffleQuestions: props.room?.shuffleQuestions,
      roomShuffleChoices: props.room?.shuffleChoices,
    };
    if (win) renderAttemptPrint(win, detail);
  } catch (e: any) {
    if (win) renderPrintError(win, "Unable to load attempt for printing.");
    alert(e?.message || "Khong the in bai thi");
  }
}

function closeAttemptDetail() {
  showAttemptDetail.value = false;
}

async function deleteAttempt(id: number) {
  if (!window.confirm(`Xóa bài thi #${id}?`)) return;
  try {
    await api.delete(`/attempts/${id}`);
    reload();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa bài thi");
  }
}

function close() {
  emit("close");
}

watch(
  () => props.show,
  (v) => {
    if (v) {
      page.value = 1;
      reload();
    }
  }
);

watch(
  () => props.room?.id,
  () => {
    if (props.show) {
      page.value = 1;
      reload();
    }
  }
);
</script>

<style scoped></style>
