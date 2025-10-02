<template>
  <div class="drawer lg:drawer-open min-h-screen">
    <input id="app-drawer" type="checkbox" class="drawer-toggle" :checked="sidebarOpen" @change="onDrawerChange" />
    <div class="drawer-content flex flex-col">
      <header class="navbar bg-base-100 sticky top-0 z-20 border-b">
        <div class="flex-none lg:hidden">
          <label for="app-drawer" class="btn btn-ghost btn-square" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </label>
        </div>
        <div class="flex-1 px-2 text-lg font-semibold">{{ $t('app.title') }}</div>
        <div class="flex-none gap-2 pr-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <button class="btn btn-outline btn-sm" @click="onLogout">{{ $t('auth.logout') }}</button>
        </div>
      </header>
      <main class="p-6 max-w-7xl w-full mx-auto">
        <RouterView />
      </main>
    </div>
    <div class="drawer-side">
      <label for="app-drawer" class="drawer-overlay"></label>
      <aside class="menu p-4 w-72 bg-base-200 min-h-full">
        <div class="text-xl font-bold mb-4">Admin</div>
        <RouterLink class="menu-item btn btn-ghost justify-start w-full" to="/admin/users">{{ $t('nav.users') }}</RouterLink>
        <RouterLink class="menu-item btn btn-ghost justify-start w-full" to="/admin/quizzes">{{ $t('nav.quizzes') }}</RouterLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import { useAuthStore } from '@/modules/auth/stores/auth';
import { useRouter } from 'vue-router';
import { useUi } from '@/composables/useUi';

const auth = useAuthStore();
const router = useRouter();
const { sidebarOpen, toggleSidebar, setSidebar } = useUi();

function onLogout() {
  auth.logout();
  router.push({ name: 'login' });
}

function onDrawerChange(e: Event) {
  setSidebar((e.target as HTMLInputElement).checked);
}
</script>
