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
          <h5 class="modal-title">Sửa câu hỏi #{{ editForm.id }}</h5>
          <button class="btn-close" @click="onClose"></button>
        </div>
        <div class="modal-body">
          <div
            v-if="editLocked"
            class="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <i class="bi bi-lock-fill me-2"></i>
            Không thể sửa đáp án và câu hỏi đang thuộc đề thi đã xuất bản và đã
            có lượt thi. Bạn vẫn có thể sửa nội dung và giải thích.
          </div>
          <div class="d-flex justify-content-end mb-2">
            <div
              class="btn-group btn-group-sm"
              role="group"
              aria-label="Editor mode"
            >
              <button
                type="button"
                class="btn"
                :class="showHtml ? 'btn-outline-primary' : 'btn-primary'"
                @click="showHtml = false"
              >
                Preview
              </button>
              <button
                type="button"
                class="btn"
                :class="showHtml ? 'btn-primary' : 'btn-outline-primary'"
                @click="showHtml = true"
              >
                HTML
              </button>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Nội dung</label>
            <RichTextEditor v-if="!showHtml" v-model="editForm.text" />
            <textarea
              v-else
              v-model="editForm.text"
              class="form-control font-monospace"
              rows="4"
              spellcheck="false"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Giải thích</label>
            <RichTextEditor
              v-if="!showHtml"
              v-model="editForm.explanation"
              :compact="true"
              min-height="90px"
            />
            <textarea
              v-else
              v-model="editForm.explanation"
              class="form-control form-control-sm font-monospace"
              rows="3"
              spellcheck="false"
            ></textarea>
          </div>
          <div class="mt-4">
            <div class="fw-semibold mb-2">Đáp án</div>
            <template v-if="!editLocked && editType !== 'TEXT'">
              <ul class="list-group">
                <li
                  v-for="(c, idx) in editChoices"
                  :key="c.id ?? 'new-' + idx"
                  class="list-group-item"
                >
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="form-check me-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :checked="!!c.isCorrect"
                        @change="(e) => onToggleEditCorrect(idx, e)"
                      />
                    </div>
                    <RichTextEditor
                      v-if="!showHtml"
                      v-model="c.content"
                      :compact="true"
                      min-height="70px"
                      :placeholder="`Đáp án #${idx + 1}`"
                    />
                    <textarea
                      v-else
                      v-model="c.content"
                      class="form-control form-control-sm font-monospace flex-grow-1"
                      rows="3"
                      spellcheck="false"
                      :placeholder="`Đáp án #${idx + 1}`"
                    ></textarea>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-secondary"
                        @click="moveEditChoice(idx, -1)"
                        :disabled="idx === 0"
                      >
                        ↑
                      </button>
                      <button
                        class="btn btn-outline-secondary"
                        @click="moveEditChoice(idx, 1)"
                        :disabled="idx === editChoices.length - 1"
                      >
                        ↓
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        @click="removeEditChoice(idx)"
                        :disabled="editChoices.length <= 2"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="mt-2">
                <button class="btn btn-light btn-sm" @click="addEditChoice">
                  <i class="bi bi-plus-circle me-1"></i> Thêm đáp án
                </button>
              </div>
            </template>
            <template v-else>
              <ul class="list-group">
                <li
                  v-for="c in editChoices"
                  :key="c.id"
                  class="list-group-item d-flex align-items-center flex-wrap"
                >
                  <i
                    v-if="c.isCorrect"
                    class="bi bi-check-circle-fill text-success me-2"
                  ></i>
                  <i v-else class="bi bi-circle me-2 text-muted"></i>
                  <div v-if="!showHtml" class="rich-content" v-html="renderHtml(c.content)"></div>
                  <textarea
                    v-else
                    class="form-control form-control-sm font-monospace w-100 mt-2"
                    rows="3"
                    readonly
                    spellcheck="false"
                    :value="c.content || ''"
                  ></textarea>
                </li>
              </ul>
            </template>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="onClose">Đóng</button>
          <button
            class="btn btn-primary"
            :disabled="saving || !canSubmitEdit"
            @click="submitEdit"
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
import { hasRichContent, sanitizeHtml } from "../../utils/richText";
import RichTextEditor from "../common/RichTextEditor.vue";

const props = defineProps<{
  show: boolean;
  questionId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated"): void;
}>();

