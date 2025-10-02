<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
    <slot />
  </button>
  
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();

const classes = computed(() => {
  const base = ['btn'];
  const v = props.variant ?? 'primary';
  const s = props.size ?? 'md';
  base.push(
    v === 'primary'
      ? 'btn-primary'
      : v === 'secondary'
      ? 'btn-secondary'
      : v === 'danger'
      ? 'btn-error'
      : 'btn-outline'
  );
  base.push(s === 'sm' ? 'btn-sm' : s === 'lg' ? 'btn-lg' : '');
  return base.join(' ');
});

const type = computed(() => props.type ?? 'button');
</script>

