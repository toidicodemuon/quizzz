<template>
  <div class="card rounded-0">
    <div class="card-header">
      <h5 class="mb-0">Quản lý phòng thi & bài thi</h5>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-md-5 col-12">
          <label class="form-label">Chọn đề thi</label>
          <select class="form-select" v-model.number="examId" @change="onExamChange">
            <option :value="0" disabled>-- Chọn đề thi --</option>
            <option v-for="e in exams" :key="e.id" :value="e.id">#{{ e.id }} - {{ e.title }} ({{ e.status }})</option>
          </select>
        </div>
        <div class="col-md-7 col-12">
          <div class="alert alert-info py-2" v-if="!examId">
            Vui lòng chọn một đề thi để quản lý phòng và bài thi sinh viên.
          </div>
        </div>
      </div>

      <hr />

      <div class="row g-4" v-if="examId">
        <div class="col-lg-5">
          <div class="card h-100">
            <div class="card-header"><strong>Tạo phòng thi</strong></div>
            <div class="card-body">
              <div class="mb-2">
                <label class="form-label">Mã phòng (tuỳ chọn)</label>
                <input v-model.trim="form.code" class="form-control" placeholder="Để trống sẽ tự tạo" />
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label">Mở lúc</label>
                  <input type="datetime-local" class="form-control" v-model="form.openAt" />
                </div>
                <div class="col-6">
                  <label class="form-label">Đóng lúc</label>
                  <input type="datetime-local" class="form-control" v-model="form.closeAt" />
                </div>
              </div>
              <div class="row g-2 mt-2">
                <div class="col-6">
                  <label class="form-label">Thời lượng (giây)</label>
                  <input type="number" class="form-control" v-model.number="form.durationSec" placeholder="Ví dụ: 1800" />
                </div>
                <div class="col-6">
                  <label class="form-label">Số lượt tối đa</label>
                  <input type="number" class="form-control" v-model.number="form.maxAttempts" min="1" />
                </div>
              </div>
              <div class="form-check form-switch mt-3">
                <input class="form-check-input" type="checkbox" v-model="form.shuffleQuestions" id="sq" />
                <label class="form-check-label" for="sq">Xáo trộn câu hỏi</label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="form.shuffleChoices" id="sc" />
                <label class="form-check-label" for="sc">Xáo trộn đáp án</label>
              </div>
            </div>
            <div class="card-footer text-end">
              <button class="btn btn-primary" :disabled="creating || !examId" @click="createRoom">
                <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
                Tạo phòng
              </button>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
              <strong>Danh sách phòng</strong>
              <div class="small text-muted">Tổng: {{ roomsTotal }}</div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm align-middle">
                  <thead>
                    <tr class="text-muted small">
                      <th>#</th>
                      <th>Mã</th>
                      <th>Mở</th>
                      <th>Đóng</th>
                      <th>Dur</th>
                      <th>Attempts</th>
                      <th>Shuffle</th>
                      <th>Tạo lúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in rooms" :key="r.id">
                      <td>{{ r.id }}</td>
                      <td><code>{{ r.code }}</code></td>
                      <td>{{ fmtDate(r.openAt) }}</td>
                      <td>{{ fmtDate(r.closeAt) }}</td>
                      <td>{{ r.durationSec ?? '-' }}</td>
                      <td>{{ r.maxAttempts }}</td>
                      <td>
                        <span class="badge bg-light text-dark">Q: {{ r.shuffleQuestions ? 'Y' : 'N' }}</span>
                        <span class="badge bg-light text-dark ms-1">C: {{ r.shuffleChoices ? 'Y' : 'N' }}</span>
                      </td>
                      <td>{{ fmtDate(r.createdAt) }}</td>
                    </tr>
                    <tr v-if="!loadingRooms && rooms.length === 0">
                      <td colspan="8" class="text-center text-muted">Chưa có phòng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Pagination
                class="mt-2"
                :page="roomsPage"
                :page-size="roomsPageSize"
                :total="roomsTotal"
                :disabled="loadingRooms"
                @update:page="(p) => { roomsPage = p; loadRooms(); }"
                @update:page-size="(s) => { roomsPageSize = s; roomsPage = 1; loadRooms(); }"
              />
            </div>
          </div>
        </div>
      </div>

      <hr class="my-4" v-if="examId" />

      <div v-if="examId" class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
          <strong>Danh sách bài thi sinh viên</strong>
          <div class="small text-muted">Tổng: {{ attemptsTotal }}</div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm align-middle">
              <thead>
                <tr class="text-muted small">
                  <th>#</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Bắt đầu</th>
                  <th>Nộp</th>
                  <th>Thời gian</th>
                  <th class="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in attempts" :key="a.id">
                  <td>{{ a.id }}</td>
                  <td>#{{ a.studentId }}</td>
                  <td>{{ a.score ?? '-' }}</td>
                  <td>
                    <span class="badge" :class="a.status === 'SUBMITTED' ? 'bg-success' : (a.status === 'IN_PROGRESS' ? 'bg-warning text-dark' : 'bg-secondary')">{{ a.status }}</span>
                  </td>
                  <td>{{ fmtDate(a.startedAt) }}</td>
                  <td>{{ fmtDate(a.submittedAt) }}</td>
                  <td>{{ a.timeTakenSec ? a.timeTakenSec + 's' : '-' }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" @click="delAttempt(a.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!loadingAttempts && attempts.length === 0">
                  <td colspan="8" class="text-center text-muted">Chưa có dữ liệu</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination
            class="mt-2"
            :page="attemptsPage"
            :page-size="attemptsPageSize"
            :total="attemptsTotal"
            :disabled="loadingAttempts"
            @update:page="(p) => { attemptsPage = p; loadAttempts(); }"
            @update:page-size="(s) => { attemptsPageSize = s; attemptsPage = 1; loadAttempts(); }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type ExamSummary = { id: number; title: string; status: string };
type Room = {
  id: number; examId: number; code: string; openAt: string | null; closeAt: string | null;
  durationSec: number | null; shuffleQuestions: boolean; shuffleChoices: boolean; maxAttempts: number; createdAt: string
};
type Attempt = {
  id: number; score: number | null; startedAt: string; submittedAt: string | null; timeTakenSec: number | null; studentId: number; status: string
};

const exams = ref<ExamSummary[]>([]);
const examId = ref<number>(0);

const form = reactive({
  code: "",
  openAt: "",
  closeAt: "",
  durationSec: 1800,
  shuffleQuestions: true,
  shuffleChoices: true,
  maxAttempts: 1,
});
const creating = ref(false);

const rooms = ref<Room[]>([]);
let roomsPage = ref(1);
let roomsPageSize = ref(10);
const roomsTotal = ref(0);
const loadingRooms = ref(false);

const attempts = ref<Attempt[]>([]);
let attemptsPage = ref(1);
let attemptsPageSize = ref(10);
const attemptsTotal = ref(0);
const loadingAttempts = ref(false);

function fmtDate(d: any) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const hh = String(dt.getHours()).padStart(2, '0');
    const mi = String(dt.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch { return String(d); }
}

async function ensureExams() {
  const user = getUser();
  const authorId = Number(user?.id || 0);
  const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
    params: { authorId, pageSize: 200 },
  });
  exams.value = data.items as any;
}

