<template>
  <div
    class="modal fade show"
    v-if="show"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Xem câu hỏi
            <span v-if="viewQuestion">#{{ viewQuestion.id }}</span>
          </h5>
          <button type="button" class="btn-close" @click="onClose"></button>
        </div>
        <div class="modal-body">
          <div v-if="!viewQuestion" class="text-center text-muted">
            Đang tải...
          </div>
          <div v-else>
            <div class="mb-3">
              <div class="fw-semibold mb-1">Nội dung</div>
              <div class="rich-content" v-html="renderHtml(viewQuestion.text)"></div>
            </div>
            <div class="mb-3" v-if="viewQuestion.explanation">
              <div class="fw-semibold mb-1">Giải thích</div>
              <div class="rich-content" v-html="renderHtml(viewQuestion.explanation)"></div>
            </div>
            <div class="mb-3" v-if="viewQuestion.choices?.length">
              <div class="fw-semibold mb-2">Đáp án</div>
              <ul class="list-group">
                <li
                  v-for="c in viewQuestion.choices"
                  :key="c.id"
                  class="list-group-item d-flex align-items-center"
                >
                  <i
                    v-if="c.isCorrect"
                    class="bi bi-check-circle-fill text-success me-2"
                  ></i>
                  <i v-else class="bi bi-circle me-2 text-muted"></i>
                  <div class="rich-content" v-html="renderHtml(c.content)"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="onClose">Đóng</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import api from "../../api";
import { sanitizeHtml } from "../../utils/richText";

const props = defineProps<{
  show: boolean;
  questionId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const viewQuestion = ref<null | {
  id: number;
  text: string;
  explanation: string | null;
  type?: string;
  locked?: boolean;
  choices?: Array<{ id: number; content: string; isCorrect: boolean }>;
}>(null);

const renderHtml = (value?: string | null) => sanitizeHtml(value || "");

function onClose() {
  emit("close");
}

async function loadQuestion() {
  if (!props.questionId) return;
  viewQuestion.value = null;
  try {
    const { data } = await api.get(`/questions/${props.questionId}`);
    viewQuestion.value = data;
  } catch (e: any) {
    alert(e?.message || "Không thể xem câu hỏi");
    emit("close");
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      loadQuestion();
    }
  }
);
</script>
