<template>
  <div class="app d-flex flex-column min-vh-100">
    <div class="app-body d-flex flex-grow-1">
      <AppSidebar
        :open="sidebarOpen"
        :collapsed="sidebarCollapsed"
        class="flex-shrink-0"
      />
      <!-- mobile overlay when sidebar is open -->
      <div
        v-if="sidebarOpen"
        class="app-overlay d-lg-none"
        @click="toggleSidebar"
      ></div>
      <main class="app-main flex-grow-1">
        <AppHeader
          :sidebar-open="sidebarOpen"
          :collapsed="sidebarCollapsed"
          @toggle-sidebar="toggleSidebar"
          @toggle-collapse="toggleCollapse"
        />
        <div class="p-0">
          <router-view />
        </div>
      </main>
    </div>
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
.app-body {
  gap: 0;
}

/* basic responsive sidebar */
.app-main {
  min-width: 0;
}
.app-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1035; /* below sidebar(1040), above header */
}
</style>
