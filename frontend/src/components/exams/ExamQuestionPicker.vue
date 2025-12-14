<template>
  <div class="row g-3">
    <div class="col-12 col-lg-6">
      <div class="mb-2 d-flex justify-content-between align-items-center">
        <strong>Câu hỏi trong đề</strong>
        <button
          class="btn btn-sm btn-outline-danger"
          :disabled="selectedExamQuestionIds.size === 0 || loading"
          @click="removeSelectedFromExam"
        >
          <i class="bi bi-trash me-1"></i> Gỡ khỏi đề
        </button>
      </div>
      <div class="table-responsive border rounded picker-scroll">
        <table class="table align-middle mb-0">
          <thead>
            <tr class="text-uppercase text-muted small">
              <th style="width: 36px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="allExamQuestionsSelected"
                  @change="toggleSelectAllExamQuestions($event)"
                />
              </th>
              <th class="d-none d-sm-table-cell">STT</th>
              <th class="d-none d-sm-table-cell">ID</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(q, idx) in examQuestions" :key="q.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedExamQuestionIds.has(q.id)"
                  @change="onToggleExamQuestion(q.id, $event)"
                />
              </td>
              <td class="d-none d-sm-table-cell fw-semibold text-muted">
                {{ idx + 1 }}
              </td>
              <td class="d-none d-sm-table-cell fw-semibold">#{{ q.id }}</td>
              <td>
                <div class="fw-semibold">{{ q.text }}</div>
                <div class="text-muted small" v-if="q.explanation">
                  {{ q.explanation }}
                </div>
              </td>
            </tr>
            <tr v-if="examQuestions.length === 0">
              <td colspan="3" class="text-center text-muted">
                Chưa có câu hỏi
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="row g-2 align-items-center mb-2">
        <div class="col-12 col-lg-3">
          <strong>Ngân hàng câu hỏi</strong>
        </div>
        <div class="col-12 col-lg-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select"
              v-model.number="qb.subjectId"
              @change="
                qb.setPage(1);
                qb.reload();
              "
            >
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="ccol-12 col-lg-3">
          <input
            v-model.trim="qb.search"
            class="form-control form-control-sm"
            placeholder="Tìm câu hỏi..."
          />
        </div>
        <div class="col-12 col-lg-2 justify-content-end d-flex">
          <button
            class="btn btn-sm btn-primary w-100"
            :disabled="selectedBankIds.size === 0 || loading"
            @click="addSelectedToExam"
          >
            <i class="bi bi-plus-lg me-1"></i>
            <span class="">Thêm vào đề</span>
          </button>
        </div>
      </div>
      <div class="table-responsive border rounded picker-scroll">
        <table class="table align-middle mb-0">
          <thead>
            <tr class="text-uppercase text-muted small">
              <th style="width: 36px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="allBankSelected"
                  @change="toggleSelectAllBank($event)"
                />
              </th>
              <th class="d-none d-sm-table-cell">STT</th>
              <th class="d-none d-sm-table-cell">ID</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(q, idx) in qb.filteredItems" :key="q.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedBankIds.has(q.id)"
                  @change="onToggleBank(q.id, $event)"
                />
              </td>
              <td class="d-none d-sm-table-cell fw-semibold text-muted">
                {{ idx + 1 }}
              </td>
              <td class="d-none d-sm-table-cell fw-semibold">#{{ q.id }}</td>
              <td>
                <div class="fw-semibold">{{ q.text }}</div>
                <div class="text-muted small" v-if="q.explanation">
                  {{ q.explanation }}
                </div>
              </td>
            </tr>
            <tr v-if="qb.filteredItems.length === 0">
              <td colspan="3" class="text-center text-muted">
                Không có câu hỏi
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2">
        <Pagination
          :page="qb.page"
          :page-size="qb.pageSize"
          :total="qb.total"
          :page-size-options="pageSizeOptions"
          :disabled="qb.loading"
          @update:page="
            (p) => {
              qb.setPage(p);
              qb.reload();
            }
          "
          @update:page-size="
            (sz) => {
              qb.setPageSize(sz);
              qb.reload();
            }
          "
        />
      </div>
      <div class="mt-2 d-flex align-items-center justify-content-between">
        <div
          class="input-group input-group-sm"
          style="max-width: 260px; display: none"
          v-if="false"
        >
          <span class="input-group-text">Điểm mặc định</span>
          <input
            type="number"
            min="0"
            step="0.5"
            class="form-control"
            v-model.number="defaultAddPoints"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Pagination from "../common/Pagination.vue";
