<template>
  <div>
    <div v-for="(ans, idx) in answers" :key="ans.questionId" class="mb-3">
      <div class="d-flex align-items-center gap-2">
        <span class="badge" :class="ans.isCorrect ? 'bg-success' : 'bg-danger'">
          {{ ans.isCorrect ? "Đúng" : "Sai" }}
        </span>
        <strong class="me-2">Câu {{ idx + 1 }}:</strong>
        <span class="rich-content" v-html="renderHtml(ans.questionText)"></span>
      </div>
      <ul class="list-group list-group-flush ms-4 mt-2">
        <li
          v-for="ch in ans.choices"
          :key="ch.id"
          class="list-group-item py-1 d-flex align-items-center gap-2"
          :class="
            ch.selected
              ? ch.isCorrect
                ? 'bg-success-subtle'
                : 'bg-danger-subtle'
              : ''
          "
        >
          <i
            :class="[
              'bi',
              ch.selected
                ? ch.isCorrect
                  ? 'bi-check-circle-fill text-success'
                  : 'bi-x-circle-fill text-danger'
                : ch.isCorrect
                ? 'bi-check-circle text-success'
                : 'bi-circle text-muted',
            ]"
          />
          <span
            :class="
              ch.selected ? (ch.isCorrect ? 'text-success' : 'text-danger') : ''
            "
          >
            <span class="rich-content" v-html="renderHtml(ch.content)"></span>
          </span>
        </li>
        <li
          v-if="!(ans.choices || []).some((c) => c.selected)"
          class="list-group-item py-1 d-flex align-items-center gap-2 bg-danger-subtle text-danger"
        >
          <i class="bi bi-x-circle-fill"></i>
          <span>Không chọn</span>
        </li>
      </ul>
      <div class="small ms-4 mt-1">
        Điểm:
        <strong :class="ans.isCorrect ? 'text-success' : 'text-danger'">
          {{ ans.earned ?? 0 }}
        </strong>
        / {{ ans.points ?? 1 }}
      </div>
      <div
        v-if="(showExplanation ?? true) && ans.explanation"
        class="small ms-4 mt-1 text-muted"
      >
        <strong>Giải thích:</strong>
        <span class="ms-1"><span class="rich-content" v-html="renderHtml(ans.explanation)"></span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "AttemptAnswersList" });

const renderHtml = (value?: string | null) => value || "";

export type AttemptAnswerView = {
  questionId: number;
  questionText: string;
  isCorrect: boolean | null;
  earned: number | null;
  points: number | null;
  explanation?: string | null;
  choices: Array<{
    id: number;
    content: string;
    isCorrect: boolean;
    selected: boolean;
  }>;
};

const { answers, showExplanation } = defineProps<{
  answers: AttemptAnswerView[];
  showExplanation?: boolean;
}>();
</script>

<style scoped></style>
