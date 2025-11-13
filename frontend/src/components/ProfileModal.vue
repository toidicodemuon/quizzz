<template>
  <div v-if="open" class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title mb-0">Thông tin cá nhân</h6>
          <button
            type="button"
            class="btn-close"
            @click="emit('update:open', false)"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Họ và tên</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="form.fullName"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập</label>
            <input type="text" class="form-control" v-model="form.userCode" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model.trim="form.email"
              placeholder="email@domain.com"
            />
            <div class="form-text">Có thể để trống đối với học viên.</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu mới</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model.trim="form.password"
                placeholder="Để trống nếu không đổi"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showPassword = !showPassword"
              >
                <i
                  class="bi"
                  :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                ></i>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-light"
            type="button"
            @click="emit('update:open', false)"
          >
            Đóng
          </button>
          <button class="btn btn-primary" :disabled="saving" @click="save()">
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import api from "../api";
import { getUser, saveAuth } from "../utils/auth";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "update:open", v: boolean): void }>();

const loading = ref(false);
const saving = ref(false);
const showPassword = ref(false);
const form = reactive<{ fullName: string; email: string; userCode: string; password: string }>({
  fullName: "",
  email: "",
  userCode: "",
  password: "",
});

async function load() {
  loading.value = true;
  try {
    const res = await api.get("/me");
    const me: any = res.data;
    form.fullName = me?.fullName || "";
    form.email = me?.email || "";
    form.password = "";
    form.userCode = me?.userCode || "";
  } catch (e) {
    console.error(e);
    alert("Không tải được thông tin.");
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (saving.value) return;
  saving.value = true;
  try {
    const body: any = {
      fullName: form.fullName || null,
      email: form.email || null,
    };
    if (form.password) body.password = form.password;
    const res = await api.put("/me", body);
    const me: any = res.data;
    const current = getUser();
    saveAuth({
      user: {
        ...(current || {}),
        fullName: me.fullName || "",
        email: me.email || undefined,
      },
    });
    alert("Cập nhật thành công");
    emit("update:open", false);
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || "Không thể cập nhật.";
    alert(msg);
  } finally {
    saving.value = false;
  }
}

watch(
  () => props.open,
  (v) => {
    if (v) load();
  }
);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-dialog {
  max-width: 520px;
  width: 100%;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 1rem;
}
.modal-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
}
</style>