function onExamChange() {
  roomsPage.value = 1;
  attemptsPage.value = 1;
  loadRooms();
  loadAttempts();
}

async function loadRooms() {
  if (!examId.value) { rooms.value = []; roomsTotal.value = 0; return; }
  loadingRooms.value = true;
  try {
    const { data } = await api.get<Paginated<Room>>("/rooms", {
      params: { examId: examId.value, page: roomsPage.value, pageSize: roomsPageSize.value },
    });
    rooms.value = data.items as any;
    roomsTotal.value = data.total;
  } finally {
    loadingRooms.value = false;
  }
}

async function loadAttempts() {
  if (!examId.value) { attempts.value = []; attemptsTotal.value = 0; return; }
  loadingAttempts.value = true;
  try {
    const { data } = await api.get<Paginated<Attempt>>("/attempts", {
      params: { examId: examId.value, page: attemptsPage.value, pageSize: attemptsPageSize.value },
    });
    attempts.value = data.items as any;
    attemptsTotal.value = data.total;
  } finally {
    loadingAttempts.value = false;
  }
}

async function createRoom() {
  if (!examId.value) return;
  creating.value = true;
  try {
    const payload: any = {
      examId: examId.value,
      code: form.code || undefined,
      openAt: form.openAt ? new Date(form.openAt) : null,
      closeAt: form.closeAt ? new Date(form.closeAt) : null,
      durationSec: form.durationSec || null,
      shuffleQuestions: !!form.shuffleQuestions,
      shuffleChoices: !!form.shuffleChoices,
      maxAttempts: form.maxAttempts || 1,
    };
    await api.post("/rooms", payload);
    form.code = "";
    loadRooms();
  } catch (e: any) {
    alert(e?.message || "Không thể tạo phòng");
  } finally {
    creating.value = false;
  }
}

async function delAttempt(id: number) {
  if (!confirm(`Xóa bài thi #${id}?`)) return;
  try {
    await api.delete(`/attempts/${id}`);
    loadAttempts();
  } catch (e: any) {
    alert(e?.message || "Không thể xóa bài thi");
  }
}

onMounted(async () => {
  await ensureExams();
  if (exams.value.length) {
    examId.value = exams.value[0].id;
    loadRooms();
    loadAttempts();
  }
});
</script>

<style scoped>
code { font-size: 0.9rem; }
</style>
