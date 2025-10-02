<template>
  <div class="max-w-md mx-auto mt-16 card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">{{ $t('auth.forgotPassword') }}</h2>
      <form class="space-y-3" @submit.prevent="noop">
        <UiInput v-model="email" :label="$t('auth.email')" type="email" />
        <UiButton type="submit" class="w-full">{{ $t('auth.resetPassword') }}</UiButton>
      </form>
      <div class="text-sm">
        <RouterLink class="link" :to="{ name: 'login' }">{{ $t('auth.backToLogin') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';

const email = ref('');
function noop() {}
</script>

