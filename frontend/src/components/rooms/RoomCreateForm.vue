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

      <!-- <label class="form-label">Lượt tối đa</label>
      <input
        type="number"
        min="1"
        class="form-control form-control-sm"
        v-model.number="localForm.maxAttempts"
      /> -->
      <div class="col-6 col-md-3">
        <label class="form-label">Mở lúc</label>
        <div class="input-group input-group-sm date-picker-wrap">
          <button
            type="button"
            class="btn btn-outline-secondary date-trigger"
            @click="openNativePicker('open')"
          >
            <i class="bi bi-calendar"></i>
          </button>
          <input
            ref="openNative"
            type="datetime-local"
            class="native-picker"
            v-model="localForm.openAt"
            lang="vi"
          />
          <input
            type="text"
            class="form-control"
            :value="fmtViDate(localForm.openAt)"
            readonly
            @click="openNativePicker('open')"
          />
        </div>
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label">Đóng lúc</label>
        <div class="input-group input-group-sm date-picker-wrap">
          <button
            type="button"
            class="btn btn-outline-secondary date-trigger"
            @click="openNativePicker('close')"
          >
            <i class="bi bi-calendar"></i>
          </button>
          <input
            ref="closeNative"
            type="datetime-local"
            class="native-picker"
            v-model="localForm.closeAt"
            lang="vi"
          />
          <input
            type="text"
            class="form-control"
            :value="fmtViDate(localForm.closeAt)"
            readonly
            @click="openNativePicker('close')"
          />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <label class="form-label">Bảo vệ phòng bằng mật khẩu</label>
        <div class="input-group input-group-sm">
          <div class="input-group-text">
            <input
              class="form-check-input mt-0"
              type="checkbox"
              v-model="localForm.requirePassword"
              aria-label="Toggle password protection"
            />
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập mật khẩu phòng (tùy chọn)"
            v-model="localForm.password"
            :disabled="!localForm.requirePassword"
          />
        </div>
      </div>
      <div class="col-12 col-md-3">
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
          <label class="form-check-label small" for="shuffleQ"> Câu hỏi </label>
        </div>
        <div class="form-check form-switch form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="shuffleC"
            v-model="localForm.shuffleChoices"
          />
          <label class="form-check-label small" for="shuffleC"> Đáp án </label>
        </div>
      </div>
    </div>

    <div class="row g-2 mt-1 align-items-end"></div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";

type RoomFormPayload = {
  openAt: string;
  closeAt: string;
  durationMinutes: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  requirePassword: boolean;
  password: string;
};

function calcCloseFrom(open: string): string {
  const dt = new Date(open);
  if (Number.isNaN(dt.getTime())) return "";
  dt.setDate(dt.getDate() + 1);
  return dt.toISOString().slice(0, 16);
}

const props = defineProps<{
  creating: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: RoomFormPayload): void;
}>();

const defaultForm: RoomFormPayload = {
  openAt: new Date().toISOString().slice(0, 16),
  closeAt: calcCloseFrom(new Date().toISOString().slice(0, 16)),
  durationMinutes: 30,
  shuffleQuestions: true,
  shuffleChoices: true,
  maxAttempts: 1,
  requirePassword: false,
  password: "",
};

const localForm = reactive<RoomFormPayload>({ ...defaultForm });
const openNative = ref<HTMLInputElement | null>(null);
const closeNative = ref<HTMLInputElement | null>(null);

function onSubmit() {
  emit("submit", { ...localForm });
}

function fmtViDate(value: string): string {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function openNativePicker(which: "open" | "close") {
  const target = which === "open" ? openNative.value : closeNative.value;
  target?.showPicker?.();
  target?.focus();
}

watch(
  () => props.creating,
  (v) => {
    if (!v) {
      Object.assign(localForm, { ...defaultForm });
    }
  }
);

watch(
  () => localForm.openAt,
  (v) => {
    const next = calcCloseFrom(v);
    if (next) {
      localForm.closeAt = next;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.form-check-input {
  cursor: pointer;
}
.input-group .form-control {
  min-width: 0;
}
.date-picker-wrap {
  position: relative;
  gap: 0;
}
.native-picker {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}
.date-trigger {
  /* padding: 0px 0px; */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.date-picker-wrap .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.date-picker-wrap .btn {
  border-color: var(--bs-border-color);
}
</style>
