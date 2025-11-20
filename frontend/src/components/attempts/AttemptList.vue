<template>
  <div class="table-responsive">
    <table class="table table-sm align-middle">
      <thead>
        <tr class="text-muted small">
          <th>#</th>
          <th>Mã đề</th>
          <th>Tiêu đề</th>
          <th v-if="isTeacher">Mã SV</th>
          <th v-if="isTeacher">Tên học viên</th>
          <th>Đúng/Tổng</th>
          <th>Kết quả</th>
          <th>Bắt đầu</th>
          <th>Nộp</th>
          <th>Thời gian làm</th>
          <th class="text-end">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in items" :key="a.id">
          <td>{{ a.id }}</td>
          <td>
            <code>{{ a.examCode ?? "-" }}</code>
          </td>
          <td>{{ a.examTitle ?? "-" }}</td>
          <td v-if="isTeacher" class="small">
            <code>{{ a.studentCode ?? "-" }}</code>
          </td>
          <td v-if="isTeacher">
            {{ a.studentName ?? "#" + a.studentId }}
          </td>
          <td>{{ a.correctCount ?? 0 }}/{{ a.totalQuestions ?? 0 }}</td>
          <td>
            <span v-if="a.pass === true" class="badge bg-success">Đậu</span>
            <span v-else-if="a.pass === false" class="badge bg-danger"
              >Rớt</span
            >
            <span v-else class="badge bg-secondary">-</span>
          </td>

          <td>{{ fmtDate(a.startedAt) }}</td>
          <td>{{ fmtDate(a.submittedAt) }}</td>
          <td>{{ fmtDuration(a.timeTakenSec) }}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="onView(a.id)"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                v-if="isTeacher"
                class="btn btn-outline-danger"
                type="button"
                @click="onDelete(a.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!loading && items.length === 0">
          <td :colspan="isTeacher ? 11 : 8" class="text-center text-muted">
            Không có dữ liệu
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type AttemptListItem = {
  id: number;
  examCode?: string | null;
  examTitle?: string | null;
  score?: number | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  timeTakenSec?: number | null;
  studentId?: number;
  studentName?: string | null;
  studentCode?: string | null;
  correctCount?: number | null;
  totalQuestions?: number | null;
  pass?: boolean | null;
};

const props = defineProps<{
  mode?: "student" | "teacher";
  items: AttemptListItem[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "view", id: number): void;
  (e: "delete", id: number): void;
}>();

const isTeacher = computed(() => (props.mode ?? "student") === "teacher");
const loading = computed(() => !!props.loading);

function fmtDate(d: any) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch {
    return String(d);
  }
}

function fmtDuration(sec: any) {
  const s = Number(sec || 0);
  if (!s || s <= 0) return "-";
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

function onView(id: number) {
  emit("view", id);
}

function onDelete(id: number) {
  emit("delete", id);
}
</script>

<style scoped></style>
