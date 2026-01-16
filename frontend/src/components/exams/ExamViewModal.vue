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
          <h5 class="modal-title">Xem đề thi #{{ exam?.id }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center text-muted">Đang tải...</div>
          <div v-else-if="!exam" class="text-center text-muted">
            Không tìm thấy đề thi
          </div>
          <div v-else>
            <div class="mb-3">
              <div class="row g-2">
                <div class="col-12 col-md-8">
                  <div class="fw-bold">{{ exam.title }}</div>
                  <div class="text-muted" v-if="exam.description">
                    {{ exam.description }}
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div>
                    Mã đề: <code>{{ exam.code || "-" }}</code>
                  </div>
                  <div>
                    Trạng thái:
                    <span
                      class="badge"
                      :class="
                        exam.status === 'PUBLISHED'
                          ? 'bg-success'
                          : exam.status === 'ARCHIVED'
                          ? 'bg-danger'
                          : 'bg-warning'
                      "
                    >
                      {{ exam.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-2 mb-3 small text-muted">
              <div class="col-6 col-md-3">
                Tổng điểm: {{ exam.totalPoints ?? "-" }}
              </div>
              <div class="col-6 col-md-3">
                Điểm đậu: {{ exam.passMarkPercent ?? "-" }}%
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Loại đề: {{ exam.examType || "PRACTICE" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Chấm điểm: {{ exam.scoringMode || "STANDARD" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Feedback: {{ exam.feedbackMode || "DETAILED" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Hiển thị điểm ngay:
                {{ exam.showScoreImmediately ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Hiển thị đáp án:
                {{ exam.showCorrectAnswers ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Hiển thị giải thích:
                {{ exam.showExplanation ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3" v-if="false">
                Xem lại (phút): {{ exam.reviewWindowMin ?? "-" }}
              </div>
            </div>

            <div class="table-responsive border rounded">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-uppercase text-muted small">
                    <th style="width: 70px">STT</th>
                    <th class="d-none d-sm-table-cell">ID</th>
                    <th>Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(q, idx) in questions" :key="q.id">
                    <td class="text-muted">{{ idx + 1 }}</td>
                    <td class="d-none d-sm-table-cell fw-semibold">
                      #{{ q.id }}
                    </td>
                    <td>
                      <div
                        class="fw-semibold mb-1 rich-content"
                        v-html="renderHtml(q.text)"
                      ></div>
                      <ul class="mb-1 ms-3">
                        <li
                          v-for="ch in choices[q.id] || []"
                          :key="ch.id"
                          :class="
                            ch.isCorrect ? 'text-success fw-semibold' : ''
                          "
                        >
                          <span
                            class="rich-content"
                            v-html="renderHtml(ch.content)"
                          ></span>
                          <span
                            v-if="ch.isCorrect"
                            class="badge bg-success ms-1"
                          >
                            Đáp án đúng
                          </span>
                        </li>
                      </ul>
                      <div
                        class="text-muted small rich-content"
                        v-if="q.explanation"
                        v-html="renderHtml(q.explanation)"
                      ></div>
                    </td>
                  </tr>
                  <tr v-if="questions.length === 0">
                    <td colspan="3" class="text-center text-muted">
                      Chưa có câu hỏi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="close">Đóng</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import api, { type Paginated } from "../../api";

type QuestionLite = { id: number; text: string; explanation: string | null };

const props = defineProps<{
  show: boolean;
  examId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const loading = ref(false);
const exam = ref<any | null>(null);
const questions = ref<QuestionLite[]>([]);
const choices = ref<
  Record<number, { id: number; content: string; isCorrect: boolean }[]>
>({});

const renderHtml = (value?: string | null) => value || "";

async function loadData() {
  if (!props.show || !props.examId) return;
  loading.value = true;
  exam.value = null;
  questions.value = [];
  choices.value = {};
  try {
    const [{ data: ex }, { data: qres }] = await Promise.all([
      api.get(`/exams/${props.examId}`),
      api.get<any>(`/questions`, {
        params: { examId: props.examId, pageSize: 500, includeChoices: true },
      }),
    ]);
    exam.value = ex;
    const items = Array.isArray(qres?.items) ? qres.items : [];
    const map: Record<
      number,
      { id: number; content: string; isCorrect: boolean }[]
    > = {};
    questions.value = items.map((q: any) => {
      if (Array.isArray(q.choices)) {
        map[q.id] = q.choices.map((c: any) => ({
          id: c.id,
          content: c.content,
          isCorrect: !!c.isCorrect,
        }));
      }
      return {
        id: q.id,
        text: q.text,
        explanation: q.explanation ?? null,
      };
    });
    choices.value = map;
  } catch (err: any) {
    alert(err?.message || "Không thể tải đề thi");
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.show, props.examId] as const,
  () => {
    loadData();
  },
  { immediate: true }
);

function close() {
  emit("close");
}
</script>
