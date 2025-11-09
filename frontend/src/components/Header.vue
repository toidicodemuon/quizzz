<template>
  <header class="app-header navbar navbar-light bg-light sticky-top shadow-sm">
    <div class="container-fluid">
      <button
        class="btn btn-outline-secondary d-lg-none me-2"
        @click="$emit('toggle-sidebar')"
      >
        ☰
      </button>
      <a class="navbar-brand me-auto" href="#/">Quizzz</a>

      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-secondary" v-if="role">{{ role }}</span>
        <button class="btn btn-sm btn-outline-danger" @click="onLogout">
          Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getRole, logout } from "../utils/auth";

defineProps({ sidebarOpen: { type: Boolean, default: true } });

const router = useRouter();
const role = computed(() => getRole());

function onLogout() {
  logout();
  router.push({ name: "login" });
}
</script>

<style scoped>
.app-header {
  z-index: 1030;
}
</style>
