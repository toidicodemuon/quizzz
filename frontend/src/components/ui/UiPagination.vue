<template>
  <div class="join">
    <button class="join-item btn" :disabled="page <= 1" @click="goTo(page - 1)">«</button>
    <button class="join-item btn">{{ page }} / {{ totalPages }}</button>
    <button class="join-item btn" :disabled="page >= totalPages" @click="goTo(page + 1)">»</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ page: number; pageSize: number; total: number }>();
const emit = defineEmits<{ (e: 'update:page', value: number): void }>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / (props.pageSize || 1))));
function goTo(p: number) {
  if (p < 1 || p > totalPages.value) return;
  emit('update:page', p);
}
</script>

