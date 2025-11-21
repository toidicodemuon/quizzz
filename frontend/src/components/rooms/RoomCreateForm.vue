<template>
  <form @submit.prevent="onSubmit">
    <div class="row g-2 align-items-end">
      <div class="col-12 col-md-3">
        <label class="form-label">Thời lượng (phút)</label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm"
          v-model.number="localForm.durationMinutes"
          placeholder="Ví dụ: 30"
        />
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label">Lượt tối đa</label>
        <input
          type="number"
          min="1"
          class="form-control form-control-sm"
          v-model.number="localForm.maxAttempts"
        />
      </div>
      <div class="col-12 col-md-6">
        <label class="form-label d-block">Xáo trộn</label>
        <div class="d-flex flex-wrap gap-2">
          <div class="form-check form-switch form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="shuffleQ"
              v-model="localForm.shuffleQuestions"
            />
            <label class="form-check-label small" for="shuffleQ">
              Câu hỏi
            </label>
          </div>
          <div class="form-check form-switch form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="shuffleC"
              v-model="localForm.shuffleChoices"
            />
            <label class="form-check-label small" for="shuffleC">
              Đáp án
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-2 mt-1 align-items-end">
      <div class="col-6 col-md-4">
        <label class="form-label">Mở lúc</label>
        <input
          type="datetime-local"
          class="form-control form-control-sm"
          v-model="localForm.openAt"
        />
      </div>
      <div class="col-6 col-md-4">
        <label class="form-label">Đóng lúc</label>
        <input
          type="datetime-local"
          class="form-control form-control-sm"
          v-model="localForm.closeAt"
        />
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label">&nbsp;</label>
        <br />
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          :disabled="creating"
        >
          <span
            v-if="creating"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Mở phòng thi
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

type RoomFormPayload = {
  openAt: string;
  closeAt: string;
  durationMinutes: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
};

const props = defineProps<{
  creating: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: RoomFormPayload): void;
}>();

const defaultForm: RoomFormPayload = {
  openAt: "",
  closeAt: "",
  durationMinutes: 30,
  shuffleQuestions: true,
  shuffleChoices: true,
  maxAttempts: 1,
};

const localForm = reactive<RoomFormPayload>({ ...defaultForm });

function onSubmit() {
  emit("submit", { ...localForm });
}

watch(
  () => props.creating,
  (v) => {
    if (!v) {
      Object.assign(localForm, { ...defaultForm });
    }
  }
);
</script>

<style scoped>
.form-check-input {
  cursor: pointer;
}
</style>
