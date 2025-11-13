<template>
  <div class="container" style="max-width: 720px">
    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h5 class="mb-0">Thông tin cá nhân</h5>
        <button class="btn btn-outline-secondary btn-sm" :disabled="loading" @click="load()">
          <i class="bi bi-arrow-repeat" :class="{ spin: loading }"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <input type="text" class="form-control" v-model.trim="form.fullName" placeholder="Nguyễn Văn A" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model.trim="form.email" placeholder="email@domain.com" />
          <div class="form-text">Có thể để trống đối với học viên.</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model.trim="form.password" placeholder="Để trống nếu không đổi" />
            <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" :disabled="saving" @click="save()">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            Lưu thay đổi
          </button>
          <button class="btn btn-light" :disabled="loading || saving" @click="load()">Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import api from '../api';
import { getUser, saveAuth } from '../utils/auth';

type Me = {
  id: number;
  fullName: string | null;
  email: string | null;
  role: string;
  userCode?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const loading = ref(false);
const saving = ref(false);
const showPassword = ref(false);
const form = reactive<{ fullName: string; email: string; password: string }>({
  fullName: '',
  email: '',
  password: '',
});

async function load() {
  loading.value = true;
  try {
    const res = await api.get<Me>('/me');
    const me = res.data as any as Me;
    form.fullName = me.fullName || '';
    form.email = me.email || '';
    form.password = '';
  } catch (e) {
    console.error(e);
    alert('Không tải được thông tin.');
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
    const res = await api.put<Me>('/me', body);
    const me = res.data as any as Me;
    // Update local storage user info for header display
    const current = getUser();
    saveAuth({ user: { ...(current || {}), fullName: me.fullName || '', email: me.email || undefined } });
    alert('Cập nhật thành công');
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message || 'Không thể cập nhật.';
    alert(msg);
  } finally {
    saving.value = false;
  }
}

onMounted(() => load());
</script>

<style scoped>
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
