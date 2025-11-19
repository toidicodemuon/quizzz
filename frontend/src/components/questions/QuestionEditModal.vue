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
          <div class="mb-3">
            <label class="form-label">Nội dung</label>
            <textarea
              v-model.trim="editForm.text"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Giải thích</label>
            <textarea
              v-model.trim="editForm.explanation"
              class="form-control"
              rows="2"
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
                    <input
                      v-model="c.content"
                      type="text"
                      class="form-control flex-grow-1"
                      placeholder="Nội dung đáp án"
                      style="min-width: 220px"
                    />
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
                  class="list-group-item d-flex align-items-center"
                >
                  <i
                    v-if="c.isCorrect"
                    class="bi bi-check-circle-fill text-success me-2"
                  ></i>
                  <i v-else class="bi bi-circle me-2 text-muted"></i>
                  <span>{{ c.content }}</span>
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

const props = defineProps<{
  show: boolean;
  questionId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated"): void;
}>();

const saving = ref(false);
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
  const hasText = editForm.text.trim().length > 0;
  if (!hasText) return false;
  if (editType.value === "TEXT") return true;
  if (editLocked.value) return true; // choices locked; allow saving text/explanation only
  const nonEmpty = editChoices.value.some((c) => c.content && c.content.trim());
  const anyCorrect = editChoices.value.some((c) => !!c.isCorrect);
  return nonEmpty && anyCorrect;
});

async function submitEdit() {
  saving.value = true;
  try {
    await api.put(`/questions/${editForm.id}`, {
      text: editForm.text,
      explanation: editForm.explanation,
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
        (c) => typeof c.id !== "number" && c.content && c.content.trim()
      );
      for (const c of toCreate) {
        await api.post(`/choices`, {
          questionId: editForm.id,
          content: c.content.trim(),
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
