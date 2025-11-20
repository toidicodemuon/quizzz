<template>
  <form @submit.prevent="onSubmit">
    <div class="row g-2">
      <div class="col-12 col-md-4">
        <label class="form-label">Mã phòng (tùy chọn)</label>
        <input
          v-model.trim="localForm.code"
          class="form-control form-control-sm"
          placeholder="Để trống để hệ thống tự tạo"
        />
        <div class="form-text">
          Sinh viên sẽ dùng mã này để vào phòng.
        </div>
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label">Mở lúc</label>
        <input
          type="datetime-local"
          class="form-control form-control-sm"
          v-model="localForm.openAt"
        />
        <div class="form-text">Để trống nếu muốn mở ngay.</div>
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label">Đóng lúc</label>
        <input
          type="datetime-local"
          class="form-control form-control-sm"
          v-model="localForm.closeAt"
        />
        <div class="form-text">
          Sau thời điểm này sinh viên không thể vào phòng.
        </div>
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label">Thời lượng mỗi sinh viên (phút)</label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm"
          v-model.number="localForm.durationMinutes"
          placeholder="Ví dụ: 30"
        />
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label">Số lượt làm bài tối đa</label>
        <input
          type="number"
          min="1"
          class="form-control form-control-sm"
          v-model.number="localForm.maxAttempts"
        />
      </div>
      <div class="col-12 col-md-4">
        <label class="form-label d-block">Thiết lập xáo trộn</label>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="shuffleQ"
            v-model="localForm.shuffleQuestions"
          />
          <label class="form-check-label" for="shuffleQ">
            Xáo thứ tự câu hỏi
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="shuffleC"
            v-model="localForm.shuffleChoices"
          />
          <label class="form-check-label" for="shuffleC">
            Xáo thứ tự đáp án
          </label>
        </div>
      </div>
    </div>

    <div class="mt-3 text-end">
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
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

type RoomFormPayload = {
  code: string;
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
  code: "",
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

<style scoped></style>
