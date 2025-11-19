<template>
  <div
    class="modal fade show"
    v-if="show"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? "Sửa đề thi" : "Tạo đề thi" }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Tiêu đề</label>
                <input
                  v-model.trim="form.title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Mã đề</label>
                <input
                  v-model.trim="form.code"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Loại đề thi</label>
                <select v-model="form.examType" class="form-select">
                  <option value="PRACTICE">PRACTICE</option>
                  <option value="MIDTERM">MIDTERM</option>
                  <option value="FINAL">FINAL</option>
                  <option value="MOCK">MOCK</option>
                  <option value="MOS_DRILL">MOS_DRILL</option>
                  <option value="PLACEMENT">PLACEMENT</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Tổng điểm</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  v-model.number="form.totalPoints"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Điểm đầu vào (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  v-model.number="form.passMarkPercent"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Chấm điểm</label>
                <select v-model="form.scoringMode" class="form-select">
                  <option value="STANDARD">STANDARD</option>
                  <option value="PARTIAL_CREDIT">PARTIAL_CREDIT</option>
                  <option value="NEGATIVE_MARKING">NEGATIVE_MARKING</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Hiển thị phản hồi</label>
                <select v-model="form.feedbackMode" class="form-select">
                  <option value="NONE">NONE</option>
                  <option value="AFTER_SUBMIT">AFTER_SUBMIT</option>
                  <option value="DETAILED">DETAILED</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Môn học (tuỳ chọn)</label>
                <select v-model.number="form.subjectId" class="form-select">
                  <option :value="0">- Không chọn -</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <div class="row row-cols-1 row-cols-md-3 g-2">
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk1"
                        v-model="form.showScoreImmediately"
                      />
                      <label class="form-check-label" for="chk1">
                        Hiển thị điểm ngay
                      </label>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk2"
                        v-model="form.showCorrectAnswers"
                      />
                      <label class="form-check-label" for="chk2">
                        Hiển thị đáp án đúng
                      </label>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk3"
                        v-model="form.showExplanation"
                      />
                      <label class="form-check-label" for="chk3">
                        Hiển thị giải thích
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6" v-if="false">
                <label class="form-label">Thời gian xem lại (phút)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  v-model.number="form.reviewWindowMin"
                  class="form-control"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model.trim="form.description"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeModal">Đóng</button>
          <button
            class="btn btn-outline-primary"
            :disabled="saving || !form.title.trim()"
            @click="submitAndPick"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu & chọn câu hỏi
          </button>
          <button
            class="btn btn-primary"
            :disabled="saving || !form.title.trim()"
            @click="submit"
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
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import api from "../../api";

type Subject = { id: number; name: string };

type ExamForm = {
  id?: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subjectId: number;
  examType:
    | "PRACTICE"
    | "MIDTERM"
    | "FINAL"
    | "MOCK"
    | "MOS_DRILL"
    | "PLACEMENT";
  totalPoints: number | null;
  passMarkPercent: number | null;
  scoringMode: "STANDARD" | "PARTIAL_CREDIT" | "NEGATIVE_MARKING";
  feedbackMode: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  showScoreImmediately: boolean;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  reviewWindowMin: number | null;
};

const props = defineProps<{
  show: boolean;
  examId: number | null;
  subjects: Subject[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", examId: number): void;
  (e: "pick", examId: number): void;
}>();

const saving = ref(false);

const defaultForm: ExamForm = {
  title: "",
  description: null,
  code: null,
  status: "DRAFT",
  subjectId: 0,
  examType: "PRACTICE",
  totalPoints: null,
  passMarkPercent: null,
  scoringMode: "STANDARD",
  feedbackMode: "DETAILED",
  showScoreImmediately: true,
  showCorrectAnswers: true,
  showExplanation: true,
  reviewWindowMin: null,
};

const form = reactive<ExamForm>({ ...defaultForm });

const isEdit = computed(() => !!form.id);

function resetForm() {
  Object.assign(form, defaultForm);
  delete form.id;
}

async function loadExam(id: number) {
  try {
    const { data } = await api.get(`/exams/${id}`);
    (form as any).id = data.id;
    form.title = data.title;
    form.description = data.description ?? null;
    form.code = data.code ?? null;
    form.status = data.status;
    form.subjectId = data.subjectId ?? 0;
    form.examType = data.examType || "PRACTICE";
    form.totalPoints =
      typeof data.totalPoints === "number"
        ? data.totalPoints
        : typeof data.totalPoints === "string"
        ? Number(data.totalPoints)
        : null;
    form.passMarkPercent = data.passMarkPercent ?? null;
    form.scoringMode = data.scoringMode || "STANDARD";
    form.feedbackMode = data.feedbackMode || "DETAILED";
    form.showScoreImmediately = !!data.showScoreImmediately;
    form.showCorrectAnswers = !!data.showCorrectAnswers;
    form.showExplanation = !!data.showExplanation;
    form.reviewWindowMin = data.reviewWindowMin ?? null;
  } catch (err: any) {
    alert(err?.message || "Không thể tải dữ liệu đề thi");
  }
}

watch(
  () => props.examId,
  (id) => {
    resetForm();
    if (id) {
      loadExam(id);
    }
  },
  { immediate: true }
);

function closeModal() {
  emit("close");
}

function buildPayload() {
  return {
    title: form.title,
    description: form.description,
    code: form.code,
    status: form.status,
    subjectId: form.subjectId || null,
    examType: form.examType,
    totalPoints: form.totalPoints,
    passMarkPercent: form.passMarkPercent,
    scoringMode: form.scoringMode,
    feedbackMode: form.feedbackMode,
    showScoreImmediately: form.showScoreImmediately,
    showCorrectAnswers: form.showCorrectAnswers,
    showExplanation: form.showExplanation,
    reviewWindowMin: form.reviewWindowMin,
  };
}

async function saveExam(): Promise<number | null> {
  if (!form.title.trim()) return null;
  saving.value = true;
  try {
    let id = form.id ?? null;
    const payload = buildPayload();
    if (!id) {
      const { data } = await api.post("/exams", payload);
      id = data.id;
      (form as any).id = id;
    } else {
      await api.put(`/exams/${id}`, payload);
    }
    if (id != null) {
      emit("saved", id);
    }
    return id;
  } catch (e: any) {
    alert(e?.message || "Không thể lưu đề thi");
    return null;
  } finally {
    saving.value = false;
  }
}

async function submit() {
  const id = await saveExam();
  if (id != null) {
    closeModal();
  }
}

async function submitAndPick() {
  const id = await saveExam();
  if (id != null) {
    emit("pick", id);
    closeModal();
  }
}
</script>

<style scoped>
/* Ẩn một số option nâng cao (giữ để đơn giản cho giáo viên) */
.modal-body form .row.g-3 > div:nth-of-type(4),
.modal-body form .row.g-3 > div:nth-of-type(7),
.modal-body form .row.g-3 > div:nth-of-type(8),
.modal-body form .row.g-3 > div:nth-of-type(10) {
  display: none;
}
</style>
