<template>
  <div
    class="modal fade show"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    v-if="show"
    style="display: block"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Thêm câu hỏi</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="onClose"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Gắn vào đề thi (tùy chọn)</label>
                <select v-model.number="addForm.examId" class="form-select">
                  <option :value="0">— Không gắn —</option>
                  <option v-for="e in exams" :key="e.id" :value="e.id">
                    #{{ e.id }} - {{ e.title }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Môn học</label>
                <select v-model.number="addForm.subjectId" class="form-select">
                  <option :value="0" disabled>-- Chọn môn --</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Nội dung câu hỏi</label>
                <textarea
                  v-model.trim="addForm.text"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Giải thích (tùy chọn)</label>
                <textarea
                  v-model.trim="addForm.explanation"
                  rows="2"
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <div class="row g-3 mt-1">
              <div class="col-12 col-md-12">
                <label class="form-label">Điểm</label>
                <input
                  v-model.number="addForm.points"
                  type="number"
                  step="0.5"
                  min="0"
                  class="form-control"
                />
              </div>
            </div>

            <div class="mt-4">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <strong>Đáp án</strong>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="addChoice"
                >
                  <i class="bi bi-plus-lg"></i> Thêm đáp án
                </button>
              </div>
              <div class="list-group">
                <div
                  v-for="(c, idx) in addForm.choices"
                  :key="idx"
                  class="list-group-item"
                >
                  <div class="row g-2 align-items-center">
                    <div class="col-12 col-md-8">
                      <input
                        v-model.trim="c.content"
                        type="text"
                        class="form-control"
                        :placeholder="`Đáp án #${idx + 1}`"
                      />
                    </div>
                    <div class="col-8 col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :checked="c.isCorrect"
                          @change="onToggleCorrect(idx, $event)"
                          :id="`c-${idx}`"
                        />
                        <label class="form-check-label" :for="`c-${idx}`">
                          Đúng
                        </label>
                      </div>
                    </div>
                    <div class="col-4 col-md-1 text-end">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="removeChoice(idx)"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-text">
                Với loại 1 đáp án đúng, chỉ chọn đúng duy nhất 1 đáp án.
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="onClose">
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="saving || !canSubmitAdd"
            @click="submitAdd"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu câu hỏi
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type ExamSummary = { id: number; title: string };

const props = defineProps<{
  show: boolean;
  subjects: Array<{ id: number; name: string }>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const saving = ref(false);
const exams = ref<ExamSummary[]>([]);
const addForm = reactive<{
  examId: number;
  text: string;
  explanation: string | null;
  subjectId: number;
  type: "SC" | "MC";
  points: number;
  choices: Array<{ content: string; isCorrect: boolean }>;
}>({
  examId: 0,
  text: "",
  explanation: null,
  subjectId: 0,
  type: "SC",
  points: 1,
  choices: [
    { content: "", isCorrect: true },
    { content: "", isCorrect: false },
  ],
});

function onClose() {
  emit("close");
}

function addChoice() {
  addForm.choices.push({ content: "", isCorrect: false });
}

function removeChoice(i: number) {
  addForm.choices.splice(i, 1);
}

function onToggleCorrect(idx: number, e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  if (addForm.type === "SC") {
    addForm.choices.forEach(
      (c, i) => (c.isCorrect = i === idx ? checked : false)
    );
  } else {
    addForm.choices[idx].isCorrect = checked;
  }
}

const canSubmitAdd = computed(
  () =>
    addForm.text.trim().length > 0 &&
    addForm.subjectId > 0 &&
    addForm.choices.length > 0 &&
    addForm.choices.some((c) => c.content.trim()) &&
    addForm.choices.some((c) => c.isCorrect)
);

async function ensureExams() {
  if (exams.value.length) return;
  const user = getUser();
  const authorId = Number(user?.id || 0);
  const { data } = await api.get<Paginated<ExamSummary>>("/exams", {
    params: { authorId, pageSize: 100 },
  });
  exams.value = data.items;
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      ensureExams();
    }
  }
);

async function submitAdd() {
  if (!canSubmitAdd.value) return;
  saving.value = true;
  try {
    const payload: any = {
      text: addForm.text,
      explanation: addForm.explanation,
      subjectId: addForm.subjectId,
      type: addForm.type,
      choices: addForm.choices
        .filter((c) => c.content.trim())
        .map((c, idx) => ({
          content: c.content.trim(),
          isCorrect: !!c.isCorrect,
          order: idx,
        })),
    };
    if (addForm.examId > 0) {
      payload.examId = addForm.examId;
      payload.points = addForm.points;
    }
    await api.post("/questions", payload);
    // reset form
    addForm.text = "";
    addForm.explanation = null;
    addForm.subjectId = 0;
    addForm.examId = 0;
    addForm.points = 1;
    addForm.choices = [
      { content: "", isCorrect: true },
      { content: "", isCorrect: false },
    ];
    emit("created");
    emit("close");
  } catch (e: any) {
    alert(e?.message || "Không thể thêm câu hỏi");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
@media (max-width: 575.98px) {
  .modal-body .list-group-item {
    padding: 0.5rem;
  }
}
</style>
