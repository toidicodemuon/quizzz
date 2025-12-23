<template>
  <div class="position-relative">
    <LoadingOverlay :show="loading" />
    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead>
          <tr class="text-muted small">
            <th v-if="showCheckbox" style="width: 36px">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="allPageSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th>#</th>
            <th>Mã đề</th>
            <th>Phòng</th>
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
            <td v-if="showCheckbox">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="isSelected(a)"
                @change="(e) => onToggle(a, e)"
              />
            </td>
            <td>{{ a.id }}</td>
            <td>
              <div class="d-flex align-items-center gap-1">
                <code>{{ a.examCode ?? "-" }}</code>
                <button
                  v-if="isTeacher && showExamIcon && a.examId"
                  type="button"
                  class="btn btn-link p-0 text-primary"
                  @click="onViewExam(a.examId)"
                  title="Xem đề thi"
                >
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </td>
            <td>
              <code>{{ a.roomId ?? "-" }}</code>
            </td>
            <td>{{ a.examTitle ?? "-" }}</td>
            <td v-if="isTeacher" class="small">
              <div class="d-flex align-items-center gap-1">
                <code>{{ a.studentCode ?? "-" }}</code>
                <button
                  v-if="showStudentSearch && a.studentCode"
                  type="button"
                  class="btn btn-link p-0 text-primary"
                  @click="onSearchStudentCode(a.studentCode)"
                  title="Tìm mã SV này"
                >
                  <i class="bi bi-search"></i>
                </button>
              </div>
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
                  title="Xem bài thi"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  v-if="showPrint"
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="onPrint(a.id)"
                  title="In bai thi"
                >
                  <i class="bi bi-printer"></i>
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
            <td
              :colspan="(isTeacher ? 12 : 10) + (showCheckbox ? 1 : 0)"
              class="text-center text-muted"
            >
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LoadingOverlay from "../common/LoadingOverlay.vue";

type AttemptListItem = {
  id: number;
  examId?: number;
  examCode?: string | null;
  roomId?: number | null;
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

const props = withDefaults(
  defineProps<{
    mode?: "student" | "teacher";
    items: AttemptListItem[];
    loading?: boolean;
    showCheckbox?: boolean;
    selectedIds?: Set<number>;
    showExamIcon?: boolean;
    showStudentSearch?: boolean;
    showPrint?: boolean;
  }>(),
  {
    showExamIcon: true,
    showStudentSearch: true,
    showPrint: true,
  }
);

const emit = defineEmits<{
  (e: "view", id: number): void;
  (e: "print", id: number): void;
  (e: "delete", id: number): void;
  (e: "search-student-code", code: string): void;
  (e: "view-exam", examId: number): void;
}>();

const isTeacher = computed(() => (props.mode ?? "student") === "teacher");
const loading = computed(() => !!props.loading);
const showCheckbox = computed(() => !!props.showCheckbox);
const showExamIcon = computed(() => props.showExamIcon !== false);
const showStudentSearch = computed(() => props.showStudentSearch !== false);
const showPrint = computed(() => props.showPrint !== false);
const allPageSelected = computed(
  () =>
    !!props.showCheckbox &&
    (props.items?.length || 0) > 0 &&
    props.items.every((a) =>
      props.selectedIds ? props.selectedIds.has(a.id) : false
    )
);

function isSelected(a: AttemptListItem) {
  if (!props.selectedIds) return false;
  return props.selectedIds.has(a.id);
}

function onToggle(a: AttemptListItem, ev: Event) {
  if (!props.selectedIds) return;
  const checked = (ev.target as HTMLInputElement).checked;
  checked ? props.selectedIds.add(a.id) : props.selectedIds.delete(a.id);
}

function toggleSelectAll(ev: Event) {
  if (!props.selectedIds) return;
  const checked = (ev.target as HTMLInputElement).checked;
  props.items.forEach((a) =>
    checked ? props.selectedIds!.add(a.id) : props.selectedIds!.delete(a.id)
  );
}

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

function onPrint(id: number) {
  emit("print", id);
}

function onDelete(id: number) {
  emit("delete", id);
}

function onSearchStudentCode(code: string) {
  emit("search-student-code", code);
}

function onViewExam(examId: number) {
  emit("view-exam", examId);
}
</script>

<style scoped></style>
