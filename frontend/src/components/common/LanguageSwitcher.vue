<template>
  <select class="select select-bordered select-sm" :value="locale" @change="onChange">
    <option value="en">EN</option>
    <option value="vi">VI</option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/modules/auth/stores/auth';

const { locale } = useI18n();
const auth = useAuthStore();

function onChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as 'en' | 'vi';
  locale.value = value;
  auth.setLanguage(value);
}
</script>

