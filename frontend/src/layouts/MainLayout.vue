<template>
  <div class="app d-flex flex-column min-vh-100">
    <AppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <div class="app-body d-flex flex-grow-1">
      <AppSidebar :open="sidebarOpen" class="flex-shrink-0" />
      <main class="app-main flex-grow-1 p-3 p-md-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "../components/Header.vue";
import AppSidebar from "../components/Sidebar.vue";

const sidebarOpen = ref(true);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
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
</style>
