<template>
  <div class="max-w-md mx-auto mt-16 card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">{{ $t('auth.register') }}</h2>
      <form class="space-y-3" @submit.prevent="noop">
        <UiInput v-model="username" :label="$t('auth.username')" />
        <UiInput v-model="email" :label="$t('auth.email')" type="email" />
        <UiInput v-model="password" :label="$t('auth.password')" type="password" />
        <UiButton type="submit" class="w-full">{{ $t('auth.register') }}</UiButton>
      </form>
      <div class="text-sm">
        {{ $t('auth.haveAccount') }}
        <RouterLink class="link" :to="{ name: 'login' }">{{ $t('auth.login') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';

const username = ref('');
const email = ref('');
const password = ref('');
function noop() {}
</script>

