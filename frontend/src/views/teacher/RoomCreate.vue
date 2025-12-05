<template>
  <div class="room-create-page">
    <div class="card rounded-0 mb-3">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <div>
          <h5 class="mb-0">Mở phòng thi cho sinh viên</h5>
          <div class="small text-muted">
            Bước 1: chọn đề thi đã publish. Bước 2: tạo phòng. Bước 3: theo dõi
            trạng thái làm bài.
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="showHistory = true"
          >
            <i class="bi bi-clock-history me-1"></i>
            Lịch sử phòng thi
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="toggleConfig"
            :aria-expanded="showConfig ? 'true' : 'false'"
          >
            <i
              class="bi"
              :class="showConfig ? 'bi-chevron-up' : 'bi-chevron-down'"
            ></i>
          </button>
        </div>
      </div>

      <div class="card-body" v-show="showConfig">
        <div class="row g-3">
          <div class="col-12 col-lg-6">
            <div class="border rounded h-100 p-3 bg-light">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <div>
                  <div class="fw-semibold">Tạo phòng thi</div>
                  <div class="text-muted small" v-if="false">
                    Có 2 switch xáo trộn câu hỏi và đáp án bên dưới.
                  </div>
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label"
                  >Đề thi (chỉ hiển thị đã publish)</label
                >
                <select
                  class="form-select form-select-sm"
                  v-model.number="selectedExamId"
                  @change="onExamChange"
                >
                  <option :value="0" disabled>-- Chọn đề thi --</option>
                  <option v-for="e in publishedExams" :key="e.id" :value="e.id">
                    #{{ e.id }} - {{ e.title }}
                    <span v-if="e.code">({{ e.code }})</span>
                  </option>
                </select>
                <div
                  class="form-text text-muted"
                  v-if="!loadingExams && publishedExams.length === 0"
                >
                  Bạn chưa có đề thi nào đang trạng thái PUBLISHED.
                </div>
                <div class="small text-muted mt-1" v-if="selectedExam">
                  Đề đã chọn:
                  <strong>{{ selectedExam.title }}</strong>
                  <span v-if="selectedExam.code" class="ms-1">
                    (Mã đề: <code>{{ selectedExam.code }}</code
                    >)
                  </span>
                </div>
                <div class="small text-muted mt-1" v-else>
                  Hãy chọn đề thi đã publish để tạo phòng cho sinh viên.
                </div>
              </div>

              <div v-if="!selectedExam" class="alert alert-info mb-0">
                Vui lòng chọn một đề thi đã publish trước khi tạo phòng.
              </div>
              <div v-else>
                <RoomCreateForm
                  :creating="creating"
                  @submit="handleCreateRoom"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="border rounded h-100 p-3">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <div>
                  <div class="fw-semibold">Danh sách phòng thi</div>
                  <div class="text-muted small">
                    {{ rooms.length }} phòng | đang chọn:
                    <strong>{{ selectedRoomLabel }}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="loadRooms()"
                  :disabled="loadingRooms || !selectedExamId"
                >
                  <span
                    v-if="loadingRooms"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  Làm mới
                </button>
              </div>
              <div v-if="!selectedExam" class="alert alert-warning mb-0">
                Chọn đề thi để xem danh sách phòng.
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead>
                    <tr class="text-muted small">
                      <th>Phòng</th>
                      <th>Thời gian</th>
                      <th>Bảo vệ</th>
                      <!-- <th>Thiết lập</th> -->
                      <th class="text-end">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingRooms">
                      <td colspan="5" class="text-center text-muted py-3">
                        <span
                          class="spinner-border spinner-border-sm me-2"
                        ></span>
                        Đang tải danh sách phòng...
                      </td>
                    </tr>
                    <tr v-else-if="rooms.length === 0">
                      <td colspan="5" class="text-center text-muted py-3">
                        Chưa có phòng nào cho đề thi này.
                      </td>
                    </tr>
                    <tr
                      v-else
                      v-for="r in rooms"
                      :key="r.id"
                      :class="r.id === selectedRoomId ? 'table-active' : ''"
                    >
                      <td>
                        <div class="fw-semibold">#{{ r.id }}</div>
                        <div class="text-muted small">
                          {{ durationText(r) }}

                          <!--| tối đa
                          {{ r.maxAttempts }} lượt-->
                        </div>
                      </td>
                      <td class="small">
                        <div class="text-muted">
                          Mở: {{ fmtDate(r.openAt) }}
                        </div>
                        <div class="text-muted">
                          Đóng: {{ fmtDate(r.closeAt) }}
                        </div>
                      </td>
                      <td class="small">
                        <span
                          class="badge"
                          :class="
                            r.isProtected
                              ? 'bg-warning text-dark'
                              : 'bg-light text-muted border'
                          "
                        >
                          <i
                            class="bi"
                            :class="
                              r.isProtected ? 'bi-lock-fill' : 'bi-unlock'
                            "
                          ></i>
                          {{ r.isProtected ? "Có mật khẩu" : "Mở" }}
                        </span>
                      </td>
                      <!-- <td class="small">
                        <div>
                          <span class="badge bg-light text-dark border me-1">
                            Q {{ r.shuffleQuestions ? "On" : "Off" }}
                          </span>
                          <span class="badge bg-light text-dark border">
                            A {{ r.shuffleChoices ? "On" : "Off" }}
                          </span>
                        </div>
                      </td> -->
                      <td class="text-end">
                        <div class="mb-1">
                          <span class="badge" :class="statusClass(r)">
                            {{ roomStatus(r) }}
                          </span>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button
                            type="button"
                            class="btn btn-outline-primary"
                            @click="selectRoom(r.id)"
                            :disabled="selectedRoomId === r.id"
                          >
                            Chọn
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-secondary"
                            @click="openRoomDetail(r.id)"
                          >
                            Xem
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-warning"
                            @click="handleProtection(r)"
                            :disabled="loadingProtectId === r.id"
                            title="Đặt/bỏ mật khẩu phòng"
                          >
                            <span
                              v-if="loadingProtectId === r.id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            <i
                              v-else
                              class="bi"
                              :class="
                                r.isProtected ? 'bi-lock-fill' : 'bi-unlock'
                              "
                            ></i>
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-danger"
                            @click="handleCloseRoom(r.id)"
                            :disabled="closingRoomId === r.id || !isRoomLive(r)"
                          >
                            <span
                              v-if="closingRoomId === r.id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            Đóng
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-danger"
                            @click="handleDeleteRoom(r.id)"
                            :disabled="deletingRoomId === r.id || isRoomLive(r)"
                            title="Xóa phòng đã đóng"
                          >
                            <span
                              v-if="deletingRoomId === r.id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AttemptsRealtimeGrid
      :room-id="selectedRoomId"
      v-model:auto-refresh="autoRefreshAttempts"
      class="mb-3"
      @view="openAttemptDetail"
    />

    <RoomHistoryModal
      :show="showHistory"
      :exams="publishedExams"
      @close="showHistory = false"
    />

    <RoomDetailModal
      :show="showRoomDetail"
      :room="roomDetail ? { ...roomDetail, code: roomDetail.code ?? '' } : null"
      @close="closeRoomDetail"
    />

    <AttemptDetailModal
      :show="showAttemptDetail"
      mode="teacher"
      :detail="attemptDetail"
      @close="closeAttemptDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";
