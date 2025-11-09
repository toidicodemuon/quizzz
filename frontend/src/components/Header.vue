<template>
  <header
    class="app-header navbar navbar-light bg-white sticky-top shadow-sm border-bottom"
  >
    <div class="container-fluid d-flex align-items-center gap-2">
      <!-- Mobile hide/show toggle -->
      <button
        class="btn btn-outline-secondary d-lg-none"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <i class="bi bi-arrow-bar-right"></i>
      </button>

      <!-- Desktop collapse toggle -->
      <button
        class="btn btn-outline-secondary d-none d-lg-inline-flex"
        @click="$emit('toggle-collapse')"
        aria-label="Collapse sidebar"
      >
        <i
          class="bi"
          :class="collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'"
        ></i>
      </button>

      <!-- Marquee / announce -->
      <div class="announce flex-grow-1 d-none d-md-flex align-items-center">
        <i class="bi bi-bell text-muted me-2"></i>
        <div class="announce-track">
          <div class="announce-text">{{ announceText }}</div>
        </div>
      </div>

      <!-- Right side: App name and greeting -->
      <div class="ms-auto d-flex align-items-center gap-3">
        <span class="text-muted"
          >Xin chào, <strong>{{ displayName }}</strong></span
        >
        <span class="badge bg-secondary" v-if="role">{{ role }}</span>
        <button
          class="btn btn-sm btn-outline-secondary"
          title="Đăng xuất"
          @click="onLogout"
        >
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getRole, logout, getUser } from "../utils/auth";

defineOptions({ name: "AppHeader" });

const props = defineProps<{ sidebarOpen?: boolean; collapsed?: boolean }>();

const router = useRouter();
const role = computed(() => getRole());
const displayName = computed(() => {
  const u = getUser();
  return (u?.fullName || u?.username || u?.email || "Người dùng") as string;
});
const announceText =
  import.meta.env.VITE_APP_ANNOUNCE || "Chào mừng đến với TIN HỌC ANH THƯ!";
const collapsed = computed(() => !!props.collapsed);

function onLogout() {
  logout();
  router.push({ name: "login" });
}
</script>

<style scoped>
.app-header {
  z-index: 1030;
}
.announce {
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 6px 10px;
  min-height: 38px;
}
.announce-track {
  overflow: hidden;
  position: relative;
  flex: 1;
}
.announce-text {
  white-space: nowrap;
  position: relative;
  display: inline-block;
  animation: marquee 12s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
