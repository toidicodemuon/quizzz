<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-base-200 p-4 space-y-2">
      <div class="text-xl font-bold mb-4">Teacher</div>
      <RouterLink class="btn btn-ghost justify-start w-full" to="/teacher/dashboard">{{ $t('nav.dashboard') }}</RouterLink>
      <RouterLink class="btn btn-ghost justify-start w-full" to="/teacher/quizzes">{{ $t('nav.quizzes') }}</RouterLink>
      <RouterLink class="btn btn-ghost justify-start w-full" to="/teacher/submissions">{{ $t('nav.submissions') }}</RouterLink>
    </aside>
    <div class="flex-1 flex flex-col">
      <header class="navbar bg-base-100 border-b">
        <div class="flex-1 px-2 text-lg font-semibold">{{ $t('app.title') }}</div>
        <div class="flex-none gap-2 pr-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <button class="btn btn-outline btn-sm" @click="onLogout">{{ $t('auth.logout') }}</button>
        </div>
      </header>
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import { useAuthStore } from '@/modules/auth/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function onLogout() {
  auth.logout();
  router.push({ name: 'login' });
}
</script>