import AttemptsRealtimeGrid from "../../components/rooms/AttemptsRealtimeGrid.vue";
import RoomCreateForm from "../../components/rooms/RoomCreateForm.vue";
import RoomHistoryModal from "../../components/rooms/RoomHistoryModal.vue";
import AttemptDetailModal from "../../components/attempts/AttemptDetailModal.vue";
import RoomDetailModal from "../../components/rooms/RoomDetailModal.vue";

type ExamSummary = {
  id: number;
  title: string;
  status: string;
  code?: string | null;
};

type RoomSummary = {
  id: number;
  examId: number;
  code?: string | null;
  examCode?: string | null;
  examTitle?: string | null;
  openAt: string | null;
  closeAt: string | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: string;
  isProtected?: boolean;
};

type AttemptDetail = {
  id: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSec: number | null;
  examId: number;
  examTitle?: string | null;
  examCode?: string | null;
  passMarkPercent?: number | null;
  roomId?: number | null;
  answers: any[];
  studentId?: number;
  studentName?: string | null;
  studentCode?: string | null;
};

const exams = ref<ExamSummary[]>([]);
const rooms = ref<RoomSummary[]>([]);
const loadingExams = ref(false);
const loadingRooms = ref(false);
const selectedExamId = ref<number>(0);
const selectedRoomId = ref<number | null>(null);
const creating = ref(false);
const closingRoomId = ref<number | null>(null);
const deletingRoomId = ref<number | null>(null);
const autoRefreshAttempts = ref(false);
let autoRefreshTimer: ReturnType<typeof setTimeout> | null = null;
const showHistory = ref(false);
const showConfig = ref(true);
const loadingProtectId = ref<number | null>(null);
const showAttemptDetail = ref(false);
const attemptDetail = ref<AttemptDetail | null>(null);
const showRoomDetail = ref(false);
const roomDetail = ref<RoomSummary | null>(null);