import api, { type Paginated } from "../../api";
import { useQuestionBankStore } from "../../stores/questionBank";

type Subject = { id: number; name: string };

type QuestionLite = {
  id: number;
  text: string;
  explanation: string | null;
};

const props = defineProps<{
  examId: number | null;
  subjects: Subject[];
}>();

const loading = ref(false);

// questions in exam
const examQuestions = ref<QuestionLite[]>([]);
const selectedExamQuestionIds = reactive(new Set<number>());
const allExamQuestionsSelected = computed(
  () =>
    examQuestions.value.length > 0 &&
    examQuestions.value.every((q) => selectedExamQuestionIds.has(q.id))
);

function onToggleExamQuestion(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedExamQuestionIds.add(id);
  else selectedExamQuestionIds.delete(id);
}

function toggleSelectAllExamQuestions(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  examQuestions.value.forEach((q) =>
    c ? selectedExamQuestionIds.add(q.id) : selectedExamQuestionIds.delete(q.id)
  );
}

async function loadExamQuestions() {
  if (!props.examId) return;
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<QuestionLite>>("/questions", {
      params: { examId: props.examId, pageSize: 100 },
    });
    examQuestions.value = data.items || [];
    selectedExamQuestionIds.clear();
  } finally {
    loading.value = false;
  }
}

async function removeSelectedFromExam() {
  if (!props.examId || selectedExamQuestionIds.size === 0) return;
  if (
    !confirm(
      `Gỡ ${selectedExamQuestionIds.size} câu hỏi khỏi đề #${props.examId}?`
    )
  ) {
    return;
  }
  loading.value = true;
  try {
    for (const qid of Array.from(selectedExamQuestionIds)) {
      try {
        await api.delete(`/exams/${props.examId}/questions/${qid}`);
      } catch (e) {
        console.error(e);
      }
    }
    await loadExamQuestions();
  } finally {
    loading.value = false;
  }
}

// bank list via shared store
const qb = useQuestionBankStore();
const selectedBankIds = reactive(new Set<number>());
const allBankSelected = computed(
  () =>
    qb.filteredItems.length > 0 &&
    qb.filteredItems.every((q) => selectedBankIds.has(q.id))
);

function onToggleBank(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedBankIds.add(id);
  else selectedBankIds.delete(id);
}

function toggleSelectAllBank(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  qb.filteredItems.forEach((q) =>
    c ? selectedBankIds.add(q.id) : selectedBankIds.delete(q.id)
  );
}

const defaultAddPoints = ref(1);

async function addSelectedToExam() {
  if (!props.examId || selectedBankIds.size === 0) return;
  loading.value = true;
  try {
    const questionIds = Array.from(selectedBankIds);
    await qb.addToExam(props.examId, questionIds, defaultAddPoints.value);
    selectedBankIds.clear();
    await loadExamQuestions();
  } finally {
    loading.value = false;
  }
}

// watch examId to load questions
watch(
  () => props.examId,
  (val) => {
    if (val) {
      loadExamQuestions();
      qb.reload();
    } else {
      examQuestions.value = [];
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.examId) {
    loadExamQuestions();
    qb.reload();
  }
});

const pageSizeOptions = [10, 15, 20, 25, 30, 40, 50];
</script>

<style scoped>
.picker-scroll {
  max-height: 600px;
  overflow-y: auto;
}
</style>
