<template>
  <button class="btn btn-ghost btn-sm" @click="toggle">
    <span v-if="theme === 'light'">🌞</span>
    <span v-else>🌜</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/auth';

const auth = useAuthStore();
const theme = computed(() => auth.theme);

function toggle() {
  auth.setTheme(theme.value === 'light' ? 'dark' : 'light');
}
</script>