const publishedExams = computed(() =>
  exams.value.filter(
    (e) => String(e.status || "").toUpperCase() === "PUBLISHED"
  )
);

const selectedExam = computed<ExamSummary | null>(() => {
  if (!selectedExamId.value) return null;
  return (
    publishedExams.value.find((e) => e.id === selectedExamId.value) || null
  );
});

const selectedRoom = computed<RoomSummary | null>(() => {
  if (!selectedRoomId.value) return null;
  return rooms.value.find((r) => r.id === selectedRoomId.value) || null;
});

const selectedRoomLabel = computed(() => {
  if (!selectedRoom.value) return "không có";
  return `#${selectedRoom.value.id}`;
});

async function ensureExams() {
  loadingExams.value = true;
  try {
    const user = getUser();
    const authorId = Number(user?.id || 0);
    const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
      params: { authorId, pageSize: 200 },
    });
    exams.value = (data.items || []) as any;
  } finally {
    loadingExams.value = false;
  }
}

function normalizeRoom(r: any): RoomSummary {
  return {
    id: Number(r.id),
    examId: Number(r.examId),
    code: r.code ?? null,
    examCode: r.examCode ?? selectedExam.value?.code ?? null,
    examTitle: r.examTitle ?? selectedExam.value?.title ?? null,
    openAt: (r.openAt as string | null) ?? null,
    closeAt: (r.closeAt as string | null) ?? null,
    durationSec:
      typeof r.durationSec === "number" ? (r.durationSec as number) : null,
    shuffleQuestions: !!r.shuffleQuestions,
    shuffleChoices: !!r.shuffleChoices,
    maxAttempts: Number(r.maxAttempts || 0),
    createdAt: String(r.createdAt),
    isProtected: !!(r as any).isProtected,
  };
}

function isRoomLive(r: RoomSummary): boolean {
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  const closeAt = r.closeAt ? new Date(r.closeAt) : null;
  const openOk = !openAt || openAt <= now;
  const closeOk = !closeAt || closeAt >= now;
  return openOk && closeOk;
}

function roomStatus(r: RoomSummary): string {
  if (isRoomLive(r)) return "Đang mở";
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  if (openAt && openAt > now) return "Chờ mở";
  return "Đã đóng";
}

function statusClass(r: RoomSummary): string {
  if (isRoomLive(r)) return "bg-success";
  const now = new Date();
  const openAt = r.openAt ? new Date(r.openAt) : null;
  if (openAt && openAt > now) return "bg-warning text-dark";
  return "bg-secondary";
}

function durationText(r: RoomSummary): string {
  if (!r.durationSec) return "Không giới hạn";
  return `${Math.round(r.durationSec / 60)} phút`;
}

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

async function loadRooms(preferRoomId?: number | null) {
  if (!selectedExamId.value) {
    rooms.value = [];
    selectedRoomId.value = null;
    return;
  }
  loadingRooms.value = true;
  try {
    const { data } = await api.get<Paginated<RoomSummary>>("/rooms", {
      params: { examId: selectedExamId.value, page: 1, pageSize: 100 },
    });
    const list = ((data.items || []) as any[]).map(normalizeRoom);
    rooms.value = list;
    const prefer = preferRoomId ?? selectedRoomId.value;
    if (prefer && list.some((r) => r.id === prefer)) {
      selectedRoomId.value = prefer;
    } else {
      const live = list.filter((r) => isRoomLive(r));
      const picked = (live[0] || list[0]) ?? null;
      selectedRoomId.value = picked ? picked.id : null;
    }
  } finally {
    loadingRooms.value = false;
  }
}

