<template>
  <div class="app app-shell">
    <AppSidebar
      :open="sidebarOpen"
      :collapsed="sidebarCollapsed"
      class="layout-sidebar flex-shrink-0"
    />

    <div
      class="app-main flex-grow-1"
      :class="{ 'is-collapsed': sidebarCollapsed || !sidebarOpen }"
    >
      <AppHeader
        :sidebar-open="sidebarOpen"
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-collapse="toggleCollapse"
      />

      <div class="app-content">
        <router-view />
      </div>

      <footer class="app-footer">
        © 2025 – Developed by &nbsp;<span style="color: blue"
          ><a
            style="text-decoration: none"
            target="_blank"
            href="https://miniweb.cloud"
            >miniweb.cloud</a
          ></span
        >
      </footer>
    </div>

    <!-- mobile overlay when sidebar is open -->
    <div
      v-if="sidebarOpen"
      class="app-overlay d-lg-none"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppHeader from "../components/Header.vue";
import AppSidebar from "../components/Sidebar.vue";

const sidebarOpen = ref(true);
const sidebarCollapsed = ref(false);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
function toggleCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

onMounted(() => {
  // Default collapsed on small screens
  if (window.matchMedia("(max-width: 992px)").matches) {
    sidebarOpen.value = false;
  }
});
</script>

<style scoped>
.app-shell {
  --sidebar-width: 260px;
  --footer-height: 50px;
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f5f7fa;
}

:deep(.layout-sidebar) {
  z-index: 1040;
}

@media (min-width: 992px) {
  :deep(.layout-sidebar) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--sidebar-width);
    overflow-y: auto;
  }
}

.app-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin-left: var(--sidebar-width);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.app-main.is-collapsed {
  margin-left: 0;
}

.app-content {
  flex: 1;
  overflow: auto;
  min-height: 0;
  /* padding: 1rem 1.25rem; */
}

.app-footer {
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  color: #6c757d;
  font-weight: 600;
  flex-shrink: 0;
}

.app-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1035; /* below sidebar(1040), above header */
}

@media (max-width: 992px) {
  .app-main {
    margin-left: 0;
    height: 100vh;
  }
}
</style>
