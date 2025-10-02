<template>
  <div class="max-w-md mx-auto mt-16 card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">{{ $t('auth.login') }}</h2>
      <form class="space-y-3" @submit.prevent="onSubmit">
        <UiInput v-model="username" :label="$t('auth.username')" placeholder="username" />
        <UiInput v-model="password" :label="$t('auth.password')" type="password" placeholder="••••••••" />
        <div class="flex items-center justify-between">
          <RouterLink class="link" :to="{ name: 'forgot-password' }">{{ $t('auth.forgotPassword') }}</RouterLink>
        </div>
        <UiButton type="submit" class="w-full" :loading="loading">{{ $t('auth.login') }}</UiButton>
      </form>
      <div class="text-sm">
        {{ $t('auth.noAccount') }}
        <RouterLink class="link" :to="{ name: 'register' }">{{ $t('auth.register') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useAuthStore } from '@/modules/auth/stores/auth';

const username = ref('');
const password = ref('');
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function onSubmit() {
  loading.value = true;
  try {
    await auth.login({ username: username.value, password: password.value });
    const role = auth.user?.role;
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'TEACHER') router.push('/teacher/dashboard');
    else router.push('/student/dashboard');
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Login failed');
  } finally {
    loading.value = false;
  }
}
</script>