async function handleCreateRoom(payload: {
  openAt: string;
  closeAt: string;
  durationMinutes: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  requirePassword: boolean;
  password: string;
}) {
  if (!selectedExamId.value) return;
  creating.value = true;
  try {
    const body: any = {
      examId: selectedExamId.value,
      openAt: payload.openAt ? new Date(payload.openAt) : null,
      closeAt: payload.closeAt ? new Date(payload.closeAt) : null,
      durationSec: payload.durationMinutes
        ? Number(payload.durationMinutes) * 60
        : null,
      shuffleQuestions: !!payload.shuffleQuestions,
      shuffleChoices: !!payload.shuffleChoices,
      maxAttempts: payload.maxAttempts || 1,
      isProtected: !!payload.requirePassword,
      password: payload.requirePassword ? payload.password : undefined,
    };
    const { data } = await api.post("/rooms", body);
    const createdId =
      data && typeof (data as any).id !== "undefined"
        ? Number((data as any).id)
        : null;
    await loadRooms(createdId ?? undefined);
    autoRefreshAttempts.value = true;
    if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
    autoRefreshTimer = setTimeout(() => {
      autoRefreshAttempts.value = false;
    }, 60_000);
    showConfig.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tạo phòng thi");
  } finally {
    creating.value = false;
  }
}

async function handleCloseRoom(roomId: number) {
  const room = rooms.value.find((r) => r.id === roomId);
  if (!room) return;
  if (
    !window.confirm(
      "Bạn chắc chắn muốn đóng phòng thi này ngay bây giờ? Sinh viên sẽ không thể vào thêm."
    )
  ) {
    return;
  }
  closingRoomId.value = roomId;
  try {
    await api.post(`/rooms/${roomId}/close`);
    await loadRooms(roomId);
  } catch (e: any) {
    alert(e?.message || "Không thể đóng phòng thi");
  } finally {
    closingRoomId.value = null;
  }
}

async function handleDeleteRoom(roomId: number) {
  const room = rooms.value.find((r) => r.id === roomId);
  if (!room) return;
  if (isRoomLive(room)) {
    alert("Chỉ xóa được phòng đã đóng.");
    return;
  }
  if (
    !window.confirm(
      "Bạn chắc chắn muốn xóa phòng này? Phòng đã có bài thi của sinh viên sẽ không xóa được."
    )
  ) {
    return;
  }
  deletingRoomId.value = roomId;
  try {
    await api.delete(`/rooms/${roomId}`);
    if (selectedRoomId.value === roomId) {
      selectedRoomId.value = null;
    }
    await loadRooms();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "";
    if (msg) {
      alert(msg);
    } else {
      alert("Không thể xóa phòng thi (có thể đã có bài thi).");
    }
  } finally {
    deletingRoomId.value = null;
  }
}

async function handleProtection(room: RoomSummary) {
  const current = !!room.isProtected;
  const enable = !current;
  let password: string | undefined;
  if (enable) {
    const pw = window.prompt("Nhập mật khẩu mới cho phòng này:");
    if (!pw) return;
    password = pw;
  } else {
    if (!window.confirm("Bỏ mật khẩu và mở phòng không bảo vệ?")) return;
  }
  loadingProtectId.value = room.id;
  try {
    await api.post(`/rooms/${room.id}/protection`, {
      isProtected: enable,
      password,
    });
    await loadRooms(room.id);
  } catch (e: any) {
    alert(
      e?.response?.data?.message ||
        e?.message ||
        "Không thể cập nhật bảo vệ phòng"
    );
  } finally {
    loadingProtectId.value = null;
  }
}

function selectRoom(id: number) {
  selectedRoomId.value = id;
}

function openRoomDetail(roomId: number) {
  const found = rooms.value.find((r) => r.id === roomId) || null;
  roomDetail.value = found ? { ...found } : null;
  showRoomDetail.value = !!found;
}

function closeRoomDetail() {
  showRoomDetail.value = false;
  roomDetail.value = null;
}

function onExamChange() {
  selectedRoomId.value = null;
  loadRooms();
}

function toggleConfig() {
  showConfig.value = !showConfig.value;
}

async function openAttemptDetail(id: number) {
  try {
    const { data } = await api.get<AttemptDetail>(`/attempts/${id}/detail`);
    const examMeta = selectedExam.value;
    const roomMeta = selectedRoom.value;
    attemptDetail.value = {
      ...data,
      examCode: data.examCode ?? examMeta?.code ?? null,
      examTitle: data.examTitle ?? examMeta?.title ?? null,
      roomId: data.roomId ?? roomMeta?.id ?? selectedRoomId.value ?? null,
    } as any;
    showAttemptDetail.value = true;
  } catch (e: any) {
    alert(e?.message || "Không thể tải chi tiết bài thi");
  }
}

function closeAttemptDetail() {
  showAttemptDetail.value = false;
}

onMounted(async () => {
  await ensureExams();
  if (publishedExams.value.length > 0) {
    selectedExamId.value = publishedExams.value[0].id;
    await loadRooms();
  }
});
</script>

<style scoped>
.room-create-page code {
  font-size: 0.9rem;
}
</style>