const saving = ref(false);
const showHtml = ref(false);
const editForm = reactive<{
  id: number;
  text: string;
  explanation: string | null;
}>({ id: 0, text: "", explanation: null });
const editType = ref<"SC" | "MC" | "TEXT">("SC");
const editLocked = ref(false);
type EditChoice = {
  id?: number;
  content: string;
  isCorrect: boolean;
  order?: number;
};
const editChoices = ref<Array<EditChoice>>([]);
let originalChoices: Array<EditChoice> = [];

const renderHtml = (value?: string | null) => sanitizeHtml(value || "");

function onClose() {
  emit("close");
}

async function loadQuestion() {
  if (!props.questionId) return;
  try {
    const { data } = await api.get(`/questions/${props.questionId}`);
    editForm.id = data.id;
    editForm.text = data.text;
    editForm.explanation = data.explanation ?? null;
    editType.value = (data.type || "SC") as any;
    editLocked.value = !!data.locked;
    editChoices.value = (data.choices || [])
      .slice()
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((c: any) => ({
        id: c.id,
        content: c.content,
        isCorrect: !!c.isCorrect,
        order: c.order,
      }));
    originalChoices = editChoices.value.map((c) => ({ ...c }));
  } catch (e: any) {
    alert(e?.message || "Không thể mở form sửa");
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

function addEditChoice() {
  editChoices.value.push({ content: "", isCorrect: false });
}

function removeEditChoice(i: number) {
  editChoices.value.splice(i, 1);
}

function moveEditChoice(i: number, delta: number) {
  const j = i + delta;
  if (j < 0 || j >= editChoices.value.length) return;
  const arr = editChoices.value;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function onToggleEditCorrect(idx: number, e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  if (editType.value === "SC") {
    editChoices.value.forEach(
      (c, i) => (c.isCorrect = i === idx ? checked : false)
    );
  } else {
    editChoices.value[idx].isCorrect = checked;
  }
}

const canSubmitEdit = computed(() => {
  const hasText = hasRichContent(editForm.text);
  if (!hasText) return false;
  if (editType.value === "TEXT") return true;
  if (editLocked.value) return true; // choices locked; allow saving text/explanation only
  const nonEmpty = editChoices.value.some((c) => hasRichContent(c.content));
  const anyCorrect = editChoices.value.some((c) => !!c.isCorrect);
  return nonEmpty && anyCorrect;
});

async function submitEdit() {
  saving.value = true;
  try {
    await api.put(`/questions/${editForm.id}`, {
      text: editForm.text,
      explanation: hasRichContent(editForm.explanation)
        ? editForm.explanation
        : null,
    });
    if (!editLocked.value && editType.value !== "TEXT") {
      const current = editChoices.value.map((c, idx) => ({ ...c, order: idx }));
      const origMap = new Map<number, EditChoice>();
      originalChoices.forEach((c) => {
        if (typeof c.id === "number") origMap.set(c.id, c);
      });
      const currMap = new Map<number, EditChoice>();
      current.forEach((c: any) => {
        if (typeof c.id === "number") currMap.set(c.id, c);
      });
      const toDelete = originalChoices
        .filter((c) => typeof c.id === "number" && !currMap.has(c.id!))
        .map((c) => c.id!) as number[];
      for (const id of toDelete) {
        try {
          await api.delete(`/choices/${id}`);
        } catch (e) {
          console.log(e);
        }
      }
      for (const [id, curr] of currMap) {
        const prev = origMap.get(id)!;
        if (
          prev.content !== curr.content ||
          !!prev.isCorrect !== !!curr.isCorrect ||
          (prev.order ?? 0) !== (curr.order ?? 0)
        ) {
          await api.put(`/choices/${id}`, {
            content: curr.content,
            isCorrect: !!curr.isCorrect,
            order: curr.order ?? 0,
          });
        }
      }
      const toCreate = current.filter(
        (c) => typeof c.id !== "number" && hasRichContent(c.content)
      );
      for (const c of toCreate) {
        await api.post(`/choices`, {
          questionId: editForm.id,
          content: c.content,
          isCorrect: !!c.isCorrect,
          order: c.order ?? 0,
        });
      }
    }
    emit("updated");
    emit("close");
  } catch (e: any) {
    alert(e?.message || "Không thể cập nhật");
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
