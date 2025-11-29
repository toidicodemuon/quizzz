<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="container" style="max-width: 480px">
      <div class="card shadow-sm border-0">
        <div class="card-body p-4 p-md-5">
          <h1 class="h4 mb-3 text-center">Đăng nhập</h1>

          <form @submit.prevent="onSubmit" novalidate>
            <div class="mb-3">
              <label class="form-label" for="userCode">Mã số</label>
              <input
                v-model.trim="userCode"
                type="text"
                class="form-control"
                id="userCode"
                placeholder="VD: SV20240001"
                required
                :disabled="loading"
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="password">Mật khẩu</label>
              <input
                v-model.trim="password"
                type="password"
                class="form-control"
                id="password"
                placeholder="••••••"
                required
                minlength="4"
                :disabled="loading"
              />
            </div>

            <div v-if="error" class="alert alert-danger py-2" role="alert">
              {{ error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
            </button>
          </form>

          <p v-if="success" class="text-success text-center mt-3 small">
            Đăng nhập thành công! Chuyển hướng...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { saveAuth, getRole } from "../utils/auth";

const router = useRouter();
const userCode = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const apiBase = computed(
  () => import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
);

async function onSubmit() {
  error.value = "";
  success.value = false;

  if (!userCode.value || !password.value) {
    error.value = "Vui lòng nhập mã số và mật khẩu.";
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${apiBase.value}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: userCode.value,
        password: password.value,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Đăng nhập thất bại");
    }

    saveAuth(data);
    success.value = true;

    // redirect by role after a short delay
    setTimeout(() => {
      const role = getRole();
      if (role === "TEACHER") router.push({ name: "teacher-dashboard" });
      else if (role === "STUDENT") router.push({ name: "student-dashboard" });
      else if (role === "ADMIN") router.push({ name: "admin-users" });
      else router.push("/");
    }, 300);
  } catch (e: any) {
    error.value = e?.message || "Có lỗi xảy ra.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
